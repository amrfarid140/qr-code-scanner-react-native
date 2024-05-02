import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
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

export const ScanCodeScreen: React.FC = () => {
  const [status, requestPermission] = useCameraPermissions();
  const {addUrl} = useStoredUrlsMutation();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  const animatedErrorVisibility = useRef(new Animated.Value(0)).current;
  const [isProcessingCode, setIsProcessingCode] = useState(false);

  const onBarcodeScanned = useCallback(
    async (scanningResult: BarcodeScanningResult) => {
      if (scanningResult.raw && !isProcessingCode) {
        setIsProcessingCode(true);
        Vibration.vibrate(300, false);
        if (await addUrl(scanningResult.raw)) {
          navigation.goBack();
        } else {
          Animated.timing(animatedErrorVisibility, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
          setTimeout(() => {
            Animated.timing(animatedErrorVisibility, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }).start();
          }, 5000);
        }
        setIsProcessingCode(false);
      }
    },
    [addUrl, navigation, isProcessingCode],
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
    <>
      <Animated.View
        style={[
          scanCodeStyles.errorContainer,
          {opacity: animatedErrorVisibility},
        ]}>
        <Text>The QR code does not contain a valid url</Text>
      </Animated.View>

      <CameraView
        style={scanCodeStyles.cameraView}
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
    </>
  );
};

const scanCodeStyles = StyleSheet.create({
  cameraView: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    backgroundColor: 'red',
    bottom: 40,
    padding: 24,
  },
});

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
