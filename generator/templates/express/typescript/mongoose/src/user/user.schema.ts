import { z } from 'zod';
import { Schema } from 'mongoose';

export const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export const UserCreateSchema = z.object({
    body: z.object({
        username: z.string().min(1, {
            message: "Username cannot be empty"
        }),
        password: z.string().min(4, {
            message: 'Password too short'
        })
    })
})

export const UserUpdateSchema = z.object({

    body: z.object({
        username: z.string().min(1, {
            message: "Username cannot be empty"
        }).optional(),
        password: z.string().min(4, {
            message: 'Password too short'
        }).optional()
    }),
    params: z.object({
        id: z.string().min(1, {
            message: 'Please provide the id in params'
        })
    })
})

export const UserDeleteSchema = z.object({
    params: z.object({
        id: z.string().min(1, {
            message: 'Please provide the id in params'
        })
    })
})
