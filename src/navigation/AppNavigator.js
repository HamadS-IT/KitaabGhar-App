import React from 'react';
import { createStackNavigator } from  '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import MyBookDetailsScreen from '../screens/MyBookDetailsScreen';
import OfflineScreen from '../screens/OfflineScreen';
import PDFViewerScreen from '../screens/PDFViewerScreen';
import OfflinePDFViewerScreen from '../screens/OfflinePDFViewerScreen';
import CustomSplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator();

const AppNavigator = ( { initialRouteName }) => {
    return (
            <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen name="Splash" component={CustomSplashScreen}                options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen}                        options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen}                          options={{ headerShown: false }} />
                <Stack.Screen name="BookDetails" component={BookDetailsScreen}            options={{ headerShown: false }} />
                <Stack.Screen name="PurchasedBookDetails" component={MyBookDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Offline" component={OfflineScreen}                    options={{ headerShown: false }} />
                <Stack.Screen name="pdfViewer" component={PDFViewerScreen}                options={{ headerShown: false }} />
                <Stack.Screen name="offlinePDFViewer" component={OfflinePDFViewerScreen}  options={{ headerShown: false }} />
            </Stack.Navigator>
    );
};

export default AppNavigator;
