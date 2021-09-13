import mongoose from "mongoose";
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail";

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            validate: [isEmail, "No valid email address provided."],
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "password to short"],
            maxlength: [200, "password to long"],
        },
        avatar: {
            type: String,
        },
        telephone_number: {
            type: String,
            required: true
        },
        roleId: {
            type: String
            // type: mongoose.Schema.Types.ObjectId, ref: "Role",
            //TODO
            // required: true
        },
        //TODO: Think about what properties a user needs in order to participate in etherum network
    },
    {
        timestamps: true
    }
);

userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
        username: login,
    });
    if (!user) {
        user = await this.findOne({email: login});
    }
    return user;
};

userSchema.pre("remove", function (next) {
    this.model("Message").deleteMany({userId: this._id}, next);
});

userSchema.pre("save", async function () {
    this.password = await this.generatePasswordHash();
});

userSchema.methods.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
};

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
