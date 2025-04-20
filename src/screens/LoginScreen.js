/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable no-catch-shadow */
import React, { useState, useEffect } from 'react';
import { View,
         Text,
         TextInput,
         StyleSheet,
         TouchableOpacity,
         ActivityIndicator,
         KeyboardAvoidingView,
         Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from '../api/axios';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [duration, setDuration] = useState('90'); // Default to 1 day
    const [deviceID, setDeviceID] = useState('');
    const [requestLoading, setrequestLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeviceID = async () => {
            const id = await DeviceInfo.getUniqueId();
            setDeviceID(id);
        };
        fetchDeviceID();
    }, []);

    const fetchAndStoreEncryptionKey = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('/auth/getKey', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const encryptionKey = response.data.encryptionKey;

            // Store the key securely
            await EncryptedStorage.setItem('encryption_key', encryptionKey);
            console.log('Encryption key securely stored.');
        } catch (Error) {
            console.error('Failed to fetch or store the encryption key:', Error.message);
        }
    };

    const handleLogin = async () => {

        setrequestLoading(true);
        if (email === '' || password === ''){
            setError('Please enter your email and password.');
        }else{
            try {
                console.log(deviceID);
                const response = await axios.post('/auth/login', { email, password, deviceID });

                const { token, name, profilePic, id } = response.data;

                // Calculate session expiry
                const now = new Date();
                const expiry = new Date(now.getTime() + parseInt(duration) * 24 * 60 * 60 * 1000);

                // Store token and expiry in AsyncStorage
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('sessionExpiry', expiry.toISOString());
                await AsyncStorage.setItem('deviceID', deviceID);
                await AsyncStorage.setItem('name', name);
                await AsyncStorage.setItem('profilePic', profilePic);
                await AsyncStorage.setItem('id', id);

                fetchAndStoreEncryptionKey();



                // Navigate to the Home screen
                navigation.replace('Home');
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.error);
                }else{
                    setError('Unexpected Error: Try again after some time.');
                }
            }
        }
        setrequestLoading(false);
    };

    return (
        <KeyboardAvoidingView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                multiline={false}         // Important: keep it single-line
                numberOfLines={1}         // Optional: ensures single-line height
                ellipsizeMode="tail"      // Truncate overflow text with "..."
                scrollEnabled={true}      // Enables horizontal scroll if needed
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={password}
                multiline={false}         // Important: keep it single-line
                numberOfLines={1}         // Optional: ensures single-line height
                ellipsizeMode="tail"      // Truncate overflow text with "..."
                scrollEnabled={true}      // Enables horizontal scroll if needed
                onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            { requestLoading ? <ActivityIndicator
                            // style={{position:'absolute',bottom:100}}
                            size="large"
                            color="#5BA191" /> : <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>}
                        <Text style={styles.orText}>or</Text>
                        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Offline')}>
                            <Text style={styles.buttonText}>Downloaded Books</Text>
                        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      padding: 20,
    },
    title: {
      fontSize: 28,
      color: '#5BA191',
      marginBottom: 30,
      textAlign: 'center',
      fontFamily: 'Manrope-Bold',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      backgroundColor: '#fff',
      fontSize: 16,
      fontFamily: 'Manrope-Regular',
      color: 'black',

    },
    button: {
      width: '100%',
      backgroundColor: '#5BA191',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Manrope-Regular',
    },
    link: {
      color: '#5BA191',
      fontSize: 16,
      marginTop: 20,
      textDecorationLine: 'underline',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Manrope-Regular',

    },
    orText:{
        fontSize: 18,
        fontFamily: 'Manrope-Regular',
    },
  });


export default LoginScreen;
