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
  type FindUsersResponse {
    totalItems: Int
    items: [User]
  }
  type DeleteUserResponse {
    id: String!
  }
  type Query {
    findUsers(search: String, page: Int, limit: Int): FindUsersResponse
    showUser(id: String!): User
  }
  type Mutation {
    createUser(name: String, dob: String, address: String, description: String): User
    updateUser(id: String!, name: String, dob: String, address: String, description: String): User
    deleteUser(id: String!): DeleteUserResponse
  }
`;

module.exports = typeDefs;
