import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {BarcodeScanningResult} from 'expo-camera/build/Camera.types';
import {useStoredUrlsMutation} from '../storage/useUrlStorage.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';

const LoadingScreen = () => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator color="#000000" size="large" />
    </View>
  );
};

const PermissionRequiredScreen: React.FC<{
  readonly onGrantPermissionsPressed: () => void;
}> = ({onGrantPermissionsPressed}) => {
  return (
    <View style={permissionsStyles.container}>
      <Text style={permissionsStyles.text}>
        We need your permission to access the device camera
      </Text>
      <Button title="Grant Permissions" onPress={onGrantPermissionsPressed} />
    </View>
  );
};

export const ScanCodeScreen: React.FC<{}> = () => {
  const [status, requestPermission] = useCameraPermissions();
  const {addUrl} = useStoredUrlsMutation();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  const onBarcodeScanned = useCallback(
    (scanningResult: BarcodeScanningResult) => {
      if (scanningResult.raw) {
        Vibration.vibrate(300, false);
        addUrl(scanningResult.raw);
        navigation.goBack();
      }
    },
    [],
  );

  if (status == null) {
    return <LoadingScreen />;
  }

  if (!status.granted) {
    return (
      <PermissionRequiredScreen onGrantPermissionsPressed={requestPermission} />
    );
  }

  return (
    <CameraView
      style={{width: '100%', height: '100%'}}
      onBarcodeScanned={onBarcodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ['qr'],
      }}
    />
  );
};

const permissionsStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

const loadingStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
