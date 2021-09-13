import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
    
  }

  extend type Mutation {
    signUp(
      username: String!
      first_name: String!
      last_name: String!
      email: String!
      password: String!
      avatar: String
    ): Token!

    signIn(login: String!, password: String!): Token!
    
    updateUser(username: String!): User!
    
    deleteUser(id: ID!): Boolean!
    
    
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    avatar: String
    telephone_number: String!
    role: String
    messages: [Message!],
    
  }
`;
//TODO add get amount of Ether
//TODO add getEther
//TODO add Ether variable in type User{}
