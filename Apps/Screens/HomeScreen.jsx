import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/HomeScreen/Header.jsx';
import { getFirestore, collection, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebaseConfig.js';
import LatestItemList from '../components/HomeScreen/LatestItemList.jsx';

export default function HomeScreen() {
	const db = getFirestore(app);
	// const [sliderList,setSliderList]=useState([]);
	const [latestItemList,setLatesItemList]=useState([]);

	useEffect(() => {
    // 最新のアイテムリストが変更されたら、それを反映する
    const unsubscribe = onSnapshot(query(collection(db, 'Post'), orderBy('createdAt', 'desc')), (snapshot) => {
      const latestItems = [];
      snapshot.forEach((doc) => {
        latestItems.push(doc.data());
      });
      setLatesItemList(latestItems);
    }, (error) => {
      console.error('Error getting latest items:', error);
    });

    // コンポーネントのクリーンアップ
    return () => unsubscribe();
  }, []);

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