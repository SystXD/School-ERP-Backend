import { Schema, model } from 'mongoose'

export const Section = model('Section', new Schema(
    {
        class: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
        },
        name: { type: String, required: true },
        students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
        totalStudents: { type: Number, default: 0 }
    }, { timestamps: true }
))