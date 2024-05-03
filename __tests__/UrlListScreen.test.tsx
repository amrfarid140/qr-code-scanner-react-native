import React from 'react';
import {it, describe} from '@jest/globals';
import {SavedUrl} from '@storage/useUrlStorage.ts';
import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import {UrlListScreen} from '@screens/UrlListScreen.tsx';

const mockDeleteUrl = jest.fn();
let mockStoredUrls: SavedUrl[] = [];
jest.mock('@storage/useUrlStorage.ts', () => ({
  useStoredUrlsMutation: () => ({
    deleteUrl: mockDeleteUrl,
  }),
  useStoredUrls: () => mockStoredUrls,
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('<UrlListScree />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockStoredUrls = [];
  });

  it('renders all stored urls', () => {
    mockStoredUrls = [
      {
        url: 'https://google.com',
        name: null,
      },
      {
        url: 'https://google2.com',
        name: 'Test Name',
      },
    ];
    const screen = render(<UrlListScreen />);
    expect(screen.queryByText(mockStoredUrls[0].url)).not.toBeNull();
    expect(screen.queryByText(mockStoredUrls[1].url)).not.toBeNull();
    expect(screen.queryByText(mockStoredUrls[1].name!)).not.toBeNull();
    expect(screen.queryAllByText('Delete').length).toBe(2);
    expect(screen.queryAllByText('Update name').length).toBe(2);
  });

  it('deletes a stored urls', () => {
    mockStoredUrls = [
      {
        url: 'https://google.com',
        name: null,
      },
    ];
    const screen = render(<UrlListScreen />);
    fireEvent.press(screen.queryByText('Delete')!);
    expect(mockDeleteUrl).toHaveBeenCalledTimes(1);
    expect(mockDeleteUrl).toHaveBeenCalledWith(mockStoredUrls[0].url);
  });

  it('displays update name modal', async () => {
    mockStoredUrls = [
      {
        url: 'https://google.com',
        name: null,
      },
    ];
    const screen = render(<UrlListScreen />);
    await act(() => fireEvent.press(screen.queryByText('Update name')!));
    await waitFor(() => {
      expect(screen.queryByTestId('name-modal')?.props?.visible).toBeTruthy();
    });
  });

  it('renders the scan code screen', () => {
    const screen = render(<UrlListScreen />);
    const scanCodeButton = screen.queryByTestId('scan-code');
    expect(scanCodeButton).not.toBeNull();
    fireEvent.press(scanCodeButton!);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('ScanCode');
  });
});
