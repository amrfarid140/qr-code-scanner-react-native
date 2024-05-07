import React from 'react';
import {
  Platform,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from 'react-native';

export interface PressableButtonProps
  extends Omit<PressableProps, 'style' | 'children' | 'android_ripple'> {
  readonly label: string;
}

export const PressableButton: React.FC<PressableButtonProps> = props => (
  <Pressable
    {...props}
    style={({pressed}) => [
      styles.actionButtonContainer,
      {
        backgroundColor: pressed
          ? '#f5f5f5'
          : styles.actionButtonContainer.backgroundColor,
      },
    ]}>
    <Text style={styles.actionButtonText}>{props.label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  actionButtonContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
