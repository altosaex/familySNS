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

const getLatestItemList=async()=>{
	setLatesItemList([]);
	const q =query(collection(db, 'Post'),orderBy('createdAt','desc'));
	const querySnapShot = await getDocs(q);
	querySnapShot.forEach((doc)=>{
		console.log("Docs",doc.data())
		setLatesItemList(latestItemList=>[...latestItemList,doc.data()]);
	})
}

	return (
		<View style={{ flex: 1 }}>
			<Header />

			<View className="py-8 px-6 bg-white flex-1">
			{/* Latest Item List */}
			<LatestItemList latestItemList = {latestItemList} />
		</View>
		</View>
	);
}
