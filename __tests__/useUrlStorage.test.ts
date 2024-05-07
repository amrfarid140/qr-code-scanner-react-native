import {it, describe} from '@jest/globals';
import {
  SavedUrl,
  useStoredUrls,
  useStoredUrlsMutation,
} from '@storage/useUrlStorage.ts';
import {renderHook} from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import {Linking} from 'react-native';

let mockStoredUrls: {
  readonly [key: string]: SavedUrl;
} = {};
const mockSetStoredUrls = jest.fn();
jest.mock('react-native-mmkv', () => ({
  useMMKVObject: () => [mockStoredUrls, mockSetStoredUrls],
}));

describe('useUrlStorage', () => {
  beforeAll(() => {
    Object.setPrototypeOf(
      {
        Linking: {
          canOpenURL: jest.fn(),
        },
      },
      ReactNative,
    );
  });

  beforeEach(() => {
    mockStoredUrls = {};
    jest.resetAllMocks();
    (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
  });

  describe('useStoredUrls', () => {
    it('returns storedUrls', () => {
      mockStoredUrls = {
        test: {
          url: 'http://test.com',
          name: 'Test',
        },
      };
      const hook = renderHook(useStoredUrls);
      expect(hook.result.current).toStrictEqual([mockStoredUrls.test]);
    });
  });

  describe('useStoredUrlsMutation', () => {
    it('updates url name', async () => {
      mockStoredUrls = {
        'http://update.com': {
          url: 'http://update.com',
          name: null,
        },
      };
      const hook = renderHook(useStoredUrlsMutation);
      hook.result.current.updateUrlName('http://update.com', 'Test');
      const reducerResult = mockSetStoredUrls.mock.calls[0][0]();
      expect(Object.values(reducerResult)).toStrictEqual([
        {
          url: 'http://update.com',
          name: 'Test',
        },
      ]);
    });

    it('deletes url', async () => {
      mockStoredUrls = {
        'http://deleted.com': {
          url: 'http://deleted.com',
          name: null,
        },
      };
      const hook = renderHook(useStoredUrlsMutation);
      hook.result.current.deleteUrl('http://deleted.com');
      const reducerResult = mockSetStoredUrls.mock.calls[0][0]();
      expect(Object.values(reducerResult).length).toBe(0);
    });

    it('adds a new url', async () => {
      const hook = renderHook(useStoredUrlsMutation);
      const result = await hook.result.current.addUrl('http://add.com');
      expect(result).toBeTruthy();
      const reducerResult = mockSetStoredUrls.mock.calls[0][0]();
      expect(Object.values(reducerResult)).toStrictEqual([
        {
          url: 'http://add.com',
          name: null,
        },
      ]);
    });

    it('does not add an invalid new url', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);
      const hook = renderHook(useStoredUrlsMutation);
      const result = await hook.result.current.addUrl('http://add.com');
      expect(result).toBeFalsy();
      expect(mockSetStoredUrls.mock.calls.length).toBe(0);
    });
  });
});
