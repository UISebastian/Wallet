import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import jwt from "jsonwebtoken";
import DataLoader from "dataloader";
import express from "express";
import {ApolloServer, AuthenticationError,} from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolver";
import models, {connectDb} from "./model";
import loaders from "./loaders";

//express server

const app = express();

app.use(cors());
app.use(morgan("dev"));


// check if user has valid xsrf-token
const getMe = async req => {
    const token = req.headers["x-token"];
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (e) {
            console.log("No valid session");
            // TODO: Manage No valid session differently

        }
    }
};

// create server
const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers,
    formatError: error => {
        // remove the internal sequelize error message
        // leave only the important validation error
        const message = error.message
            .replace("SequelizeValidationError: ", "")
            .replace("Validation error: ", "");
        return {
            ...error,
            message,
        };
    },
    context: async ({
                        req,
                        connection
                    }) => {
        if (connection) {
            return {
                models,
                loaders: {
                    user: new DataLoader(keys =>
                        loaders.user.batchUsers(keys, models),
                    ),
                },
            };
        }
        if (req) {
            const me = await getMe(req);
            return {
                models,
                me,
                secret: process.env.SECRET,
                loaders: {
                    user: new DataLoader(keys =>
                        loaders.user.batchUsers(keys, models),
                    ),
                },
            };
        }
    },
});

server.applyMiddleware({
    app,
    path: "/graphql"
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// const isTest = !!process.env.TEST_DATABASE_URL;
// const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 8000;

connectDb().then(async () => {
    httpServer.listen({
        port
    }, () => {
        console.log(`Apollo Server on http://localhost:${port}/graphql`);
    });
});
