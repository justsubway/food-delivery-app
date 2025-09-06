import {View, Text, Button, Alert, TouchableOpacity, Image} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState} from "react";
import {createUser} from "@/lib/appwrite";
import { images } from "@/constants";

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const submit = async () => {
        const { name, email, password } = form;

        if(!name || !email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');

        setIsSubmitting(true)

        try {
            await createUser({ email,  password,  name });

            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className="flex-1">
            {/* Welcome Text */}
            <View className="mb-8">
                <Text className="text-3xl font-bold text-dark-100 mb-2">Join Chomp!</Text>
                <Text className="text-gray-200 text-base">
                    Create your account and start ordering delicious food
                </Text>
            </View>

            {/* Form */}
            <View className="gap-6">
                <CustomInput
                    placeholder="Enter your full name"
                    value={form.name}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                    label="Full Name"
                />
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

                {/* Terms and Conditions */}
                <View className="flex-row items-start gap-3 mb-2">
                    <View className="w-5 h-5 border border-gray-200 rounded mt-0.5" />
                    <Text className="text-gray-200 text-sm flex-1">
                        I agree to the{' '}
                        <Text className="text-primary font-semibold">Terms of Service</Text>
                        {' '}and{' '}
                        <Text className="text-primary font-semibold">Privacy Policy</Text>
                    </Text>
                </View>

                <CustomButton
                    title="Create Account"
                    isLoading={isSubmitting}
                    onPress={submit}
                />

                {/* Divider */}
                <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-gray-200" />
                    <Text className="mx-4 text-gray-200">or</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Social Sign Up */}
                <TouchableOpacity className="flex-row items-center justify-center gap-3 py-4 border border-gray-200 rounded-xl">
                    <Image source={images.envelope} className="size-5" resizeMode="contain" />
                    <Text className="font-semibold text-dark-100">Continue with Google</Text>
                </TouchableOpacity>

                {/* Sign In Link */}
                <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-200">
                        Already have an account?{' '}
                    </Text>
                    <Link href="/sign-in" className="text-primary font-bold">
                        Sign In
                    </Link>
                </View>
            </View>
        </View>
    )
}

export default SignUp
