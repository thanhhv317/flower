import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt'

export const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'NAME_IS_BLANK']
    },
    email: {
        type: String,
        lowercase: true,
        validate: validator.isEmail,
        maxlength: 255,
        minlength: 6,
        required: [true, 'EMAIL_IS_BLANK'],
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: [true, 'PASSWORD_IS_BLANK'],
    },
    phone: {
        type: String,
    },
    address: {
        type: Object
    },
    image: {
        type: String
    },
    roles: {
        type: [String],
        default: ['user']
    }
}, {
    versionKey: false,
    timestamps: true,
})

UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        // tslint:disable-next-line:no-string-literal
        const hashed = await bcrypt.hash(this['password'], 10);
        // tslint:disable-next-line:no-string-literal
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});