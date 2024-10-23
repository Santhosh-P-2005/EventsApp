import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { storage } from "../firebase";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const { width, height } = Dimensions.get('window');

const EditScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;

    const [eventname, setEventName] = useState('');
    const [eventdate, setEventDate] = useState('');
    const [eventdesc, setEventDesc] = useState('');
    const [image, setImage] = useState(null);
    const [imageurl, setImageurl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`http://10.1.125.39:5000/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setEventName(data.Event_Name);
                setEventDate(formatDate(data.Event_Date));
                setEventDesc(data.Event_Description);
                setImageurl(data.Event_poster);
            })
            .catch((err) => console.log(err));
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const uploadImage = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const fileName = `${uuidv4()}.jpg`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, blob);

            const downloadUrl = await getDownloadURL(storageRef);
            setImageurl(downloadUrl);

            return downloadUrl;
        } catch (error) {
            Alert.alert("Upload Error", `Failed to upload image: ${error.message}`);
            console.error("Upload Error:", error);
        }
    };

    const pickimage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissions Required', 'To access your files, permission is needed.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takeimage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'To access your camera, permission is needed.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const EditEvent = async () => {
        setLoading(true);
        let uploadedImageUrl = imageurl;

        if (image) {
            uploadedImageUrl = await uploadImage(image);
        }

        fetch(`http://10.1.125.39:5000/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_name: eventname,
                event_date: eventdate,
                event_desc: eventdesc,
                image: uploadedImageUrl,
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
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
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

                    <View style={styles.imagePickerContainer}>
                        <TouchableOpacity style={styles.imageButton} onPress={pickimage}>
                            <Text style={styles.imageButtonText}>Pick an Image from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageButton} onPress={takeimage}>
                            <Text style={styles.imageButtonText}>Take a Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {imageurl && !image && (
                        <Image
                            source={{ uri: imageurl }}
                            style={{ width: width * 0.8, height: height * 0.3, marginVertical: 20 }}
                            resizeMode="contain"
                        />
                    )}

                    {image && (
                        <Image
                            source={{ uri: image }}
                            style={{ width: width * 0.8, height: height * 0.3, marginVertical: 20 }}
                            resizeMode="contain"
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={EditEvent} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditScreen;

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        alignItems: 'center',
        width: '100%',
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
    imagePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        width: '100%',
    },
    imageButton: {
        padding: 5,
        backgroundColor: '#6a1b9a',
        borderRadius: 5,
    },
    imageButtonText: {
        color: '#fff',
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
