/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Alert, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import styles from '../styles/bookReadStyle';
import { createDecipheriv } from 'react-native-quick-crypto';
import { Buffer } from 'buffer';


const OfflinePDFViewerScreen = ({ route }) => {
    const { item } = route.params;
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pdfFilePath, setPdfFilePath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingStatus, setloadingStatus] = useState('');
    const pdfRef = useRef(null);


    const decryptAES256 = async (encryptedBuffer, encryptionKey, ivBuffer) => {
        try {
            console.log('🔐 Starting AES-256 decryption...');
            const keyBuffer = Buffer.from(encryptionKey, 'utf8');
            if (keyBuffer.length !== 32) {
                throw new Error('Encryption key must be 32 bytes');
            }
            const decipher = createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
            let decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
            console.log('✅ Decryption successful!');
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    };

    const extractIVAndEncryptedData = (encryptedBuffer) => {
        const ivBuffer = encryptedBuffer.slice(0, 16);
        const encryptedContentBuffer = encryptedBuffer.slice(16);
        console.log('✅ Extracted IV');
        return { ivBuffer, encryptedContentBuffer };
    };

    const loadBookFromLocal = async () => {
        try {

            const fillString = (str, char) => str.padStart((32 + str.length) / 2, char).padEnd(32, char);
            const deviceID = await DeviceInfo.getUniqueId();
            const encryptionKey = fillString(deviceID,'H');

            if (!encryptionKey) {
                throw new Error('Encryption key not found.');
            }

            setloadingStatus('Reading encrypted file from local storage...');
            console.log('📂 Reading encrypted file from local storage...');
            const encryptedBase64 = await RNFS.readFile(item.filePath, 'base64');
            const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');

            console.log('📂 File read, extracting IV...');
            setloadingStatus('File read, preparing for decryption...');
            const { ivBuffer, encryptedContentBuffer } = extractIVAndEncryptedData(encryptedBuffer);

            console.log('🟡 Starting decryption...');
            setloadingStatus('Starting decryption...');
            const decryptedBuffer = await decryptAES256(encryptedContentBuffer, encryptionKey, ivBuffer);

            console.log('✅ Decryption complete, saving file...');
            setloadingStatus('Decryption complete, preparing file for the viewer...');
            const tempFilePath = `${RNFS.CachesDirectoryPath}/${item.filePath.split('/').pop().replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

            await RNFS.writeFile(tempFilePath, decryptedBuffer.toString('base64'), 'base64');

            console.log('📂 File saved successfully:', tempFilePath);
            setloadingStatus('Done :)');
            setPdfFilePath(tempFilePath);

        } catch (error) {
            console.error('❌ Error loading book:', error.message);
            Alert.alert('Error', 'Failed to load and decrypt the book.');
            setLoading(false); // Prevent infinite loading if error occurs
        }
    };

    useEffect(() => {
        loadBookFromLocal();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Loader Overlay (ALWAYS SHOWN UNTIL PDF DISPLAYS A PAGE) */}
            {loading && (
                <View style={[styles.loadingContainer, { position: 'absolute', zIndex: 2, width: '100%', height: '100%' }]}>
                    <ActivityIndicator size="large" color="#5BA191" />
                    <Text style={styles.loadingStatus}>{loadingStatus}</Text>
                </View>
            )}

            {/* PDF Viewer (ALWAYS RENDERED) */}
            <View style={styles.pdfContainer}>
            <View style={styles.header}>
                    <Text style={styles.headerText}> Ebook Viewer </Text>
                </View>
                <Pdf
                    ref={pdfRef}
                    source={{ uri: pdfFilePath ? `file://${pdfFilePath}` : null, cache: true }}
                    horizontal
                    enablePaging
                    scrollEnabled={true}
                    onLoadComplete={(numberOfPages) => {
                        console.log(`✅ PDF loaded with ${numberOfPages} pages.`);
                        setTotalPages(numberOfPages);
                    }}
                    onPageChanged={(pageNo, numberOfPages) => {
                        console.log(`📖 Page changed: ${pageNo} / ${numberOfPages}`);
                        setPage(pageNo);
                        setTotalPages(numberOfPages);
                        if (loading) {
                            setLoading(false); // Hide the loading screen once a page is displayed
                        }
                    }}
                    style={styles.pdf}
                />
            </View>

            {/* Navigation Controls */}
            <View style={styles.pageControls}>
                <Text style={styles.pageIndicator}>
                    {page} / {totalPages}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default OfflinePDFViewerScreen;
