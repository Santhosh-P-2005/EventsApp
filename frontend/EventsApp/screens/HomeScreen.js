import React, { useState, useEffect, useCallback } from "react";
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Animated
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {
    const [events, setEvents] = useState([]);
    const [fadeAnim] = useState(new Animated.Value(0));
    const navigation = useNavigation();

    const fetchevents = () => {
        fetch('http://192.168.42.27:5000/events')
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch((err) => console.log(err));
    };

    const delete_press = (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this event?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => delete_event(id) },
            ],
            { cancelable: true }
        );
    };

    const delete_event = (id) => {
        fetch(`http://192.168.42.27:5000/events/${id}`, { method: 'DELETE' })
            .then((res) => {
                if (res.ok) {
                    Alert.alert('Event Deleted Successfully');
                    fetchevents();
                }
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        fetchevents();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchevents();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEvent')}>
                <Text style={styles.addButtonText}>+ Add a New Event</Text>
            </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {events.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.actioncard}>
                                <Text style={styles.title}>{item.Event_Name}</Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.iconButton}
                                        onPress={() => navigation.navigate('EditEvent', { id: item.id })}
                                    >
                                        <MaterialIcons name="edit" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.iconButton}
                                        onPress={() => delete_press(item.id)}
                                    >
                                        <MaterialIcons name="delete" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.date}>{formatDate(item.Event_Date)}</Text>
                            <Text style={styles.description}>{item.Event_Description}</Text>
                        </View>
                    ))}
                    <View style={styles.bottomPadding} />
                </ScrollView>
            </Animated.View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        justifyContent: 'space-between',
        marginVertical: 10,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    actioncard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    date: {
        fontSize: 14,
        color: '#888',
        marginVertical: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconButton: {
        backgroundColor: '#6a1b9a',
        padding: 5,
        margin: 10,
        borderRadius: 6,
    },
    addButton: {
        backgroundColor: '#6a1b9a',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomPadding: {
        height: 100,
    },
});
