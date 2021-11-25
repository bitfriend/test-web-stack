import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';

import { device } from '../helpers/device';
import { useBreakpoint } from '../helpers/breakpoint';
import { User } from '../helpers/model';
import { FIND_USERS, FindUsersResult } from '../helpers/graphql';

import Card from './Card';
import Modal from './Modal';

const Home: FunctionComponent = () => {
  const breakpoints = useBreakpoint();
  console.log('breakpoints', breakpoints);

  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState(-1);
  const [keyword, setKeyword] = useState('');

  const { loading, error, data, refetch, fetchMore } = useQuery<FindUsersResult>(FIND_USERS, {
    variables: {
      search: keyword,
      limit: 6
    }
  });

  function updateUsers(data: FindUsersResult | undefined) {
    const result = Array.from(users);
    data?.findUsers.forEach(x => {
      const index = result.findIndex(y => y.id === x.id);
      if (index === -1) {
        result.push(x);
      } else {
        const { name, dob, address, description, updatedAt } = x;
        if (!!name) {
          result[index] = { ...result[index], name };
        }
        if (!!dob) {
          result[index] = { ...result[index], dob };
        }
        if (!!address) {
          result[index] = { ...result[index], address };
        }
        if (!!description) {
          result[index] = { ...result[index], description };
        }
        if (!!updatedAt) {
          result[index] = { ...result[index], updatedAt };
        }
      }
    });
    setUsers(result);
  }

  // avoid assigning null due to partial update
  useEffect(() => {
    updateUsers(data);
  }, [data?.findUsers]);

  useEffect(() => {
    async function fetchUsers(search: string) {
      const { loading, error, data } = await refetch({ search, limit: 6 });
      setUsers(data.findUsers);
    }
    fetchUsers(keyword);
  }, [keyword]);

  if (loading) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p>Error occurred</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f8f8' }}>
      <Container>
        <Heading>
          <Caption>Users list</Caption>
          <SearchBox
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Heading>
        <Grid>
          {users.map((user: User, index: number) => (
            <Card
              key={index}
              user={user}
              onEdit={() => setActiveUser(index)}
            />
          ))}
        </Grid>
      </Container>
      <Modal
        open={activeUser !== -1}
        user={activeUser === -1 ? null : (users[activeUser] || null)}
        onClose={() => setActiveUser(-1)}
      />
    </div>
  );
}

const Container = styled.div`
  margin: auto;
  padding: 50px 8px;
  @media ${device.laptop} {
    max-width: 800px;
    padding: 100px 12px;
  }
  @media ${device.desktop} {
    max-width: 1440px;
    padding: 200px 16px;
  }
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  @media ${device.laptop} {
    margin-bottom: 54px;
  }
  @media ${device.desktop} {
    margin-bottom: 72px;
  }
`;

const Caption = styled.div`
  font-weight: 300;
  font-size: 24px;
  @media ${device.laptop} {
    font-size: 36px;
  }
  @media ${device.desktop} {
    font-size: 48px;
  }
`;

const SearchBox = styled.input`
  font-weight: 300;
  border-color: rgba(0, 0, 0, 19%);
  padding: 8px;
  font-size: 12px;
  border-radius: 4px;
  @media ${device.laptop} {
    padding: 12px;
    font-size: 18px;
    border-radius: 6px;
  }
  @media ${device.desktop} {
    padding: 16px;
    font-size: 24px;
    border-radius: 8px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  @media ${device.mobileM} {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media ${device.mobileL} {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media ${device.tablet} {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
  }
  @media ${device.laptop} {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 48px;
  }
  @media ${device.desktop} {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 64px;
  }
`;

export default Home;
