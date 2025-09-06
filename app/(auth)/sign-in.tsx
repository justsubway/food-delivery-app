import { View, Text, Alert, TouchableOpacity, Image } from 'react-native';
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { images } from "@/constants";
import * as Sentry from '@sentry/react-native';

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    // ✅ pull in store method
    const { fetchAuthenticatedUser } = useAuthStore();

    const submit = async () => {
        const { email, password } = form;

        if (!email || !password) {
            return Alert.alert('Error', 'Please enter valid email address & password.');
        }

        setIsSubmitting(true);

        try {
            // create a session
            await signIn({ email, password });

            // ✅ update Zustand store immediately
            await fetchAuthenticatedUser();

            // redirect to home
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Error', error.message);
            Sentry.captureException(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1">
            {/* Welcome Text */}
            <View className="mb-8">
                <Text className="text-3xl font-bold text-dark-100 mb-2">Welcome Back!</Text>
                <Text className="text-gray-200 text-base">
                    Sign in to continue your delicious journey
                </Text>
            </View>

            {/* Form */}
            <View className="gap-6">
                <CustomInput
                    placeholder="Enter your email"
                    value={form.email}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                    label="Email Address"
                    keyboardType="email-address"
                />
                <CustomInput
                    placeholder="Enter your password"
                    value={form.password}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                    label="Password"
                    secureTextEntry={true}
                />

                {/* Forgot Password */}
                <TouchableOpacity className="self-end">
                    <Text className="text-primary font-semibold">Forgot Password?</Text>
                </TouchableOpacity>

                <CustomButton
                    title="Sign In"
                    isLoading={isSubmitting}
                    onPress={submit}
                />

                {/* Divider */}
                <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-gray-200" />
                    <Text className="mx-4 text-gray-200">or</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Social Login */}
                <TouchableOpacity className="flex-row items-center justify-center gap-3 py-4 border border-gray-200 rounded-xl">
                    <Image source={images.envelope} className="size-5" resizeMode="contain" />
                    <Text className="font-semibold text-dark-100">Continue with Google</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-200">
                        Don&apos;t have an account?{' '}
                    </Text>
                    <Link href="/sign-up" className="text-primary font-bold">
                        Sign Up
                    </Link>
                </View>
            </View>
        </View>
    );
};

export default SignIn;
