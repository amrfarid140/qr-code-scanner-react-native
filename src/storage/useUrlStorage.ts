import {useMMKVObject} from 'react-native-mmkv';
import {useCallback} from 'react';
import {Linking} from 'react-native';

export interface SavedUrl {
  readonly name: string | null;
  readonly url: string;
}

interface UrlStorageReturn {
  readonly savedUrls: SavedUrl[];

  readonly addUrl: (url: string) => Promise<boolean>;
  readonly deleteUrl: (url: string) => void;
  readonly updateUrlName: (url: string, name: string) => void;
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
    updateUrlName: useCallback(
      (url: string, newName: string) => {
        setUrls(prevValue => {
          return {
            ...prevValue,
            [url]: {
              url,
              name: newName,
            },
          };
        });
      },
      [setUrls],
    ),
    deleteUrl: useCallback(
      (newUrl: string) => {
        setUrls(prevValue => {
          const urlsCopy = {
            ...prevValue,
          };
          delete urlsCopy[newUrl];
          return urlsCopy;
        });
      },
      [setUrls],
    ),
    addUrl: useCallback(
      async (newUrl: string) => {
        if (await Linking.canOpenURL(newUrl)) {
          setUrls(prevValue => {
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
