import React from 'react';
import {FlatList, Text} from 'react-native';
import {useStoredUrls} from '../storage/useUrlStorage.ts';

export const UrlListScreen: React.FC<{}> = () => {
  const storedUrls = useStoredUrls();
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
