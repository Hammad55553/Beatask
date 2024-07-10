import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook if using React Navigation

interface Item {
    id: string;
    name: string;
    description: string;
    image: any;
    rating: number;
    reviews: number;
    price: number;
    highlyRated?: boolean;
}

const data: Item[] = [
    {
        id: '1',
        name: 'Benjamin Wilson',
        description: 'Expert in residential cleaning services, lawn care and trimming.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.5,
        reviews: 24,
        price: 20,
    },
    {
        id: '2',
        name: 'Maryland Winkles',
        description: 'Expert in residential cleaning services, lawn care and trimming.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 5.0,
        reviews: 32,
        price: 20,
        highlyRated: true,
    },
    {
        id: '3',
        name: 'John Doe',
        description: 'Expert in gardening and landscaping.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.8,
        reviews: 45,
        price: 25,
    },
    {
        id: '4',
        name: 'Jane Smith',
        description: 'Expert in interior design and home decor.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.2,
        reviews: 50,
        price: 30,
    },
    {
        id: '5',
        name: 'Emily Johnson',
        description: 'Expert in pet grooming and care.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.9,
        reviews: 20,
        price: 15,
    },
    {
        id: '6',
        name: 'Michael Brown',
        description: 'Expert in electrical repairs and installations.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.6,
        reviews: 28,
        price: 40,
    },
    {
        id: '7',
        name: 'Sarah Davis',
        description: 'Expert in plumbing and pipe fitting.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.3,
        reviews: 22,
        price: 35,
    },
    {
        id: '8',
        name: 'David Martinez',
        description: 'Expert in home renovation and construction.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.7,
        reviews: 38,
        price: 50,
    },
];

const HomeScreen: React.FC = () => {
    const [sortVisible, setSortVisible] = useState(false);
    const [sortValue, setSortValue] = useState('rating');
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const navigation = useNavigation(); // Initialize useNavigation hook

    const renderItem = ({ item }: { item: Item }) => (
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={[styles.name, isDarkMode && styles.textDark]}>{item.name}</Text>
                <Text style={[styles.description, isDarkMode && styles.textDark]}>{item.description}</Text>
                <View style={styles.ratingContainer}>
                    <Text style={[styles.rating, isDarkMode && styles.textDark]}>{item.rating}</Text>
                    <Icon name="star" size={20} color="#ffd700" />
                    <Text style={[styles.reviews, isDarkMode && styles.textDark]}>({item.reviews})</Text>
                </View>
                {/* <Text style={[styles.price, isDarkMode && styles.textDark1]}>${item.price}</Text> */}
                <TouchableOpacity style={[styles.button, isDarkMode && styles.buttonDark]} onPress={handleView}>
                    <Text style={styles.buttonText}>VIEW</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleItemPress = (item: Item) => {
        // Navigate or handle item press action
    };

    const handleView = () => {
        navigation.navigate('Service' as never);
    };

    const handleFilterPress = () => {
        navigation.navigate('Filter' as never);
    };

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={1} // Set to 1 to display one item per row
                key={'1'} // Unique key to force re-render when changing numColumns
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerDark: {
        backgroundColor: '#010A0C',
    },
    list: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        margin: 5,
        padding: 10,
        backgroundColor: '#51514C',
        borderRadius: 10,
        alignItems: 'center',
    },
    cardDark: {
        backgroundColor: '#fff',
    },
    image: {
        width: wp('40%'),
        height: wp('50%'),
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
    },
    textDark: {
        color: '#010A0C',
    },
    textDark1: {
        color: '#12CCB7',
    },
    description: {
        textAlign: 'left',
        marginVertical: 10,
        color: '#fff',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: wp('4%'),
        marginRight: 5,
        color: '#fff',
    },
    reviews: {
        fontSize: wp('4%'),
        color: '#fff',
    },
    price: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#12CCB7',
    },
    button: {
        backgroundColor: '#00ced1',
        padding: 10,
        borderRadius: wp('4%'),
        marginTop:wp('4%'),
        marginHorizontal:wp('10%'),
    },
    buttonDark: {
        backgroundColor: '#008b8b',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf:'center',
    },
   
});

export default HomeScreen;
