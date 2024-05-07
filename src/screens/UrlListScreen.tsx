import React, {useState} from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SavedUrl,
  useStoredUrls,
  useStoredUrlsMutation,
} from '../storage/useUrlStorage.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';
import {UpdateUrlNameModal} from '@components/UpdateUrlNameModal.tsx';
import {PressableButton} from '@components/PressableButton.tsx';

const ItemSeparator = () => <View style={styles.itemSeparator} />;

export const UrlListScreen: React.FC = () => {
  const storedUrls = useStoredUrls();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  const {deleteUrl} = useStoredUrlsMutation();
  const [selectedUrl, setSelectedUrl] = useState<SavedUrl | null>(null);

  return (
    <>
      <UpdateUrlNameModal
        testID="name-modal"
        animationType="fade"
        transparent={true}
        visible={selectedUrl !== null}
        url={selectedUrl}
        onHideModal={() => setSelectedUrl(null)}
      />
      <FlatList
        data={storedUrls}
        renderItem={info => {
          return (
            <Pressable
              style={styles.itemContainer}
              android_ripple={{borderless: false}}
              onPress={() => Linking.openURL(info.item.url)}>
              <View style={styles.urlContainer}>
                <Text style={styles.urlContainerText}>
                  {info.item.name ?? info.item.url}
                </Text>
                {info.item.name && (
                  <Text style={[styles.urlContainerText, styles.subtitle]}>
                    {info.item.url}
                  </Text>
                )}
              </View>
              <PressableButton
                label="Delete"
                onPress={() => deleteUrl(info.item.url)}
              />
              <PressableButton
                label="Update name"
                onPress={() => setSelectedUrl(info.item)}
              />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={item => item.url}
      />
      <TouchableOpacity
        testID="scan-code"
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('ScanCode')}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  itemSeparator: {
    height: 2,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    padding: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 8,
  },
  urlContainer: {
    flex: 1,
  },
  urlContainerText: {
    color: 'black',
    width: '100%',
  },
  subtitle: {
    color: '#ababab',
    fontWeight: '300',
    fontSize: 16,
    marginTop: 6,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 120,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
