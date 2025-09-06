import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { MenuItem } from "@/type";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useCartStore } from "@/store/cart.store";
import { appwriteConfig } from "@/lib/appwrite";
import { getMenu } from "@/lib/appwrite";

const ProductDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const products = await getMenu({ category: '', query: '' });
                const foundProduct = products.find(p => p.$id === id);
                setProduct(foundProduct || null);
            } catch (error) {
                console.log('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addItem({
                    id: product.$id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    customizations: []
                });
            }
            Alert.alert("Added to Cart", `${quantity} x ${product.name} added to cart!`);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="bg-white h-full">
                <View className="flex-1 items-center justify-center">
                    <Text className="h3-bold text-dark-100">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="bg-white h-full">
                <View className="flex-1 items-center justify-center px-5">
                    <Image source={images.emptyState} className="size-32 mb-4" resizeMode="contain" />
                    <Text className="h3-bold text-dark-100 mb-2">Product Not Found</Text>
                    <Text className="paragraph-medium text-gray-200 text-center mb-6">
                        The product you're looking for doesn't exist.
                    </Text>
                    <CustomButton 
                        title="Go Back" 
                        onPress={() => router.back()}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const imageUrl = `${product.image_url}?project=${appwriteConfig.projectId}`;

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-200">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Image source={images.arrowBack} className="size-5" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text className="h3-bold text-dark-100">Product Details</Text>
                    <View className="w-10" />
                </View>

                {/* Product Image */}
                <View className="items-center py-6">
                    <Image 
                        source={{ uri: imageUrl }} 
                        className="w-80 h-80 rounded-3xl" 
                        resizeMode="cover" 
                    />
                </View>

                {/* Product Info */}
                <View className="px-5">
                    <Text className="h2-bold text-dark-100 mb-2">{product.name}</Text>
                    <Text className="paragraph-medium text-gray-200 mb-4">{product.description}</Text>
                    
                    {/* Price and Rating */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="h2-bold text-primary">${product.price}</Text>
                        <View className="flex-row items-center gap-1">
                            <Image source={images.star} className="size-4" resizeMode="contain" tintColor="#FFD700" />
                            <Text className="paragraph-bold text-dark-100">{product.rating}</Text>
                        </View>
                    </View>

                    {/* Nutrition Info */}
                    <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                        <Text className="h3-bold text-dark-100 mb-3">Nutrition Information</Text>
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <Text className="small-bold text-primary uppercase">Calories</Text>
                                <Text className="paragraph-bold text-dark-100">{product.calories}</Text>
                            </View>
                            <View className="items-center">
                                <Text className="small-bold text-primary uppercase">Protein</Text>
                                <Text className="paragraph-bold text-dark-100">{product.protein}g</Text>
                            </View>
                            <View className="items-center">
                                <Text className="small-bold text-primary uppercase">Category</Text>
                                <Text className="paragraph-bold text-dark-100">{product.category_name}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Quantity Selector */}
                    <View className="mb-6">
                        <Text className="h3-bold text-dark-100 mb-3">Quantity</Text>
                        <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
                            <TouchableOpacity 
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200"
                            >
                                <Image source={images.minus} className="size-5" resizeMode="contain" />
                            </TouchableOpacity>
                            
                            <Text className="h2-bold text-dark-100">{quantity}</Text>
                            
                            <TouchableOpacity 
                                onPress={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 items-center justify-center rounded-full bg-primary"
                            >
                                <Image source={images.plus} className="size-5" resizeMode="contain" tintColor="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Add to Cart Button */}
                    <CustomButton 
                        title={`Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`}
                        onPress={handleAddToCart}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProductDetail;
