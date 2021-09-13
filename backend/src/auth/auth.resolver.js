import {ForbiddenError} from 'apollo-server';
import {combineResolvers, skip} from 'graphql-resolvers';

// is the user authenticated?
export const isAuthenticated = (parent, args, {me}) =>
    me ? skip : new ForbiddenError('Not authenticated as user.');

// is the user an admin?
export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, {me: {role}}) =>
        role === 'ADMIN'
            ? skip
            : new ForbiddenError('Not authorized as admin.'),
);

