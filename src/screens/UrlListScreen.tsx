import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useStoredUrls} from '../storage/useUrlStorage.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';

export const UrlListScreen: React.FC = () => {
  const storedUrls = useStoredUrls();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();

  return (
    <>
      <FlatList
        data={storedUrls}
        renderItem={info => {
          return <Text>{info.item.name ?? info.item.url}</Text>;
        }}
        keyExtractor={item => item.url}
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPressOut={() => navigation.navigate('ScanCode')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
