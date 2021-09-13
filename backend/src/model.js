import mongoose from "mongoose";

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
    /* User,*/
};

export {connectDb};
export default models;
