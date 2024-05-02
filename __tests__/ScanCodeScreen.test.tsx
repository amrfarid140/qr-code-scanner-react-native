import {it, describe} from '@jest/globals';
import React from 'react';
import {act, fireEvent, render} from '@testing-library/react-native';
import {ScanCodeScreen} from '@screens/ScanCodeScreen.tsx';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as ReactNative from 'react-native';

jest.mock('expo-camera', () => ({
  CameraView: jest.fn(),
  useCameraPermissions: jest.fn(),
}));
jest.mock('@storage/useUrlStorage.ts', () => ({
  useStoredUrlsMutation: () => ({
    addUrl: () => Promise.resolve(true),
  }),
}));
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('<ScanCodeScreen />', () => {
  beforeAll(() => {
    Object.setPrototypeOf(
      {
        Vibration: {
          vibrate: jest.fn(),
        },
      },
      ReactNative,
    );
  });

  afterAll(() => {
    Object.setPrototypeOf(
      {
        Vibration: ReactNative.Vibration,
      },
      ReactNative,
    );
  });

  it('renders loading screen while permissions check is loading', () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([null, jest.fn()]);
    const screen = render(<ScanCodeScreen />);
    expect(screen.queryByTestId('loading-indicator')).not.toBeNull();
    expect(
      screen.queryByText('The QR code does not contain a valid url'),
    ).toBeNull();
    expect(
      screen.queryByText('We need your permission to access the device camera'),
    ).toBeNull();
    expect(screen.queryByText('Grant Permissions')).toBeNull();
  });

  it('renders permissions screen when permission is not granted', () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {granted: false},
      jest.fn(),
    ]);
    const screen = render(<ScanCodeScreen />);
    expect(screen.queryByTestId('loading-indicator')).toBeNull();
    expect(
      screen.queryByText('The QR code does not contain a valid url'),
    ).toBeNull();
    expect(
      screen.queryByText('We need your permission to access the device camera'),
    ).not.toBeNull();
    expect(screen.queryByText('Grant Permissions')).not.toBeNull();
  });

  it('requests permissions', async () => {
    const requestPermission = jest.fn();
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {granted: false},
      requestPermission,
    ]);
    const screen = render(<ScanCodeScreen />);
    fireEvent.press(await screen.findByText('Grant Permissions'));
    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  it('renders camera view when permissions are granted', async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {granted: true},
      jest.fn(),
    ]);
    const screen = render(<ScanCodeScreen />);
    expect(screen.queryByTestId('loading-indicator')).toBeNull();
    const errorNode = await screen.findByText(
      'The QR code does not contain a valid url',
    );
    expect(errorNode.parent?.parent?.props.style.opacity).toBe(0);
    expect(
      screen.queryByText('We need your permission to access the device camera'),
    ).toBeNull();
    expect(screen.queryByText('Grant Permissions')).toBeNull();
    expect(CameraView).toHaveBeenCalledTimes(1);
  });

  it('renders navigates back when scanned url is valid', async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      {granted: true},
      jest.fn(),
    ]);
    // (useStoredUrlsMutation().addUrl as jest.Mock).mockResolvedValue(true);
    render(<ScanCodeScreen />);
    await act(() =>
      (CameraView as unknown as jest.Mock).mock.calls[0][0].onBarcodeScanned({
        raw: 123,
      }),
    );
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
