import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/HomeScreen/Header.jsx';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { app } from '../../firebaseConfig.js';
import LatestItemList from '../components/HomeScreen/LatestItemList.jsx';

export default function HomeScreen() {
	const db = getFirestore(app);
	// const [sliderList,setSliderList]=useState([]);
	const [latestItemList,setLatesItemList]=useState([]);

	useEffect(()=>{
		// getSliders();
		getLatestItemList();
	},[])

	const getLatestItemList = async () => {
		try {
				const q = query(collection(db, 'Post'), orderBy('createdAt', 'desc'));
				const querySnapshot = await getDocs(q);
				const latestItems = querySnapshot.docs.map(doc => doc.data());
				setLatesItemList(latestItems); // 最新の投稿リストで状態を更新
		} catch (error) {
				console.error('Error getting latest items:', error);
		}
};

	return (
		<View style={{ flex: 1 }}>
			<Header />

			<View className="py-3 px-3 bg-white flex-1">
			{/* Latest Item List */}
			<LatestItemList latestItemList = {latestItemList} />
		</View>
		</View>
	);
}