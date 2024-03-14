import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';

export default function Categories({categoryList}) {
	return (
		<View className="mt-3">
			<Text className="font-bold">Categories</Text>
			<FlatList 
				data={categoryList}
				// numColumns={4}
				renderItem={({item,index})=>(
					<TouchableOpacity className="flex-1">
						<Image source = {{uri:item.icon}}
							className="w-[40px] h-[40px]"
						/>
						<Text className="text-[12px]">{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	)
}