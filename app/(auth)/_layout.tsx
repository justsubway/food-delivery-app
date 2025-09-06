import {View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Image, TouchableOpacity} from 'react-native'
import {Redirect, Slot} from "expo-router";
import {images} from "@/constants";
import useAuthStore from "@/store/auth.store";
import GradientBackground from "@/components/GradientBackground";
import {ImageBackground} from "expo-image";

export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />

    return (
        <GradientBackground>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 2 }}>
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 3}}>
                        <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg" resizeMode="contain" />
                        <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10" />
                    </View>
                    <View className="bg-white rounded-t-3xl px-8 py-8 min-h-[60%]">
                        <Slot />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    )
}
