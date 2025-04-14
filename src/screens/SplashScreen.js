/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';

const CustomSplashScreen = ({ navigation }) => {

    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
        }, 3000);
    }, []);

    return (
        <View style={styles.container}>
            {/* Logo Animation */}
            <Animatable.Image
                animation="bounceInDown"
                duration={1500}
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
            />

            {/* Heading Animation */}
            <Animatable.Text
                animation="bounceInUp"
                duration={2000}
                delay={500}
                style={styles.heading}
            >
                Kitab Ghar
            </Animatable.Text>

            {/* Subheading Animation */}
            <Animatable.Text
                animation="bounceInUp"
                duration={2000}
                delay={1000}
                style={styles.subheading}
            >
                One Stop Solution for your
                all problems
            </Animatable.Text>

            {Loading && <ActivityIndicator
                // eslint-disable-next-line react-native/no-inline-styles
                style={{position:'absolute',bottom:100}}
                size="large"
                color="#5BA191" /> }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position:'relative',
    },
    logo: {
        width: 150,
        height: 150,
        margin: '-10',
    },
    heading: {
        fontSize: 44,
        fontFamily: 'Manrope-ExtraBold',
        color: '#5BA191',
    },
    subheading: {
        fontSize: 24,
        width:300,
        fontFamily: 'Manrope-SemiBold',
        color: '#1E1E1E',
        textAlign:'center',
        lineHeight:26,
        marginTop: 7,
        zIndex:100,
    },
});

export default CustomSplashScreen;
