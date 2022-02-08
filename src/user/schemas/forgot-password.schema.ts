import { Schema } from 'mongoose';
import * as validator from 'validator';

export const ForgotPasswordSchema = new Schema ({
    email: {
        required: [true, 'EMAIL_IS_BLANK'],
        type: String,
        requierd: true,
    },
    verification: {
        type: String,
        validate: validator.isUUID,
        requierd: true,
    },
    first_used: {
        type: Boolean,
        default: false,
    },
    final_used: {
        type: Boolean,
        default: false,
    },
    expires: {
        type: Date,
        requierd: true,
    },
    ip: {
        type: String,
        requierd: true,
    },
    browser: {
        type: String,
        requierd: true,
    },
    country: {
        type: String,
        requierd: true,
    },
    ip_changed: {
        type: String,
    },
    browser_changed: {
        type: String,
    },
    country_changed: {
        type: String,
    },
},
{
    versionKey: false,
    timestamps: true,
});