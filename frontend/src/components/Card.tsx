import React, { FunctionComponent, MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { MdOutlineEdit } from 'react-icons/md';

import { User } from '../helpers';
import { device } from '../device';

interface CardProps {
  user: User;
  onEdit: () => void;
}

const Card: FunctionComponent<CardProps> = ({ user, onEdit }) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    setIsHover(true);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    setIsHover(false);
  };

  return (
    <Container onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <div style={{ textAlign: 'center' }}>
        <Avatar src={`https://thispersondoesnotexist.com/image?random=${user.id}`} />
      </div>
      <Header>{user.name}</Header>
      <Subheader>{user.description}</Subheader>
      {isHover && (
        <EditIcon onClick={onEdit}>
          <MdOutlineEdit />
        </EditIcon>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff;
  position: relative;
  padding: 20px;
  border-radius: 4px;
  @media ${device.laptop} {
    padding: 30px;
    border-radius: 6px;
  }
  @media ${device.desktop} {
    padding: 40px;
    border-radius: 8px;
  }
  :hover {
    filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1));
    @media ${device.laptop} {
      filter: drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.1));
    }
    @media ${device.desktop} {
      filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
    }
  }
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 84px;
  height: 84px;
  @media ${device.laptop} {
    width: 126px;
    height: 126px;
  }
  @media ${device.desktop} {
    width: 168px;
    height: 168px;
  }
`;

const Header = styled.div`
  width: 100%;
  white-space: nowrap;
  overflow-x: hidden;
  margin-top: 16px;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  @media ${device.laptop} {
    margin-top: 24px;
    margin-bottom: 6px;
    font-size: 17px;
  }
  @media ${device.desktop} {
    margin-top: 32px;
    margin-bottom: 8px;
    font-size: 21px;
  }
`;

const Subheader = styled.div`
  font-size: 8px;
  font-weight: 300;
  @media ${device.laptop} {
    font-size: 12px;
  }
  @media ${device.desktop} {
    font-size: 16px;
  }
`;

const EditIcon = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 8px;
  @media ${device.laptop} {
    top: 6px;
    right: 6px;
    padding: 12px;
  }
  @media ${device.desktop} {
    top: 8px;
    right: 8px;
    padding: 16px;
  }
  :hover {
    background-color: #f8f8f8;
    cursor: pointer;
  }
`;

export default Card;
