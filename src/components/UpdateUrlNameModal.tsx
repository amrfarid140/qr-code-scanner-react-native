import React, {useState} from 'react';
import {
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
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="URL name"
              value={enteredName ?? undefined}
              onChangeText={setEnteredName}
              style={styles.textInput}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={styles.button}
              onPress={() => props.onHideModal()}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
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
  textInputContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
