import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        techStack:{
            type: String,
            required:true, 
        }, 
        imageUrl:{
            type: String, 
            required: true
        },
        imageId:{
            type: String, 
            required: true,
        },
        liveUrl:{
            type:String, 
            required: true,
        }, 
        featured: {
            type: Boolean, 
            required: true, 
            default: true, 

        }
    },
    { timestamps: true }
);

export const Experience = mongoose.model('Experience', experienceSchema);

