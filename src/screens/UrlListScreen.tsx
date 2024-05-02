import React from 'react';
import {
  Button,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useStoredUrls,
  useStoredUrlsMutation,
} from '../storage/useUrlStorage.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';

const ItemSeparator = () => <View style={styles.itemSeparator} />;

export const UrlListScreen: React.FC = () => {
  const storedUrls = useStoredUrls();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  const {deleteUrl} = useStoredUrlsMutation();

  return (
    <>
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
              <Button title="Delete" onPress={() => deleteUrl(info.item.url)} />
              <Button title="Update" />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={item => item.url}
      />
      <TouchableOpacity
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
  },
  urlContainer: {
    flex: 1,
  },
  urlContainerText: {
    width: '100%',
  },
  subtitle: {
    color: '#f5f5f5',
    fontWeight: '300',
    fontSize: 18,
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
