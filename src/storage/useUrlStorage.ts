import {useMMKVObject} from 'react-native-mmkv';
import {useCallback} from 'react';
import {Linking} from 'react-native';

interface SavedUrl {
  readonly name: string | null;
  readonly url: string;
}

interface UrlStorageReturn {
  readonly savedUrls: SavedUrl[];

  readonly addUrl: (url: string) => Promise<boolean>;
}

const useUrlStorage = () =>
  useMMKVObject<{
    readonly [key: string]: SavedUrl;
  }>('urls');

export const useStoredUrls = (): UrlStorageReturn['savedUrls'] =>
  Object.values(useUrlStorage()[0] ?? {});

export const useStoredUrlsMutation = (): Omit<
  UrlStorageReturn,
  'savedUrls'
> => {
  const [_, setUrls] = useUrlStorage();

  return {
    addUrl: useCallback(
      async (newUrl: string) => {
        if (await Linking.canOpenURL(newUrl)) {
          setUrls(prevValue => {
            console.log('AMR', prevValue);
            return {
              ...prevValue,
              [newUrl]: {
                url: newUrl,
                name: null,
              },
            };
          });
          return true;
        } else {
          return false;
        }
      },
      [setUrls],
    ),
  };
};
//TODO: add update url name and delete url
