import React, {useState} from 'react';
import {ModalProps, StyleSheet, Text, TextInput, View} from 'react-native';
import {SavedUrl, useStoredUrlsMutation} from '../storage/useUrlStorage.ts';
import {Popup} from '@components/Popup.tsx';
import {PressableButton} from '@components/PressableButton.tsx';

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
              placeholderTextColor="#ababab"
              onChangeText={setEnteredName}
              style={styles.textInput}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <PressableButton
              label="Cancel"
              onPress={() => props.onHideModal()}
            />
            <PressableButton
              label="Save"
              onPress={() => {
                updateUrlName(props.url!.url, enteredName);
                props.onHideModal();
              }}
            />
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
    color: 'black',
    padding: 12,
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
    color: 'black',
  },
});
