import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/HomeScreen/Header.jsx';
import Slider from '../components/HomeScreen/Slider.jsx';
import { getFirestore, collection, getDocs, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig.jsx';
import LatestItemList from '../components/HomeScreen/LatestItemList.jsx';

export default function HomeScreen() {
	const db = getFirestore(app);
	// const [sliderList,setSliderList]=useState([]);
	const [latestItemList,setLatesItemList]=useState([]);

	useEffect(()=>{
		// getSliders();
		getLatestItemList();
	},[])

/**
 * Used to Get Sliders for Home Screen
 */
// 	const getSliders=async()=>{
// 		setSliderList([])
// 		const querySnapshot = await getDocs(collection(db, "Sliders"));
// 		querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
// 		setSliderList(sliderList=>[...sliderList, doc.data()]);
// });
// 	}

const getLatestItemList=async()=>{
	setLatesItemList([]);
	const querySnapShot=await getDocs(collection (db, 'Post'),orderBy('createdAt','desc'));
	querySnapShot.forEach((doc)=>{
		console.log("Docs",doc.data())
		setLatesItemList(latestItemList=>[...latestItemList,doc.data()]);
	})
}

	return (
		<ScrollView className="py-8 px-6 bg-white flex-1">
			<Header />
			{/* Slider */}
			{/* <Slider sliderList={sliderList} /> */}
			{/* Latest Item List */}
			<LatestItemList latestItemList = {latestItemList} />
		</ScrollView>
	)
}