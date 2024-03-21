import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Screens/ProfileScreen';
import MyPosts from '../Screens/MyPosts';
import UserPostList from '../Screens/UserPostList';

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
						<Stack.Screen name='group-management' component = {UserPostList}
			options={{
				headerStyle:{
					backgroundColor:'#3b82f6',
				},
				headerTintColor:'#fff',
				headerTitle:'ユーザーリスト管理画面'
			}}
			/>
		</Stack.Navigator>
	)
}