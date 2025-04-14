/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { navigationRef } from './src/navigation/NavigationService'; // Optional for global navigation
import AppNavigator from './src/navigation/AppNavigator';
import CustomSplashScreen from './src/screens/SplashScreen';
import { StyleSheet } from 'react-native';
import cleanDownloadedBooks from './src/components/cleanDownloadedBooks';


const App = () => {
    const [loading, setLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState(null);

    const validateSession = async () => {
        try {
            const token      = await AsyncStorage.getItem('token');
            const expiry     = await AsyncStorage.getItem('sessionExpiry');
            const name       = await AsyncStorage.getItem('name');
            const profilePic = await AsyncStorage.getItem('profilePic');
            const userID     = await AsyncStorage.getItem('id');
            const deviceID   = await AsyncStorage.getItem('deviceID');
            const globalKey  = await EncryptedStorage.getItem('encryption_key');


            console.warn('Token:', token);
            console.warn('Expiry:', expiry);
            console.warn('Name:', name);
            console.warn('ProfilePic:', profilePic);
            console.warn('userID:', userID);
            console.warn('globalKey:', globalKey);
            console.warn('deviceID:', deviceID);

            // await AsyncStorage.clear();
            // await EncryptedStorage.clear();

            // Check session validity
            if (!token || !expiry || new Date(expiry) < new Date()) {
                // Clear session and navigate to Login
                await AsyncStorage.clear();
                await EncryptedStorage.clear();
                // navigationRef.current?.navigate('Login');
                setInitialRoute('Login');
            } else {
                // Navigate to Home
                // navigationRef.current?.navigate('Home');
                setInitialRoute('Home');
            }
        } catch (err) {
            console.error('Error validating session:', err);
            setInitialRoute('Login');
        } finally {
            setLoading(false); // Hide the loading screen once validation is done
        }
    };

    useEffect(() => {
        setTimeout(() => {
            cleanDownloadedBooks();
            validateSession();
        }, 5000);
    }, []);

    if (loading) {
        return (
            <CustomSplashScreen/>
        );
    }


    return (
        <NavigationContainer ref={navigationRef}>
            <AppNavigator initialRouteName={initialRoute} />
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      backgroundColor: '#E8F6F1',
    },
    loadingText: {
      fontSize: 18,
      color: '#5BA191',
    },
});

export default App;
