import React, {useState} from 'react';
import {
  Alert,
  ModalProps,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SavedUrl, useStoredUrlsMutation} from '../storage/useUrlStorage.ts';
import {Popup} from '@components/Popup.tsx';

interface Props extends ModalProps {
  readonly onHideModal: () => void;
  readonly url: SavedUrl | null;
}
export const UpdateUrlNameModal: React.FC<Props> = props => {
  const [enteredName, setEnteredName] = useState<string | null>(
    props.url?.name ?? null,
  );
  const {updateUrlName} = useStoredUrlsMutation();

  if (props.url == null) {
    return null;
  }

  return (
    <Popup {...props}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>URL name</Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              placeholder="URL name"
              value={enteredName ?? undefined}
              onChangeText={setEnteredName}
              style={{
                flexGrow: 1,
                borderWidth: 1,
                borderRadius: 8,
                marginVertical: 24,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
              gap: 12,
            }}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.onHideModal()}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                updateUrlName(props.url!.url, enteredName);
                props.onHideModal();
              }}>
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
});
