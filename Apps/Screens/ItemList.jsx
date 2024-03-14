import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

export default function ItemList() {
	const {params}=useRoute();

	useEffect(()=>{
		console.log(params)
},[])

	return (
		<View>
			<Text>ItemList</Text>
		</View>
	)
}