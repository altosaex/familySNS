import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import mypost from '../../assets/images/mypost.jpeg'
import logout from '../../assets/images/logout.jpeg';
import group from '../../assets/images/group.jpg';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {

	const {user} = useUser();
	const navigation = useNavigation();
	const { isLoaded, signOut } = useAuth();
	const menuList = [
		{
			id:1,
			name:'自分の投稿',
			icon:mypost,
			path:'my-posts'
		},
		{
			id:2,
			name:'グループ管理',
			icon:group,
			path:'group-management'
		},
		{
			id:3,
			name:'ログアウト',
			icon:logout,
		}
	]

	const onMenuPress = (item)=>{
		if(item.name=='ログアウト')
		{
			signOut();
			
		} else if (item.path) {
			navigation.navigate(item.path); // パスが存在する場合は遷移する
		}
	}
	
	return (
		<View className="p-5 bg-white flex-1">
			<View className="items-center mt-20">
				<Image source = {{uri:user?.imageUrl}}
					className="w-[100px] h-[100px] rounded-full"
				/>
				<Text className="font-bold text-[25px] mt-5">{user?.fullName}</Text>
				<Text className="text-[15px] mt-2 text-gray-500">{user?.primaryEmailAddress?.emailAddress}</Text>
			</View>

		<FlatList
			data={menuList}
			numColumns={2}
			style={{marginTop:10}}
			renderItem={({item,index})=>(
				<TouchableOpacity 
				onPress={()=>onMenuPress(item)}
				className="flex-1 p-3 border-[1px] items-center mx-2 mt-4 rounded-lg border-blue-400 bg-blue-50 ">
					{item.icon&& <Image source={item?.icon} 
					className="w-[100px] h-[100px]"/>}
				<Text className="text-[14px] mt-2 text-blue-700">{item.name}</Text>
				</TouchableOpacity>
			)} />

		</View>
	)
}