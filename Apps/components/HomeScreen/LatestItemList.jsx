import { View, Text, FlatList, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function LatestItemList({ latestItemList }) {
  const { user } = useUser();
  const db = getFirestore(app);
  const nav = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 最新のアイテムリストが変更されたら、それを反映する
    setItems(latestItemList);
  }, [latestItemList]);

  const deleteUserPost = (item) => {
    Alert.alert('投稿を削除しますか？', '一度消した投稿は戻せないよ', [
      {
        text: 'Yes',
        onPress: () => deleteFromFirestore(item)
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ])
  }

  const deleteFromFirestore = async (item) => {
    console.log('Deleted');
    const q = query(collection(db, 'Post'), where('desc', '==', item.desc));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => { // 非同期処理を行うためにasyncを追加
      try {
        await deleteDoc(doc.ref);
        console.log('Delete the Doc...');
        // アイテムのリストから削除されたアイテムをフィルタリングして更新
        const updatedItems = items.filter((i) => i.desc !== item.desc);
        setItems(updatedItems);
        nav.navigate('Home');
        // 削除成功時のポップアップ表示
        Alert.alert('削除が完了しました!!', null, [{ text: 'OK' }]);
      }
      catch (error) {
        console.error('Error deleting document:', error);
      }
    });
  };

  return (
    <View style={{ marginBottom: 10 }}>
      {/* <View className="p-[9px] px-6 bg-slate-50  border-[1px] border-slate-200 w-[170px] rounded-lg">
            <Text className="ml-6 text-[18px] text-blue-400 font-bold">投稿一覧</Text>
          </View> */}

      <FlatList
        // data={latestItemList}
        data={items} // 最新の items を表示するように修正
        contentContainerStyle={{ paddingVertical: 1 }}
        renderItem={({ item }) => {
          // [desc]が存在しない場合はnullを返す
          if (!item.desc) {
            return null;
          }
          return (
            <View style={{ backgroundColor: 'white', padding: 1, marginBottom: 10, borderRadius: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Image source={{ uri: item.userImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 8 }}>{item.userName}</Text>
              </View>
              <Text style={{ color: 'gray', marginTop: 1, marginBottom: 5, marginLeft: -5, fontSize: 12 }}> {item.createdAt.toDate().toString()}</Text>
							<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{item.comment}</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{item.userQuestion}</Text>
              <Text style={{ fontSize: 18, marginBottom: 8 }}>{item.desc}</Text>
              <Image source={{ uri: item.image }} style={{ width: '70%', height: 220, borderRadius: 8 }} />
              {user?.primaryEmailAddress.emailAddress == item.userEmail ? (
                <TouchableOpacity onPress={() => deleteUserPost(item)} style={{ backgroundColor: loading ? 'red' : 'red',
                  padding: 12,
                  borderRadius: 5,
                  marginTop: 10,
                  alignItems: 'center' }}>
                  <Text style={{ color: 'white', textAlign: 'center' }}>投稿を削除</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={() => nav.navigate(
                'AddComments', {
                  DocumentId: item.DocumentId, postId: item.postId, userName: item.userName, createdAt: item.createdAt, desc: item.desc, image: item.image, userEmail: item.userEmail, userImage: item.userImage, userQuestion: item.userQuestion, comment: item.comment
                }
              )} style={{ backgroundColor: loading ? '#ccc' : '#007BFF',
                padding: 12,
                borderRadius: 5,
                marginTop: 10,
                alignItems: 'center' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>コメントを書く</Text>
              </TouchableOpacity>

            </View>
          )
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
};
