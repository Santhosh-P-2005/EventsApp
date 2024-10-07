import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, Alert, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditScreen = () => {
    const navigation = useNavigation();
    const [eventname, setEventName] = useState('');
    const [eventdate, setEventDate] = useState('');
    const [eventdesc, setEventDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { id } = route.params;

    useEffect(() => {
        fetch(`http://192.168.42.27:5000/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setEventName(data.Event_Name);
                setEventDate(formatDate(data.Event_Date));
                setEventDesc(data.Event_Description);
            })
            .catch((err) => console.log(err));
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const EditEvent = () => {
        setLoading(true);
        fetch(`http://192.168.42.27:5000/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_name: eventname,
                event_date: eventdate,
                event_desc: eventdesc,
            }),
        })
            .then((res) => {
                setLoading(false);
                if (res.ok) {
                    Alert.alert('Event Edited Successfully');
                    navigation.navigate("Home");
                } else {
                    Alert.alert('Failed to edit the event');
                }
            })
            .catch((err) => 
            {
                setLoading(false);
                console.log(err)
            }
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Event</Text>
            <TextInput
                style={styles.input}
                placeholder="Event Name"
                value={eventname}
                onChangeText={setEventName}
            />
            <TextInput
                style={styles.input}
                placeholder="Event Date (YYYY-MM-DD)"
                value={eventdate}
                onChangeText={setEventDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Event Description"
                value={eventdesc}
                onChangeText={setEventDesc}
            />
            <TouchableOpacity style={styles.button} onPress={EditEvent}>
            {loading ? (
                <ActivityIndicator size="large" color="white"></ActivityIndicator>
            ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
            )}
            </TouchableOpacity>
        </ScrollView>
    );
}

export default EditScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#6a1b9a',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
