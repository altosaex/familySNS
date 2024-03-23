import { View, Text, Alert, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion, collection, getDocs, getDoc, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default function PostDetail() {
  const navigation = useNavigation(); // React Navigation v5以前の場合
  const route = useRoute();
  const {postId, userName, createdAt, desc, image, userEmail, userImage, userQuestion} = route.params;
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false); // ローディングステートを追加
  const db = getFirestore(app);

  const handleAddComment = async () => {
    try {
      // コメントを追加するための新しいドキュメントを追加
      const newCommentRef = await addDoc(collection(db, 'Post'), {
        postId,
				userName,
				userImage,
        comment,
        createdAt: new Date()
      });

      setComment('');
      Alert.alert('コメントが追加されました！');
    } catch (error) {
      console.log('コメントの追加に失敗しました。', error);
      Alert.alert('コメントの追加に失敗しました。');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="py-8 px-6 bg-white flex-1">
        <View style={{ backgroundColor: 'white', padding: 1, marginBottom: 10, borderRadius: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Image source={{ uri: userImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 8 }}>{userName}</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{userQuestion}</Text>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>{desc}</Text>
          <Image source={{ uri: image }} style={{ width: '70%', height: 220, borderRadius: 8 }} />
          <TextInput
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginTop: 10, width: '80%', borderRadius: 5 }}
            multiline={true}
            placeholder="コメントを入力してください"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            style={{
              backgroundColor: loading ? '#ccc' : '#007BFF',
              padding: 12,
              borderRadius: 5,
              marginTop: 10,
              alignItems: 'center'
            }}
            disabled={loading}
          >
            {loading ?
              <ActivityIndicator color='#fff' />
              :
              <Text style={{ color: '#fff', fontSize: 16 }}>コメントを追加する</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

