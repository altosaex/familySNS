import { View, Text } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

export default function PostDetail() {
	const route = useRoute();
  const postId = route.params.postId;

	return (
		<View>
			<Text>PostDetail</Text>
			
		</View>
	);
}