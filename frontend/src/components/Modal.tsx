import React, { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client';
import isEmpty from 'lodash/isEmpty';

import { device } from '../helpers/device';
import { User } from '../helpers/model';
import { UPDATE_USER, UpdateUserResult } from '../helpers/graphql';

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
    <AnimatePresence>
      {open && (
        <Overlay
          initial="initial"
          animate="isOpen"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            isOpen: { opacity: 1 },
            exit: { opacity: 0 }
          }}
          onClick={onClose}
        >
          <Container
            variants={{
              initial: { top: '-50%', transition: { type: 'spring' } },
              isOpen: { top: '50%' },
              exit: { top: '-50%' }
            }}
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              // prevent overlay's onClick event from firing
              e.stopPropagation();
            }}
          >
            <Caption>Edit user</Caption>
            <GridContainer>
              <GridItem>
                <GMap />
              </GridItem>
              <GridItem>
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
              </GridItem>
            </GridContainer>
            <ActionBar>
              <Button onClick={handleSave}>SAVE</Button>
              <Button onClick={onClose}>CANCEL</Button>
            </ActionBar>
          </Container>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled(motion.div)`
  width: 90%;
  background-color: #f8f8f8;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 8px;
  @media ${device.mobileM} {
    width: 85%;
    padding: 12px;
  }
  @media ${device.mobileL} {
    width: 80%;
    padding: 16px;
  }
  @media ${device.tablet} {
    width: 75%;
    padding: 24px;
  }
  @media ${device.laptop} {
    width: 70%;
    padding: 48px;
  }
  @media ${device.desktop} {
    width: 65%;
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

const GridContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
`;

const GridItem = styled.div`
  box-sizing: border-box;
  flex-basis: 100%;
  max-width: 100%;
  padding: 4px;
  @media ${device.mobileM} {
    flex-basis: 100%;
    max-width: 100%;
    padding: 4px;
  }
  @media ${device.mobileL} {
    flex-basis: 100%;
    max-width: 100%;
    padding: 4px;
  }
  @media ${device.tablet} {
    flex-basis: 50%;
    max-width: 50%;
    padding: 6px;
  }
  @media ${device.laptop} {
    flex-basis: 50%;
    max-width: 50%;
    padding: 8px;
  }
  @media ${device.desktop} {
    flex-basis: 50%;
    max-width: 50%;
    padding: 12px;
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
