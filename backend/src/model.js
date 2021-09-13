import mongoose from "mongoose";
import User from './api/user/user.model';
import Message from './api/message/message.model';

const connectDb = () => {
    if (process.env.TEST_DATABASE_URL) {
        return mongoose.connect(
            process.env.TEST_DATABASE_URL,
            {useNewUrlParser: true},
        );
    }
    if (process.env.DATABASE_URL) {
        return mongoose.connect(
            process.env.DATABASE_URL,
            {useNewUrlParser: true},
        );
    }
};

const models ={
     User,
    Message
};

export {connectDb};
export default models;
