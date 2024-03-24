import { View, Text, Alert, Image, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useUser } from '@clerk/clerk-expo';
import LatestItemList from '../components/HomeScreen/LatestItemList.jsx';

export default function PostDetail() {
  const navigation = useNavigation(); // React Navigation v5以前の場合
  const route = useRoute();
  const { postId, userName, createdAt, desc, image, userEmail, userImage, userQuestion } = route.params;
  const [loadingComments, setLoadingComments] = useState(true);
  const [loading, setLoading] = useState(false); // ローディングステートを追加
  const [comment, setComment] = useState('');
  const db = getFirestore(app);
  const [commentList, setCommentList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getUserPost();
  }, [user]);

  const handleAddComment = async () => {
    try {
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

  const getUserPost = async () => {
    setCommentList([]); // コメントリストを初期化
    try {
      const q = query(
        collection(db, 'Post'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const fetchedComments = [];
      snapshot.forEach((doc) => {
        fetchedComments.push(doc.data());
      });
      setCommentList(fetchedComments); // コメントリストを更新
    } catch (error) {
      console.log('コメントの取得に失敗しました。', error);
    } finally {
      setLoadingComments(false); // ローディング状態を更新
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
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
        {/* LatestItemList の外側でコメントがない場合の表示を行う */}
        {commentList.filter(item => !item.desc).map((item, index) => (
          <View key={index} style={{ backgroundColor: 'white', padding: 1, marginBottom: 10, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Image source={{ uri: item.userImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 8 }}>{item.userName}</Text>
            </View>
            <Text style={{ color: 'gray', marginTop: 1, marginBottom: 5, marginLeft: -5, fontSize: 12 }}>{item.createdAt.toDate().toString()}</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{item.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};