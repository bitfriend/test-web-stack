import { gql } from '@apollo/client';

import { User } from './model';

export const FIND_USERS = gql`
  query ($search: String, $page: Int, $limit: Int) {
    findUsers(search: $search, page: $page, limit: $limit) {
      items {
        id
        name
        dob
        address
        description
        createdAt
        updatedAt
      }
      totalItems
    }
  }
`;

export interface FindUsersResult {
  findUsers: {
    items: User[];
    totalItems: number;
  }
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
