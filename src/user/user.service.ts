import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { addHours } from 'date-fns';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { UserEntity } from './entities/user.entity';
import { UserLoginEntity } from './entities/user-login.entity';

@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
        private readonly authService: AuthService,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = new this.userModel(createUserDto);
        await this.isEmailUnique(user.email);

        await user.save();
        return new UserEntity(user);
    }

    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({ email, verified: true });
        if (user) {
            throw new BadRequestException('Email most be unique.');
        }
    }

    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email, verified: true });
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            await this.passwordsDoNotMatch(user);
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }

    private isUserBlocked(user) {
        if (user.blockExpires > Date.now()) {
            throw new ConflictException('User has been blocked try later.');
        }
    }

    private async passwordsDoNotMatch(user) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
            await this.blockUser(user);
            throw new ConflictException('User blocked.');
        }
    }

    private async passwordsAreMatch(user) {
        user.loginAttempts = 0;
        return await user.save();
    }

    private async blockUser(user) {
        user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
        await user.save();
    }

    async login(req: Request, loginUserDto: LoginDto): Promise<UserLoginEntity> {
        const user = await this.findUserByEmail(loginUserDto.email);
        this.isUserBlocked(user);
        const [checkPassword, passwordMatch, accessToken, refreshToken] = await Promise.all([
            this.checkPassword(loginUserDto.password, user),
            this.passwordsAreMatch(user),
            this.authService.createAccessToken(user._id),
            this.authService.createRefreshToken(req, user._id)
        ]);

         const userLogin = { ...user["_doc"], 
            access_token: accessToken,
            refresh_token: refreshToken,
        };
        return new UserLoginEntity(userLogin);
    }

    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
        const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refresh_token);
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('Bad request');
        }
        return {
            access_token: await this.authService.createAccessToken(user._id),
        };
    }

}
