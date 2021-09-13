import mongoose from 'mongoose';

const messageModel = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
);

const Message = mongoose.model('Message', messageModel);

export default Message;
