import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
	useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

	const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

	return (
		<View>
			<Image source={require('./../../assets/images/login.jpeg')} 
				className = "w-[380px] h-[550px] object-cover"
			/>
			<View className="p-4 bg-white mt-[-20px]  shadow-md">
				<Text className="text-[35px] font-bold mt-0">FamilySNS</Text>
				<Text className="text-[18px] text-slate-500 mt-2">クローズドな空間で自己内省を。</Text>
				<TouchableOpacity onPress={onPress} className="p-4 bg-blue-400 mt-10 rounded-full">
					<Text className="text-white text-center text-[18px] font-bold">はじめよう</Text>
				</TouchableOpacity>
			</View>
			{/* <Image source={require('./../../assets/images/footer.jpeg')} 
				className = "w-[90px] h-[30px] object-cover ml-auto mr-auto mt-5"
			/> */}
		</View>
	)
}