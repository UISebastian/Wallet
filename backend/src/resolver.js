import {GraphQLDateTime} from 'graphql-iso-date';
import userResolvers from './api/user/user.resolver';

const customScalarResolver ={
    Date: GraphQLDateTime,
};

export default [
    userResolvers
];
