const { gql } = require("apollo-server-hapi");

const typeDefs = gql`
  type User {
    id: String!
    name: String
    dob: String
    address: String
    description: String
    createdAt: String
    updatedAt: String
  }
  type Query {
    findUsers: [User]
    showUser(id: String!): User
    createUser(name: String, dob: String, address: String, description: String, createdAt: String, updatedAt: String): User
    updateUser(id: String!, name: String, dob: String, address: String, description: String, createdAt: String, updatedAt: String): User
  }
`;

module.exports = typeDefs;
