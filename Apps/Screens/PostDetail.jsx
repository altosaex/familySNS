import { View, Text, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default function PostDetail () { 
	const route = useRoute();
  const {postId, userName,createdAt, desc, image, userEmail, userImage, userQuestion} = route.params; // propsからpostIdを取得する
  const [comment, setComment] = useState('');
	const db = getFirestore(app);

const handleAddComment = async () => {
	try {
		const commentRef = collection(db, 'Post', postId, 'Comments');// コメント用のサブコレクションを参照
		await addDoc(commentRef, { text: comment });
		setComment(''); // コメント入力欄をクリア
		Alert.alert('コメントが追加されたよ！');
	} catch (error) {
		console.log('コメントの追加に失敗しました。', error);
		Alert.alert('コメントの追加に失敗しました。');
	}
};

	return (
		<View style={{ flex: 1 }}>
			<View className="py-8 px-6 bg-white flex-1">
			{/* 投稿のデータを表示 */}
		
        <View style={{ backgroundColor: 'white', padding: 1, marginBottom: 10, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Image source={{ uri:userImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 8 }}>{userName}</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{userQuestion}</Text>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>{desc}</Text>
            <Image source={{ uri: image }} style={{ width: '70%', height: 220, borderRadius: 8 }} />

    <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginTop: 10, width: '80%' }}
        placeholder="コメントを入力してください"
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity onPress={handleAddComment} style={{ backgroundColor: 'blue', borderRadius: 20, padding: 8, marginTop: 8 }}>
			<Text style={{ color: 'white', textAlign: 'center' }}>コメントを追加する</Text>
      </TouchableOpacity>

		</View>
		</View>
		</View>
	);
	}