import {GraphQLDateTime} from 'graphql-iso-date';
import userResolvers from './api/user/user.resolver';
import messageResolvers from './api/message/message.resolver';

const customScalarResolver ={
    Date: GraphQLDateTime,
};

export default [
    userResolvers,
    messageResolvers,
    customScalarResolver
];
