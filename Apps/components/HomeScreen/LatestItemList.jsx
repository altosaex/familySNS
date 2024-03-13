import { View, Text, FlatList, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function LatestItemList({latestItemList}) {
	const {user} = useUser();
	const db = getFirestore(app);
	const nav = useNavigation();

	// useEffect(()=>{
	// 	params&&setProduct(params.product);
	// },[params])
	
	const sendComment=()=>{
		Linking.openURL('mailto:'+post.userEmail)
	}

	const deleteUserPost=()=>{
		Alert.alert('投稿を削除しますか？','一度消した投稿は戻せないよ',[
			{
				text:'Yes',
				onPress:()=>deleteFromFirestore()
			},
			{
				text:'Cancel',
				onPress:()=> console.log('Cancel Pressed'),
				style: 'cancel',
			},
		])
	}

	const deleteFromFirestore =async()=>{
		console.log('Deleted');
		const q = query(collection(db, 'UserPost'), where('desc', '==', post.desc))
		const snapshot = await getDocs(q);
		snapshot.forEach(doc=>{
			deleteDoc(doc.ref).then(resp=>{
				console.log('Delete the Doc...');
				nav.goBack();
			})
		})
	}

	return (
		<View className="mt-2">
			<View className="p-[9px] px-6 bg-slate-50 mt-3 mb-3 border-[1px] border-slate-200 w-[170px] rounded-lg">
						<Text className="ml-6 text-[18px] text-blue-400 font-bold">投稿一覧</Text>
					</View>

			<FlatList
				data={latestItemList}
				renderItem={({item, index})=>(
					<View className="flex-1 m-2 border-r-blue-400 rounded-lg border-[1px] pt-1 pb-3 pl-4 pr-4 border-slate-200 bg-slate-50">

				<TouchableOpacity className="flex flex-row items-center gap-2 mt-1">
					<Image source = {{uri:item.userImage}}
						className="rounded-full w-10 h-10" />
					<Text className="text-[15px] text-blue-400 font-bold">
					{item.userName}</Text>
				</TouchableOpacity>
							{/* <Text className="text-[15px] text-blue-400 font-bold">
								{item.createdAt}</Text>
							</View> */}

							<View>
								<Text className="text-[16px] font-bold mt-2">{item.category}</Text>
								<Text className="text-[20px] mt-2">{item.desc}</Text>
							</View>

							<View>
								<Image source = {{uri:item.image}}
								className="w-[200px] h-[200px] mt-2 rounded-lg" />
							</View>

							{user?.primaryEmailAddress.emailAddress==item.userEmail?
								<TouchableOpacity
									onPress={()=>deleteUserPost()}
									className=" z-40 bg-red-500 rounded-full p-4 m-2">
										<Text className="text-center text-white">コメントを削除</Text>
								</TouchableOpacity>
								:
								<TouchableOpacity
								onPress={()=>sendComment()}
								className=" z-40 bg-blue-500 rounded-full p-4 m-2">
									<Text className="text-center text-white">コメントを書く</Text>
							</TouchableOpacity>
							}

					</View>
				)}
			/>
		</View>
	)
}