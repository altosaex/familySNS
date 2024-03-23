import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { app } from '../../firebaseConfig';
import { getFirestore, getDocs, collection, addDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';

export default function AddPostScreen( {latestItemList} ) {

  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();
  const [loading,setLoading] = useState(false);
  const {user} = useUser();
  const [selectedQuestion, setSelectedQuestion] = useState("");
	const [postId, setPostId] = useState(""); // postId の状態を管理

	// postId を生成する関数
  const generatePostId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  useEffect(() => {
    // コンポーネントがマウントされた時に postId を生成する
    setPostId(generatePostId());
  }, []);

    const ranAry = () => {
      let q = ["Q.一番好きな食べ物は？","Q.子供の頃のあだ名は？","Q.どんな時に楽しいと感じる？","Q.自分を漢字一文字で表すと？","Q.今日一番嬉しかったことは？","Q.今日一番腹が立ったことは？","Q.今日一番笑ったことは？","Q.今日の出来事を3つ教えて！","Q.自分の口癖は？","Q.自分ってどんな性格？","Q.最近のマイブームは？","Q.最近一番楽しかったことは？","Q.最近一番面白かったことは？","Q.最近一番悲しかったことは？","Q.最近一番ムカついたことは？","Q.明日やりたいことは？","Q.今日中にやりたいことは？","Q.最近見た夢を教えて！","Q.今の本音をズバリ教えて！","Q.どんな言葉が好き？","Q.言われて嫌な気持ちになる言葉は？","Q.10年後の自分ってどんなイメージ？","Q.家族にひとこと！","Q.自分にひとこと！","Q.何考えてることが多い？","Q.どんな人といると楽？","Q.一緒にいたい人ってどんな人？","Q.寝る時どんなこと考えてる？","Q.子供の頃得意だったことは何？","Q.どの教科が得意だった？","Q.ニックネームは？","Q.人からどのように褒められる？","Q.趣味は何？","Q.家族はあなたのどんなところが好きだと思う？","Q.長年続けていることは何ですか？","Q.周りにはどのような人たちがいますか？","Q.困った時に相談に乗ってくれる人は何人いますか？","Q.何か達成した時に喜んでくれる人たちは誰ですか？","Q.5年後の自分にひとこと！","Q.1週間後の自分を褒めるとしたら何を褒める？","Q.1ヶ月後に世界が滅ぶとしたら何をする？","Q.今1000万円手に入ったら何に使う？","Q.友達から見た自分の印象は？"];
      const question = q[Math.floor(Math.random() * q.length)];
      setSelectedQuestion(question);
    };

// Used to Pick Image from Gallary
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }


  };
  const onSubmitMethod=async(values, { resetForm })=>{

    setLoading(true);

    //Covert Uri to Blob File
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'familySNS/'+ postId +".jpg");

    uploadBytes(storageRef, blob)
		.then(() => getDownloadURL(storageRef))
    .then(async (downloadUrl) => {
      // ドキュメントにデータを保存
      const postData = {
        postId: postId, // postId を追加
				desc: values.desc,
        image: downloadUrl,
        userName: user.fullName,
        userEmail: user.primaryEmailAddress.emailAddress,
        userImage: user.imageUrl,
        userQuestion: selectedQuestion,
        createdAt: serverTimestamp() // Firestoreサーバータイムスタンプを使用してcreatedAtを設定
      };
        
			const docRef = await addDoc(collection(db, "Post"), postData);
      if (docRef.id) {
						getLatestPosts();
            setLoading(false);
            Alert.alert('Success!!!','投稿に成功しました。');

            // 画像とdescの内容をクリア
            resetForm(); // フォームをリセット
            setImage(null);
						setPostId(generatePostId()); // 新しい postId を生成して設定
          }
      });


        // フォームをクリア
        		resetForm(); // フォームをリセット
            setImage(null);
            setSelectedQuestion("");
            setPostId(generatePostId()); // 新しい postId を生成して設定
			};

// 最新の投稿リストを取得する関数
const getLatestPosts = async () => {
  const q = query(collection(db, 'Post'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const latestPosts = [];
  snapshot.forEach((doc) => {
    latestPosts.push(doc.data());
  });
  // LatestItemList コンポーネントに最新の投稿リストを渡す
  setLatestItemList(latestPosts);
};

  return (
    <KeyboardAvoidingView>
      <ScrollView style={{ padding: 10 }}>
        <Formik
          initialValues={{ desc: '', image: '', userName: '', userEmail: '', userImage: '', question:'', createdAt: Date.now() }}
          onSubmit={(values, { resetForm }) => onSubmitMethod(values, { resetForm })}
          validate={values => {
            const errors = {};
            if (!values.desc) {
              console.log("投稿内容なし");
              ToastAndroid.show('投稿内容がありません', ToastAndroid.SHORT);
              errors.name = "desc must be there";
            }
            return errors;
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, resetForm  }) => (
            <View>
              <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 40 }}>Add New Post</Text>
              <Text style={{ fontSize: 15, color: '#888', marginBottom: 3 }}>質問から選んで投稿してみよう</Text>

              <TouchableOpacity onPress={pickImage}>
                {image ?
                  <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 5, marginTop: 5 }} />
                  :
                  <Image source={require('../../assets/images/placehplder.jpeg')} style={{ width: 100, height: 100, borderRadius: 15, marginTop: 5 }} />}
              </TouchableOpacity>

              <TextInput
                value={selectedQuestion}
                // selectedValue={values?.question}
                placeholder='質問を選んでね'
                editable={false}
                multiline={true}
                numberOfLines={2}
                style={styles.input}
              />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={ranAry}
                style={{
                  backgroundColor: loading ? '#ccc' : '#007BFF',
                  padding: 12,
                  borderRadius: 5,
                  marginTop: 10,
                  alignItems: 'center'
                }}
                disabled={loading}>
                <Text className="text-white">質問を選ぶ</Text>
              </TouchableOpacity>

              </View>

              <TextInput
                style={styles.input}
                placeholder={'Description'}
                value={values.desc}
                multiline={true}
                numberOfLines={5}
                onChangeText={handleChange('desc')}
              />

              <TouchableOpacity
                onPress={handleSubmit}
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
                  <Text style={{ color: '#fff', fontSize: 16 }}>投稿する</Text>
                }
              </TouchableOpacity>
              
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );

};
const styles = StyleSheet.create({
  input:{
    borderWidth:1,
    borderRadius:10,
    padding:10,
    marginTop:15,marginBottom:5,
    paddingHorizontal:17,
    textAlignVertical:'top',
    fontSize:17,
    color: 'gray'
  }
})


