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
    users: [User]
    user(id: String!): User
  }
`;

module.exports = typeDefs;
