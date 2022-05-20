import React from 'react';
import {
  StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { strings } from './src/utils/strings';
import { colors } from './src/utils/colors';
import AuthorPosts from './src/screens/AuthorPosts';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.primary_dark} />
      <Stack.Navigator>
        <Stack.Screen
          name={strings.app_name}
          component={AuthorPosts}
          options={{
            headerStyle: {
              backgroundColor: colors.primary
            },
            headerTintColor: colors.white
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
