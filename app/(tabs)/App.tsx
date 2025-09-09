import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import JourneyTracker from './JourneyTracker';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <JourneyTracker />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
