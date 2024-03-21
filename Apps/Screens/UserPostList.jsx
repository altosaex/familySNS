// UserPostList.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { app } from '../../firebaseConfig';
import CheckBox from '@react-native-community/checkbox';

export default function UserPostList() {
  const { user } = useUser();
  const db = getFirestore(app);
  const [selectedUsers, setSelectedUsers] = useState([]); // 選択されたユーザーのリスト
  const [userOptions, setUserOptions] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [confirmMode, setConfirmMode] = useState(false); // 確定モードの状態

  useEffect(() => {
    const fetchUserOptions = async () => {
      const q = query(collection(db, 'Post'), where('userEmail', '!=', ''));
      const querySnapshot = await getDocs(q);
      const users = new Set();
      querySnapshot.forEach(doc => {
        const data = doc.data();
        users.add(data.userEmail);
      });
      setUserOptions(Array.from(users));
    };
    fetchUserOptions();
  }, [db]); // ここでdbを依存関係に追加

  const toggleUserSelection = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleConfirm = async () => {
    const filteredPosts = [];
    for (const selectedUser of selectedUsers) {
      const q = query(collection(db, 'Post'), where('userEmail', '==', selectedUser));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => doc.data());
      filteredPosts.push(...posts);
    }
    setUserPosts(filteredPosts);
    setConfirmMode(true); // 確定モードを有効にする
  };

  const handleEdit = () => {
    setSelectedUsers([]); // 選択をリセット
    setUserPosts([]); // 投稿をリセット
    setConfirmMode(false); // 確定モードを無効にする
  };

  return (
    <View>
      <Text>ユーザーを選択してください:</Text>
      <FlatList
        data={userOptions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleUserSelection(item)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                value={selectedUsers.includes(item)}
                onValueChange={() => toggleUserSelection(item)}
              />
              <Text>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity onPress={handleConfirm}>
        <Text>確定</Text>
      </TouchableOpacity>

      {/* 修正ボタン */}
      {confirmMode && (
        <TouchableOpacity onPress={handleEdit}>
          <Text>修正する</Text>
        </TouchableOpacity>
      )}

      <View>
        <Text>選択中のユーザー:</Text>
        {selectedUsers.map((user, index) => (
          <Text key={index}>{user}</Text>
        ))}
      </View>

      {/* 確定モードの場合にのみ、投稿リストを表示 */}
      {confirmMode && (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            <View>
              {/* 投稿の表示 */}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}
