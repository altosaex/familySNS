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
		const q = query(collection(db, 'Post'), where('desc', '==', post.desc))
		const snapshot = await getDocs(q);
		snapshot.forEach(doc=>{
			deleteDoc(doc.ref).then(resp=>{
				console.log('Delete the Doc...');
				nav.goBack();
			})
		})
	}

	return (
		<View style={{ marginBottom: 10 }}>
			{/* <View className="p-[9px] px-6 bg-slate-50  border-[1px] border-slate-200 w-[170px] rounded-lg">
						<Text className="ml-6 text-[18px] text-blue-400 font-bold">投稿一覧</Text>
					</View> */}

			<FlatList
				data={latestItemList}
				contentContainerStyle={{ paddingVertical: 1 }}
				renderItem={({item})=>(
					<View style={{ backgroundColor: 'white', padding: 1, marginBottom: 10, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Image source={{ uri: item.userImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 8 }}>{item.userName}</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{item.category}</Text>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>{item.desc}</Text>
            <Image source={{ uri: item.image }} style={{ width: '70%', height: 220, borderRadius: 8 }} />
            {user?.primaryEmailAddress.emailAddress == item.userEmail ? (
              <TouchableOpacity onPress={() => deleteUserPost()} style={{ backgroundColor: 'red', borderRadius: 20, padding: 8, marginTop: 8 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>コメントを削除</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => sendComment()} style={{ backgroundColor: 'blue', borderRadius: 20, padding: 8, marginTop: 8 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>コメントを書く</Text>
              </TouchableOpacity>
            )}
          </View>
							
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
	)
}