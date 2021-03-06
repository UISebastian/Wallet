import jwt from "jsonwebtoken";
import {combineResolvers} from "graphql-resolvers";
import {AuthenticationError, UserInputError} from "apollo-server";
import {isAdmin, isAuthenticated} from "../auth/auth.resolver";
import mongoose from "mongoose";

const createToken = async (user, secret, expiresIn) => {
    const {id, email, username, role} = user;
    return await jwt.sign({id, email, username, role}, secret, {
        expiresIn,
    });
};

export default {
    Query: {
        users: async (parent, args, {models}) => {
            return models.User.find();
        },
        user: async (parent, {id}, {models}) => {
            return models.User.findById(id);
        },
        me: async (parent, args, {models, me}) => {
            if (!me) {
                return null;
            }
            return models.User.findById(me.id);
        },

    },

    Mutation: {
        signUp: async (
            parent,
            {
                username,
                first_name,
                last_name,
                email,
                password,



            },
            {models, secret},
        ) => {
            const user = await models.User.create({
                username,
                first_name,
                last_name,
                email,
                password,


            });
            return {token: createToken(user, secret, "30m")};
        },

        signIn: async (
            parent,
            {login, password},
            {models, secret},
        ) => {
            const user = await models.User.findByLogin(login);
            if (!user) {
                throw new UserInputError(
                    "No user found with this login credentials.",
                );
            }
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                throw new AuthenticationError("Invalid password.");
            }
            return {token: createToken(user, secret, "30m")};
        },

        updateUser: combineResolvers(
            isAuthenticated,
            async (parent, {username}, {models, me}) => {
                return models.User.findByIdAndUpdate(
                    me.id,
                    {username},
                    {new: true},
                );
            },
        ),

        deleteUser: combineResolvers(
            isAuthenticated,
            async (parent, {id}, {models}) => {
                const user = await models.User.findById(id);
                if (user) {
                    await user.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),


    },

    User: {
        messages: async (user, args, {models}) => {
            return models.Message.find({
                userId: user.id,
            });
        },
    },
};
