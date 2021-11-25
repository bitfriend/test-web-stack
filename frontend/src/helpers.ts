import { gql } from '@apollo/client';

export interface User {
  id: string;
  name?: string;
  dob?: string;
  address?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const FIND_USERS = gql`
  query ($search: String, $page: Int, $limit: Int) {
    findUsers(search: $search, page: $page, limit: $limit) {
      id
      name
      dob
      address
      description
      createdAt
      updatedAt
    }
  }
`;

export interface FindUsersResult {
  findUsers: User[];
}

export const UPDATE_USER = gql`
  mutation ($id: String!, $name: String, $dob: String, $address: String, $description: String) {
    updateUser(id: $id, name: $name, dob: $dob, address: $address, description: $description) {
      id
      name
      dob
      address
      description
      createdAt
      updatedAt
    }
  }
`;

export interface UpdateUserResult {
  updateUser: User;
}
