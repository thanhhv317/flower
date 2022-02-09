import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
    name: { type: String },
    description: {
        type: String,
        minlength: 10
    },
    image: {
        type: String
    },

    create_user: {
        type: String
    },

    update_user: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", 'DELETE'],
        default: "ACTIVE"
    }
}, {
    versionKey: false,
    timestamps: true,
})
