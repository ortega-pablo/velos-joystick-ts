import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import StackNavigator from './src/navigation/StackNavigation';
import { Provider } from 'react-redux';
import  {store}  from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>

    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
    </Provider>
  );
};

export default App;