import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';

import { device } from '../device';
import { User, FIND_USERS } from '../helpers';

import Card from './Card';

const Home: FunctionComponent = () => {
  const { loading, error, data } = useQuery(FIND_USERS);

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
          />
        </Heading>
        <Grid>
          {data.findUsers.map((user: User, index: number) => (
            <Card key={index} user={user} />
          ))}
        </Grid>
      </Container>
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
  grid-template-columns: auto;
  gap: 8px;
  @media ${device.mobileM} {
    grid-template-columns: auto auto;
    gap: 12px;
  }
  @media ${device.mobileL} {
    grid-template-columns: auto auto;
    gap: 16px;
  }
  @media ${device.tablet} {
    grid-template-columns: auto auto auto;
    gap: 24px;
  }
  @media ${device.laptop} {
    grid-template-columns: auto auto auto;
    gap: 48px;
  }
  @media ${device.desktop} {
    grid-template-columns: auto auto auto;
    gap: 64px;
  }
`;

export default Home;
