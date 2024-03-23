import { StatusBar } from 'expo-status-bar';
import { LogBox, Text, View } from 'react-native';
import LoginScreen from './Apps/Screens/LoginScreen';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './Apps/Navigations/TabNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import PostDetail from './Apps/Screens/PostDetail';
import { AppRegistry } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
		<ClerkProvider  publishableKey='pk_test_YXJ0aXN0aWMtc3BhbmllbC0zNC5jbGVyay5hY2NvdW50cy5kZXYk'>
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
			
			<SignedIn>
          <NavigationContainer>
					<Stack.Navigator>
              <Stack.Screen name="Home" component={TabNavigation}  options={{ headerShown: false }} />
              <Stack.Screen name="AddComments" component={PostDetail} />
            </Stack.Navigator>
					</NavigationContainer>
        </SignedIn>
        <SignedOut>
        <LoginScreen/>
        </SignedOut>
    </View>
		</ClerkProvider>
  );
}

AppRegistry.registerComponent('familySNS', () => App);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
