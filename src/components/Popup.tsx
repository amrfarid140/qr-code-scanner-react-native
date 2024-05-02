import React from 'react';
import {Modal, ModalProps, View} from 'react-native';

export const Popup: React.FC<ModalProps> = props => (
  <Modal {...props}>
    <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%'}}>
      {props.children}
    </View>
  </Modal>
);
