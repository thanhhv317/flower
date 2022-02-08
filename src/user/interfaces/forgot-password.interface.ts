import { Document } from 'mongoose';

export interface ForgotPassword extends Document {
    email: string;
    verification: string;
    first_used: boolean;
    final_used: boolean;
    expires: Date;
    iprequest: string;
    browser_request: string;
    country_request: string;
    ip_changed: string;
    browser_changed: string;
    country_changed: string;
}