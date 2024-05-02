import React from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {useCameraPermissions} from 'expo-camera';

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

  if (status == null) {
    return <LoadingScreen />;
  }

  if (!status.granted) {
    return (
      <PermissionRequiredScreen onGrantPermissionsPressed={requestPermission} />
    );
  }
  return <Text>ScanCodeScreen</Text>;
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
