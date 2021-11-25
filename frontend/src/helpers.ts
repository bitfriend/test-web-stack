import { gql } from '@apollo/client';

export interface User {
  id: string;
  name: string;
  dob: string;
  address: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const FIND_USERS = gql`
  query User {
    findUsers {
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
