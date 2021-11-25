import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';

import { device } from '../device';
import { User, UPDATE_USER, UpdateUserResult } from '../helpers';

import GMap from './GMap';

interface ModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const Modal: FunctionComponent<ModalProps> = ({ open, user, onClose }) => {
  const [updateUser, { data, loading, error }] = useMutation<UpdateUserResult>(UPDATE_USER);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setAddress(user?.address || '');
    setDescription(user?.description || '');
  }, [user]);

  const handleSave = () => {
    const bindVars: any = {};
    if (user?.name !== name) {
      bindVars.name = name;
    }
    if (user?.address !== address) {
      bindVars.address = address;
    }
    if (user?.description !== description) {
      bindVars.description = description;
    }
    if (!isEmpty(bindVars)) {
      bindVars.id = user?.id;
      updateUser({ variables: bindVars });
    }
    onClose();
  }

  return (
    <Fragment>
      <Container open={open} className={open ? 'modal visible' : 'modal'}>
        <Caption>Edit user</Caption>
        <Grid>
          <GMap />
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <FormControl>
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Label>Address</Label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Label>Description</Label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </div>
        </Grid>
        <ActionBar>
          <Button onClick={handleSave}>SAVE</Button>
          <Button onClick={onClose}>CANCEL</Button>
        </ActionBar>
      </Container>
      <Overlay open={open} onClick={onClose} />
    </Fragment>
  );
}

interface OverlayProps {
  open: boolean;
};

const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.open ? 'block' : 'none'};
  z-index: 5;
`;

interface ContainerProps {
  open: boolean;
};

const Container = styled.div<ContainerProps>`
  position: fixed;
  top: -50%;
  left: 50%;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 8px;
  z-index: 10;
  transition: all 0.3s ease-out;
  @media ${device.mobileM} {
    padding: 12px;
  }
  @media ${device.mobileL} {
    padding: 16px;
  }
  @media ${device.tablet} {
    padding: 24px;
  }
  @media ${device.laptop} {
    padding: 48px;
  }
  @media ${device.desktop} {
    padding: 64px;
  }
`;

const Caption = styled.div`
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 300;
  @media ${device.mobileM} {
    margin-bottom: 24px;
    font-size: 32px;
  }
  @media ${device.mobileL} {
    margin-bottom: 32px;
    font-size: 36px;
  }
  @media ${device.tablet} {
    margin-bottom: 48px;
    font-size: 40px;
  }
  @media ${device.laptop} {
    margin-bottom: 56px;
    font-size: 44px;
  }
  @media ${device.desktop} {
    margin-bottom: 64px;
    font-size: 48px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;
  gap: 8px;
  @media ${device.mobileM} {
    grid-template-columns: auto;
    gap: 12px;
  }
  @media ${device.mobileL} {
    grid-template-columns: auto auto;
    gap: 16px;
  }
  @media ${device.tablet} {
    grid-template-columns: auto auto;
    gap: 24px;
  }
  @media ${device.laptop} {
    grid-template-columns: auto auto;
    gap: 48px;
  }
  @media ${device.desktop} {
    grid-template-columns: auto auto;
    gap: 64px;
  }
`;

const FormControl = styled.div`
  width: 100%;
`;

const Label = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  @media ${device.laptop} {
    margin-bottom: 6px;
    font-size: 15px;
  }
  @media ${device.desktop} {
    margin-bottom: 8px;
    font-size: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 8px;
  border-radius: 8px;
  border-color: rgba(0, 0, 0, 19%);
  @media ${device.laptop} {
    font-size: 20px;
    padding: 12px;
  }
  @media ${device.desktop} {
    font-size: 24px;
    padding: 16px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  @media ${device.laptop} {
    margin-top: 48px;
  }
  @media ${device.desktop} {
    margin-top: 64px;
  }
`;

const Button = styled.button`
  font-size: 12px;
  font-weight: 600;
  width: 100px;
  height: 40px;
  margin-left: 16px;
  border: 2px solid rgba(0, 0, 0, 19%);
  border-radius: 4px;
  @media ${device.laptop} {
    font-size: 18px;
    width: 120px;
    height: 48px;
    margin-left: 20px;
    border: 3px solid rgba(0, 0, 0, 19%);
    border-radius: 6px;
  }
  @media ${device.desktop} {
    font-size: 24px;
    width: 160px;
    height: 56px;
    margin-left: 24px;
    border: 4px solid rgba(0, 0, 0, 19%);
    border-radius: 8px;
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default Modal;
