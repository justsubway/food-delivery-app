import {View, Text, FlatList, TouchableOpacity, Platform} from 'react-native'
import {Category} from "@/type";
import {router, useLocalSearchParams} from "expo-router";
import {useState} from "react";
import cn from "clsx";

const Filter = ({ categories }: { categories: Category[] }) => {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = useState(searchParams.category || '');

    const handlePress = (categoryName: string) => {
        setActive(categoryName);

        if(categoryName === 'All') router.setParams({ category: undefined });
        else router.setParams({ category: categoryName });
    };

    // Create filter options with proper mapping
    const filterData = [
        { $id: 'all', name: 'All', categoryName: 'All' },
        { $id: 'burgers', name: 'Burgers', categoryName: 'Burgers' },
        { $id: 'pizzas', name: 'Pizzas', categoryName: 'Pizzas' },
        { $id: 'burritos', name: 'Burritos', categoryName: 'Burritos' },
        { $id: 'sandwiches', name: 'Sandwiches', categoryName: 'Sandwiches' },
        { $id: 'wraps', name: 'Wraps', categoryName: 'Wraps' },
        { $id: 'bowls', name: 'Bowls', categoryName: 'Bowls' },
    ];

    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-3"
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.$id}
                    className={cn('filter', active === item.categoryName ? 'bg-amber-500' : 'bg-white')}
                    style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787'} : {}}
                    onPress={() => handlePress(item.categoryName)}
                >
                    <Text className={cn('body-medium', active === item.categoryName ? 'text-white' : 'text-gray-200')}>{item.name}</Text>
                </TouchableOpacity>
            )}
        />
    )
}
export default Filter
