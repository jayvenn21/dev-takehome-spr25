import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    requestorName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    itemRequested: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    lastEditedDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'approved', 'rejected'],
        default: 'pending',
        required: true,
    },
});

// Export the model, checking if it already exists
export const Request =
    mongoose.models.Request || mongoose.model('Request', RequestSchema);
