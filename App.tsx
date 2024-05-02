import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackRoute} from '@routing/RootStackRoute.ts';
import {ScanCodeScreen} from '@screens/ScanCodeScreen.tsx';
import {SingleUrlScreen} from '@screens/SingleUrlScreen.tsx';
import {UrlListScreen} from '@screens/UrlListScreen.tsx';
import {Button, Pressable, Text} from 'react-native';

const RootStackNavigator = createNativeStackNavigator<RootStackRoute>();

const App: () => React.JSX.Element = () => {
  return (
    <NavigationContainer>
      <RootStackNavigator.Navigator initialRouteName="UrlList">
        <RootStackNavigator.Screen
          name="UrlList"
          component={UrlListScreen}
          options={{
            title: 'Saved Urls',
            headerRight: () => (
              <Pressable>
                <Text>Add</Text>
              </Pressable>
            ),
          }}
        />
        <RootStackNavigator.Screen
          name="SingleUrl"
          component={SingleUrlScreen}
          options={({route}) => ({
            title: route.params.name ?? route.params.url,
          })}
        />
        <RootStackNavigator.Screen
          name="ScanCode"
          component={ScanCodeScreen}
          options={{title: 'Scan QR code'}}
        />
      </RootStackNavigator.Navigator>
    </NavigationContainer>
  );
};

export default App;
