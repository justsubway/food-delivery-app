import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
  return (
    <View style={[styles.gradient, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#ff7c45', // Fallback color
  },
});

export default GradientBackground;
