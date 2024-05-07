import React, {useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import {useStoredUrlsMutation} from '@storage/useUrlStorage.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackRoute} from '@routing/RootStackRoute.ts';
import {PressableButton} from '@components/PressableButton.tsx';

const LoadingScreen = () => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator
        testID="loading-indicator"
        color="#000000"
        size="large"
      />
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
      <PressableButton
        label="Grant Permissions"
        onPress={onGrantPermissionsPressed}
      />
    </View>
  );
};

export const ScanCodeScreen: React.FC = () => {
  const [status, requestPermission] = useCameraPermissions();
  const {addUrl} = useStoredUrlsMutation();
  const navigation = useNavigation<NavigationProp<RootStackRoute>>();
  const animatedErrorVisibility = useRef(new Animated.Value(0)).current;
  const lastScannedUrl = useRef<string | null>(null);

  const onBarcodeScanned = useCallback(
    async (scanningResult: BarcodeScanningResult) => {
      if (scanningResult.raw && lastScannedUrl.current !== scanningResult.raw) {
        lastScannedUrl.current = scanningResult.raw;
        Vibration.vibrate(300, false);
        const isValid = await addUrl(scanningResult.raw);
        if (isValid) {
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
      }
    },
    [lastScannedUrl, addUrl, navigation, animatedErrorVisibility],
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
    color: 'black',
  },
});

const loadingStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
