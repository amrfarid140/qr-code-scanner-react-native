import React, {useEffect} from 'react';
import {FlatList, Pressable, Text} from 'react-native';
import {useStoredUrls} from '../storage/useUrlStorage.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';

export const UrlListScreen: React.FC<{}> = () => {
  const storedUrls = useStoredUrls();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('ScanCode')}>
          <Text>Add</Text>
        </Pressable>
      ),
    });
  }, [navigation]);
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
