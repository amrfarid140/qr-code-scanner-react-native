import {useMMKVObject} from 'react-native-mmkv';
import {useCallback, useMemo} from 'react';
import * as url from 'node:url';

interface SavedUrl {
  readonly name: string | null;
  readonly url: string;
}

interface UrlStorageReturn {
  readonly savedUrls: SavedUrl[];

  readonly addUrl: (url: string) => void;
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
      (newUrl: string) => {
        //TODO: add validation
        setUrls(prevValue => ({
          ...prevValue,
          url: {
            url: newUrl,
            name: null,
          },
        }));
      },
      [setUrls],
    ),
  };
};
//TODO: add update url name and delete url
