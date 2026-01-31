import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { theme as ThemeContext } from '../../theme'; // Using existing theme from project
import { useTheme } from '../../context/ThemeContext';

type CategoryTabType = { id: number | null, name: string };
type CategoryTabsProps = {
    categories: CategoryTabType[];
    activeCategory: string;
    onCategoryPress: (tab: CategoryTabType) => void;
    multipleSelection?: boolean;
    iconMapping?: Record<string, React.ReactNode>;
    categoryCounts?: Record<string, number>;
};

const CategoryTabs = ({ categories, activeCategory, onCategoryPress, multipleSelection = false, iconMapping, categoryCounts }: CategoryTabsProps) => {
    const { theme } = useTheme();

    // Memoize categories and counts for fast rendering
    const memoizedCategories = useMemo(() => categories, [categories]);
    const memoizedCounts = useMemo(() => categoryCounts, [categoryCounts]);
    const memoizedIconMapping = useMemo(() => iconMapping, [iconMapping]);

    const isSelected = (tab: CategoryTabType) => {
        return activeCategory === tab.name;
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            style={{ flexGrow: 0 }}
        >
            {memoizedCategories.length === 0 ? (
                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    <Text style={{ color: '#888', fontSize: 14 }}>Loading categories...</Text>
                </View>
            ) : (
                memoizedCategories.map((tab) => {
                    const active = isSelected(tab);
                    return (
                        <TouchableOpacity
                            key={tab.id ?? tab.name}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: active ? theme.colors.secondary : theme.colors.primary,
                                    borderColor: 'transparent'
                                }
                            ]}
                            onPress={() => onCategoryPress(tab)}
                            activeOpacity={0.7}
                        >
                            {/* Count Badge - Right Top Corner */}
                            {memoizedCounts && memoizedCounts[tab.name] !== undefined && (
                                <View style={styles.countBadge}>
                                    <Text style={styles.countBadgeText}>
                                        {memoizedCounts[tab.name]}
                                    </Text>
                                </View>
                            )}
                            {/* Horizontal Layout: Icon and text in one row */}
                            <View style={styles.tabContent}>
                                {/* Icon */}
                                {memoizedIconMapping && memoizedIconMapping[tab.name] && (
                                    <View style={styles.iconContainer}>
                                        {memoizedIconMapping[tab.name]}
                                    </View>
                                )}
                                {/* Text */}
                                <Text style={[styles.tabText, active && styles.activeTabText]}>{tab.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: hp('1%'),
        paddingHorizontal: wp(2),
        zIndex: 10,
    },
    tab: {
        borderRadius: 5,
        borderWidth: 0.2,
        paddingHorizontal: 16,
        paddingVertical: hp('1%'),
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        zIndex: 10,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        color: '#FFF',
        fontSize: wp('3.5%'),
        fontWeight: '500',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '700',
    },
    countBadge: {
        position: 'absolute',
        top: -1,
        right: -1,
        backgroundColor: '#FF3B30',
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 6,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    countBadgeText: {
        color: '#fff',
        fontSize: wp('2.2%'),
        fontWeight: 'bold',
    },
});

export default CategoryTabs;
