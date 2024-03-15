import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { app } from '../../firebaseConfig';
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';

export default function AddPostScreen() {
	const [image, setImage] = useState(null);
  const db = getFirestore(app);
	const storage = getStorage();
	const [loading,setLoading] = useState(false);
	const {user} = useUser();
  const [categoryList, setCategoryList] = useState([]); // categoryList を追加

  useEffect(()=>{
    getCategoryList();
  },[])

  const getCategoryList=async()=>{
    const querySnapshot = await getDocs(collection(db, 'Category'));

querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log("Docs:", doc.data());
  // getCategoryList(categoryList=>[...categoryList,doc.data()])
  // setCategoryList を使って categoryList を更新する
  setCategoryList((prevCategoryList) => [...prevCategoryList, doc.data()]);
});

  }
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
	const onSubmitMethod=async(value)=>{

		setLoading(true)
		//Covert Uri to Blob File
		const resp = await fetch(image);
		const blob = await resp.blob();
		const storageRef = ref(storage, 'familySNS/'+Date.now()+".jpg");

		uploadBytes(storageRef, blob).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		}).then((resp)=>{
			getDownloadURL(storageRef).then(async(downloadUrl)=>{
				console.log(downloadUrl);
				value.image=downloadUrl;
				value.userName=user.fullName;
				value.userEmail=user.primaryEmailAddress.emailAddress;
				value.userImage=user.imageUrl;
				const docRef = await addDoc(collection(db,"Post"),value)
				if(docRef.id)
					{
						setLoading(false);
						Alert.alert('Success!!!','投稿に成功しました。')
					}
			})
		});

	}

  return (
		<KeyboardAvoidingView>
    <ScrollView className="p-10">
      <Formik
        initialValues={{title:'',desc:'',category:'',image:'',userName:'',userEmail:'',userImage:'',createdAt:Date.now()}} 
        onSubmit={value=>onSubmitMethod(value)}
				validate={(values)=>{
					const errors={}
					if(!values.desc)
					{
						console.log("投稿内容なし");
						ToastAndroid.show('投稿内容がありません',ToastAndroid.SHORT)
						errors.name="desc must be there"
					}
				}}
			>
          {({handleChange,handleBlur,handleSubmit,values,setFieldValue,errors})=>(
          <View>

						<Text className="text-[27px] font-bold mt-10">Add New Post</Text>
						<Text className="text-[15px] text-gray-500 mb-3">質問から選んで投稿してみよう</Text>

						<TouchableOpacity onPress={pickImage}>
								{image?
									<Image source={{uri:image}} style={{width:100,height:100,borderRadius:5,marginTop:5}} />
								:
								<Image source={require('../../assets/images/placehplder.jpeg')} 
									style={{width:100,height:100,borderRadius:15,marginTop:5}} />}
									
							</TouchableOpacity>

						<View style={{borderWidth:1,borderRadius:10,marginTop:15}}>
						<Picker
              selectedValue={values?.category}
							className="border-2"
              onValueChange={itemValue=>setFieldValue('Category',itemValue)}
              >
                {categoryList.length>0 && categoryList?.map((item,index)=>(
                  <Picker.Item key={index}
                  label={item.name} value={item.name} />
                ))}
                
            </Picker>
						</View>
							
            {/* <TextInput 
              style={styles.input}
              placeholder='Title'
              value={values?.title}
              onChangeText={handleChange('title')}
            /> */}
            <TextInput
              style={styles.input}
              placeholder={'Description'}
              value={values?.desc}
							multiline={true}
							numberOfLines={5}
              onChangeText={handleChange('desc')}
            />

						<TouchableOpacity onPress={handleSubmit} 
						style={{
							backgroundColor:loading?'#ccc':'#007BFF',

						}}
						disabled={loading}
						className="p-4 bg-blue-500 rounded-full mt-10">
							{loading?
								<ActivityIndicator color='#fff' />
								:
								<Text className="text-white text-center text-[16px]">投稿する</Text>
						}
							
						</TouchableOpacity>
						
            {/* <Button  title="submit" /> */}
          </View> 
          )}

      </Formik>
    </ScrollView>
		</KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input:{
    borderWidth:1,
    borderRadius:10,
    padding:10,
    marginTop:15,marginBottom:5,
    paddingHorizontal:17,
		textAlignVertical:'top',
    fontSize:17
  }
})

