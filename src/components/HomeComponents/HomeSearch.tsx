import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const HomeSearch = () => {
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const navigation = useNavigation();

    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState(['Home Improvement', 'Business', 'IT and Graphic Design']);
    const [filteredOptions, setFilteredOptions] = useState(options);

    const openSearchModal = () => setShowModal(true);
    const closeSearchModal = () => setShowModal(false);

    const handleClearAll = () => setOptions([]);

    const handleOptionRemove = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const filterOptions = (text: string) => {
        setSearchText(text);
        const filtered = options.filter(option =>
            option.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    const handlesearchPress = (category: string) => {
        (navigation as any).navigate('CategoryDetails', { category });
        closeSearchModal();
    };

    return (
        <>
            <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>
                <Icon name="magnify" size={wp('6%')} color={isDarkMode ? '#CCC' : '#51514C'} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchBar, { color: isDarkMode ? '#FFF' : '#000' }]}
                    placeholder="Search services"
                    placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                    value={searchText}
                    onChangeText={filterOptions}
                    onFocus={openSearchModal}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={closeSearchModal}
            >
                <TouchableWithoutFeedback onPress={closeSearchModal}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={closeSearchModal}>
                            <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.modalSearchInput, { color: isDarkMode ? '#FFF' : '#000' }]}
                            placeholder="Search services"
                            placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                            value={searchText}
                            onChangeText={filterOptions}
                            autoFocus={true}
                        />
                    </View>
                    <View style={styles.optionsContainer}>
                        <View style={styles.optionsHeader}>
                            <Text style={[styles.recentText, { color: isDarkMode ? '#FFF' : '#000' }]}>Recent</Text>
                            <TouchableOpacity onPress={handleClearAll}>
                                <Text style={styles.clearAllText}>CLEAR ALL</Text>
                            </TouchableOpacity>
                        </View>
                        {filteredOptions.map((option, index) => (
                            <TouchableOpacity key={index} onPress={() => handlesearchPress(option)}>
                                <View style={styles.optionItem}>
                                    <Text style={[styles.optionText, { color: isDarkMode ? '#FFF' : '#000' }]}>{option}</Text>
                                    <TouchableOpacity onPress={() => handleOptionRemove(index)}>
                                        <Icon name="close" size={20} color={isDarkMode ? '#FFF' : '#000'} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: '#51514C',
        margin: wp('3%'),
        paddingHorizontal: wp('2%'),
        height: hp('6%'),
    },
    searchIcon: {
        marginRight: wp('2%'),
    },
    searchBar: {
        flex: 1,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    modalContent: {
        marginHorizontal: wp('5%'),
        borderRadius: wp('2%'),
        padding: wp('5%'),
        marginTop: hp('20%'),
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    modalSearchInput: {
        flex: 1,
        height: hp('6%'),
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('3%'),
        marginLeft: wp('2%'),
    },
    optionsContainer: {
        flexDirection: 'column',
    },
    optionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1%'),
    },
    recentText: {
        fontWeight: 'bold',
        fontSize: wp('4.5%'),
    },
    clearAllText: {
        color: '#12CCB7',
        fontWeight: '700'
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1%'),
        paddingVertical: wp('2%'),
    },
    optionText: {
        fontSize: wp('4%'),
    },
});

export default HomeSearch;
