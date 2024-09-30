import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, Alert, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AddEventScreen = () => {
    const navigation = useNavigation();
    const [eventname, setEventName] = useState('');
    const [eventdate, setEventDate] = useState('');
    const [eventdesc, setEventDesc] = useState('');

    const AddEvent = () => {
        fetch('http://192.168.42.27:5000/events', {
            method: 'POST',
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
            if (res.ok) {
                Alert.alert('Event Added Successfully');
                navigation.navigate("Home");
            } else {
                Alert.alert('Failed to add event. Please try again.');
            }
        })
        .catch((err) => console.log(err));
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Event</Text>
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
            <TouchableOpacity style={styles.button} onPress={AddEvent}>
                <Text style={styles.buttonText}>Add Event</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default AddEventScreen;

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
