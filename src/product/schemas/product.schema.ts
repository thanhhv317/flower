import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    name: { 
        type: String 
    },
    description: {
        type: String
    },
    sku: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    price: {
        type: Number,
        default: 0
    },
    special_price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    category_ids: {
        type: [String]
    },
    create_user: {
        type: String
    },
    update_user: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", 'DELETE', 'INACTIVE'],
        default: "ACTIVE"
    }
}, {
    versionKey: false,
    timestamps: true,
})
