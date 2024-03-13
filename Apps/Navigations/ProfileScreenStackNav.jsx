import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Screens/ProfileScreen';
import MyPosts from '../Screens/MyPosts';

const Stack = createStackNavigator();
export default function ProfileScreenStackNav() {
	return (
		<Stack.Navigator>
			<Stack.Screen name='profile-tab' 
				options={{
					headerShown:false
				}}
			component = {ProfileScreen} />
			<Stack.Screen name='my-posts' component = {MyPosts}
			options={{
				headerStyle:{
					backgroundColor:'#3b82f6',
				},
				headerTintColor:'#fff',
				headerTitle:'My Posts'
			}}
			/>
		</Stack.Navigator>
	)
}