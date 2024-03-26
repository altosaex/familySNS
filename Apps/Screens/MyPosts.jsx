import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Query, collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import LatestItemList from '../components/HomeScreen/LatestItemList';
import { useNavigation } from '@react-navigation/native';

export default function MyPosts() {

	const db = getFirestore(app)
	const {user} = useUser();
	const [postList,setPostList] = useState([]);
	const navigation = useNavigation();

	useEffect(() => {
		// 最新のアイテムリストが変更されたら、それを反映する
		const unsubscribe = onSnapshot(query(collection(db, 'Post'), 
		orderBy('createdAt', 'desc')),
		(snapshot) => {
			const postLists = [];
			snapshot.forEach((doc) => {
				postLists.push(doc.data());
			});
			setPostList(postLists);
			user && getUserPost();
		}, [user]);

		const getUserPost = async()=>{
			setPostList([]);
			const q = query(collection(db, 'Post'),where('userEmail' , '==', user?.primaryEmailAddress?.emailAddress),
			orderBy('createdAt', 'desc')); // 降順に並べ替え );
			const snapshot = await getDocs(q);
			snapshot.forEach(doc=>{
				console.log(doc.data());
				setPostList(postList=>[...postList,doc.data()]);
			})
		}

		// コンポーネントのクリーンアップ
		return () => unsubscribe();
	}, []);

	return (
		<View className="m-2">
			<LatestItemList latestItemList = {postList}
			/>
		</View>
	)
}
