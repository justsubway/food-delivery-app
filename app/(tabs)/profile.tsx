import {View, Text, Image, TouchableOpacity, Alert, ScrollView} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import useAuthStore from "@/store/auth.store";
import {images} from "@/constants";
import CustomButton from "@/components/CustomButton";

const ProfileField = ({ label, value, icon }: { label: string; value: string; icon: any }) => (
    <View className="flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <Image source={icon} className="size-6" resizeMode="contain" tintColor="#5D5F6D" />
        <View className="flex-1">
            <Text className="small-bold text-primary uppercase">{label}</Text>
            <Text className="paragraph-medium text-dark-100 mt-1">{value}</Text>
        </View>
    </View>
);

const Profile = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/(auth)/sign-in");
                    }
                }
            ]
        );
    };

    const handleImagePress = () => {
        Alert.alert(
            "Change Profile Picture",
            "Choose an option",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Take Photo",
                    onPress: () => {
                        Alert.alert("Coming Soon", "Camera functionality will be available soon!");
                    }
                },
                {
                    text: "Choose from Gallery",
                    onPress: () => {
                        Alert.alert("Coming Soon", "Gallery picker will be available soon!");
                    }
                },
                {
                    text: "Remove Photo",
                    onPress: () => {
                        setProfileImage(null);
                    }
                }
            ]
        );
    };

    if (!isAuthenticated || !user) {
        return (
            <SafeAreaView className="bg-white h-full">
                {/* Custom Header */}
                <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-200">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Image source={images.arrowBack} className="size-5" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text className="h3-bold text-dark-100">Profile</Text>
                    <TouchableOpacity 
                        onPress={() => router.push("/search")}
                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Image source={images.search} className="size-5" resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                
                <View className="flex-1 justify-center items-center px-5">
                    <Image source={images.user} className="size-20 mb-4" resizeMode="contain" tintColor="#5D5F6D" />
                    <Text className="h2-bold text-dark-100 mb-2">Not Signed In</Text>
                    <Text className="paragraph-medium text-gray-200 text-center mb-6">
                        Please sign in to view your profile
                    </Text>
                    <CustomButton 
                        title="Sign In" 
                        onPress={() => router.push("/(auth)/sign-in")}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-white h-full">
            {/* Custom Header */}
            <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-200">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                >
                    <Image source={images.arrowBack} className="size-5" resizeMode="contain" />
                </TouchableOpacity>
                <Text className="h3-bold text-dark-100">Profile</Text>
                <TouchableOpacity 
                    onPress={() => router.push("/search")}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                >
                    <Image source={images.search} className="size-5" resizeMode="contain" />
                </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                
                <View className="px-5 mt-6">
                    {/* User Avatar and Name */}
                    <View className="items-center mb-8">
                        <TouchableOpacity 
                            onPress={handleImagePress}
                            className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-4 relative"
                        >
                            <Image 
                                source={profileImage ? { uri: profileImage } : (user.avatar ? { uri: user.avatar } : images.avatar)} 
                                className="w-20 h-20 rounded-full" 
                                resizeMode="cover" 
                            />
                            <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full items-center justify-center">
                                <Image source={images.pencil} className="size-4" resizeMode="contain" tintColor="white" />
                            </View>
                        </TouchableOpacity>
                        <Text className="h2-bold text-dark-100">{user.name}</Text>
                        <Text className="paragraph-medium text-gray-200">{user.email}</Text>
                    </View>

                    {/* Profile Fields */}
                    <View className="gap-4 mb-8">
                        <ProfileField 
                            label="Full Name" 
                            value={user.name} 
                            icon={images.person} 
                        />
                        <ProfileField 
                            label="Email Address" 
                            value={user.email} 
                            icon={images.envelope} 
                        />
                        <ProfileField 
                            label="Member Since" 
                            value="January 2024" 
                            icon={images.clock} 
                        />
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-4">
                        <CustomButton 
                            title="Edit Profile" 
                            onPress={() => Alert.alert("Coming Soon", "Profile editing will be available soon!")}
                            style="bg-gray-100"
                            textStyle="text-dark-100"
                        />
                        
                        <TouchableOpacity 
                            className="flex-row items-center justify-center gap-3 p-4 border border-red-200 rounded-xl"
                            onPress={handleLogout}
                        >
                            <Image source={images.logout} className="size-5" resizeMode="contain" tintColor="#EF4444" />
                            <Text className="paragraph-bold text-red-500">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile
