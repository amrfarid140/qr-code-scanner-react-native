import React, {useCallback, useEffect} from 'react';
import {Button, FlatList, Pressable, Text} from 'react-native';
import {useStoredUrls} from '../storage/useUrlStorage.ts';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';

export const UrlListScreen: React.FC<{}> = () => {
  const storedUrls = useStoredUrls();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={() => navigation.navigate('ScanCode')} title="Add" />
        ),
      });
    }, [navigation]),
  );
  return (
    <FlatList
      data={storedUrls}
      renderItem={info => {
        return <Text>{info.item.name ?? info.item.url}</Text>;
      }}
      keyExtractor={item => item.url}
    />
  );
};
