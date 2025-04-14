/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView,
         View,
         Alert,
         TextInput,
         ActivityIndicator,
         TouchableOpacity,
         Text,
         Modal,
         Animated,
         PanResponder,
         TouchableWithoutFeedback,
         FlatList,
         KeyboardAvoidingView,
         Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNFS from 'react-native-fs'; // Import React Native File System
import styles from '../styles/bookReadStyle';
import NotesManager from './NotesManager';
import axios from '../api/axios';
import { createDecipheriv } from 'react-native-quick-crypto';
import chatbotStyles from '../styles/chatbotStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';

const PDFViewerScreen = ({ route }) => {
    const { book } = route.params;
    const vectorDB = book.vectorDB || 'No';
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [downloadModalVisible, setDownloadModalVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [Chatloading, setChatLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [loadingStatus, setloadingStatus] = useState('');
    const [isDownloaded, setIsDownloaded] = useState(false);
    const flatListRef = useRef(null);

    const pdfRef = useRef(null);

    const checkDownloadedStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('/auth/downloadedBooks', {
                headers: { Authorization: `Bearer ${token}` },
            });

          const downloadedBooks = response.data.downloadedBooks;

          // Check if bookId exists in the downloadedBooks array
          setIsDownloaded(downloadedBooks.includes(book._id.toString()));
        } catch (error) {
          console.error('Error fetching downloaded books:', error);
        }
      };

    // Fetch chat history when modal opens
    useEffect(() => {
        if (chatbotVisible) {
            fetchHistory();
        }
    }, [chatbotVisible]);

    // Fetch user's past Q&A history from the API
    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`/semanticSearch/ask/history/${book._id.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }            });

            if (response.status === 200) {
                const formattedHistory = response.data.history.map(item => [
                    { type: 'user', text: item.question },
                    { type: 'bot', text: item.answer + (item.pageNumbers ? ` (Page: ${item.pageNumbers})` : '') }                ]).flat(); // Flatten the array

                setChatMessages(formattedHistory);
            }
        } catch (error) {
            console.error('Error fetching chatbot history:', error);
        } finally {
            setHistoryLoading(false);
        }
    };


    // Function to send user message to the API
    const sendMessage = async () => {
        if (!chatInput.trim()) {return;}

        const userMessage = chatInput.trim();
        setChatMessages(prevMessages => [...prevMessages, { type: 'user', text: userMessage }]);
        setChatInput('');
        setChatLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            // Send question to Node.js API
            const response = await axios.post(
                '/semanticSearch/ask',
                { question: userMessage, bookId: book._id.toString() },
                { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                const { answer, pageNumbers } = response.data;
                setChatMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'bot', text: answer + (pageNumbers ? ` (Page: ${pageNumbers})` : '') }              ]);
            } else {
                setChatMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'bot', text: 'Error: Unable to retrieve answer.' }                ]);
            }
        } catch (error) {
            console.error('Chatbot API Error:', error);
            setChatMessages(prevMessages => [
                ...prevMessages,
                { type: 'bot', text: 'Error: Something went wrong. Please try again.' }            ]);
        } finally {
            setChatLoading(false);
            // Scroll to the bottom after a new message
            setTimeout(() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }), 100);
        }
    };

    // PanResponder for Dragging Chatbot
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 }, // Snap back to original position (optional)
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    const decryptAES256 = async (encryptedBuffer, encryptionKey, ivBuffer) => {
        try {
            console.log('🔐 Starting AES-256 decryption...');

            // Ensure encryption key is 32 bytes
            const keyBuffer = Buffer.from(encryptionKey, 'utf8');
            if (keyBuffer.length !== 32) {throw new Error('Encryption key must be 32 bytes');}

            // Create decipher instance
            const decipher = createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
            let decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

            console.log('✅ Decryption successful!');
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    };

    const extractIVAndEncryptedData = (encryptedBuffer) => {
        // Extract IV (First 16 bytes)
        const ivBuffer = encryptedBuffer.slice(0, 16);
        const encryptedContentBuffer = encryptedBuffer.slice(16); // Encrypted content

        console.log('✅ Extracted IV');
        return { ivBuffer, encryptedContentBuffer };
    };

    const loadBookFromURL = async () => {
        try {
            const encryptionKey = await EncryptedStorage.getItem('encryption_key');
            if (!encryptionKey) {throw new Error('Encryption key not found.');}

            await checkDownloadedStatus();

            console.log('📥 Fetching encrypted file...');
            setloadingStatus('Fetching encrypted file...');

            // Download encrypted PDF
            const response = await axios.get(book.fileUrl, { responseType: 'arraybuffer' });
            const encryptedBuffer = Buffer.from(response.data);

            console.log('📂 File fetched, extracting IV...');
            setloadingStatus('File fetched, preparing for decryption...');

            // Extract IV and Encrypted Content
            const { ivBuffer, encryptedContentBuffer } = extractIVAndEncryptedData(encryptedBuffer);

            console.log('🟡 Starting fast decryption...');
            setloadingStatus('Starting decryption...');

            // Decrypt file
            const decryptedBuffer = await decryptAES256(encryptedContentBuffer, encryptionKey, ivBuffer);

            console.log('✅ Decryption complete, saving file...');
            setloadingStatus('Decryption complete, preparing file for the viewer...');

            // Create a temporary file path
            const tempFilePath = `${RNFS.CachesDirectoryPath}/${book.title.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

            // Save decrypted file to temp storage
            await RNFS.writeFile(tempFilePath, decryptedBuffer.toString('base64'), 'base64');

            console.log('📂 File saved successfully:', tempFilePath);
            setloadingStatus('Done :)');

            setPdfFilePath(tempFilePath);
            // setLoading(false);

        } catch (error) {
            console.error('❌ Error loading book:', error.message);
            Alert.alert('Error', 'Failed to load and decrypt the book.');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookFromURL();
    }, []);


    const downloadEncryptedFile = async (bookId, coverUrl, bookName, authorName) => {
        try {

            setloadingStatus('');
            console.log('📥 Downloading encrypted book and cover...');
            setloadingStatus('Downloading encrypted book and cover...');

            // Define hidden folder path inside app storage (not accessible from file manager)
            const hiddenFolderPath = `${RNFS.DocumentDirectoryPath}/.ebooks`;
            const deviceID   = await AsyncStorage.getItem('deviceID');
            const token      = await AsyncStorage.getItem('token');

            // Ensure the hidden folder exists
            const folderExists = await RNFS.exists(hiddenFolderPath);
            if (!folderExists) {
                await RNFS.mkdir(hiddenFolderPath);
                console.log('📁 Hidden folder created:', hiddenFolderPath);
            }

            // Sanitize file names
            const expiryDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            const formattedExpiryDate = expiryDate.toISOString().split('T')[0].replace(/-/g, '99999');
            const sanitizedBookName = bookName.replace(/\s+/g,'_').replace(/\(/g,'00000').replace(/\)/g,'11111').replace(/[^a-zA-Z0-9_-]/g, '');
            const sanitizedAuthorName = authorName.replace(/\s+/g,'_').replace(/\(/g,'00000').replace(/\)/g,'11111').replace(/[^a-zA-Z0-9_-]/g, '');
            const fileName = `${bookId}____${sanitizedBookName}____${sanitizedAuthorName}____${formattedExpiryDate}`;

            // Define full file paths
            const PDFFilePath = `${hiddenFolderPath}/${fileName}.pdf`;
            const coverFilePath = `${hiddenFolderPath}/${fileName}.jpg`;

            // Download and save file
            const res = await RNFetchBlob.config({
                path: PDFFilePath,
                fileCache: true,
                overwrite: true,
            })
            .fetch('POST', `http://127.0.0.1:3000/api/v1/books/download/${bookId}`, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, JSON.stringify({
                'deviceID':deviceID,
            }));

            const statusCode = res.respInfo.status;

            if (statusCode === 200) {

                // **Check if file was actually written**
                const fileSize = await RNFetchBlob.fs.stat(res.path());
                if (fileSize.size === 0) {
                    throw new Error('Downloaded file is empty.');
                }


                console.log('✅ Encrypted book saved at:', PDFFilePath);

                // Download and save book cover
                if (coverUrl) {
                    const coverResponse = await axios.get(coverUrl, { responseType: 'arraybuffer' });
                    const coverBase64 = Buffer.from(coverResponse.data).toString('base64');
                    await RNFS.writeFile(coverFilePath, coverBase64, 'base64');
                    console.log('✅ Book cover saved at:', coverFilePath);
                } else {
                    console.log('⚠️ No cover URL provided. Skipping cover download.');
                }
                setloadingStatus('Book downloaded and saved securely :)');
                setLoading(false);
                Alert.alert('Download Complete', 'Book saved securely.');
                setloadingStatus('');
                setIsDownloaded(true);
                return { pdfFilePath, coverFilePath };
            } else {

                const responseBody = await res.json();
                // console.error('Error status:', statusCode);
                // console.error('Error response:', responseBody.error);
                setLoading(false);
                Alert.alert('Error',responseBody.error);

                return { pdfFilePath, coverFilePath };
            }

        } catch (error) {
            console.error('❌ Error downloading file:', error.message);
        }
    };

    const handleDownload = async () => {
        try {

            if (isDownloaded) {
                Alert.alert('Error','Book already downloaded on a device.');
                return;

            }else{
                setDownloadModalVisible(false);
                setLoading(true);
                await downloadEncryptedFile(
                    book._id.toString(),
                    book.coverUrl, // Cover Image URL
                    book.title, // Book Name
                    book.author // Author Name
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download the encrypted book.');
            setLoading(false);
        }
    };


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

            {/* Bottom Tabs */}
            <View style={styles.bottomTabs}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setNotesModalVisible(true)}>
                    <Icon name="note-add" size={28} color="#FFF" />
                    {/* <MaterialIcons name="house" color="#ff0000" size={20} /> */}
                    <Text style={styles.tabButtonText}>Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => console.log('Audio feature activated')}>
                    <Icon name="mic" size={28} color="#FFF" />
                    <Text style={styles.tabButtonText}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => setDownloadModalVisible(!downloadModalVisible)}
                >
                    <Icon name="more-horiz" size={28} color="#FFF" />
                    <Text style={styles.tabButtonText}>More</Text>
                </TouchableOpacity>
            </View>

            {/* Download Modal */}
            <Modal
                transparent
                visible={downloadModalVisible}
                onRequestClose={() => setDownloadModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setDownloadModalVisible(false)}>
                    <View style={styles.modalBackdrop}>
                        <View style={styles.downloadModal}>
                            <TouchableOpacity onPress={() => handleDownload()}>
                                <Text style={styles.downloadText}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Notes Manager */}
            <NotesManager
                visible={notesModalVisible}
                onClose={() => setNotesModalVisible(false)}
                bookID={book._id.toString()}
                pageNo={page} />

            {/* Floating Chatbot Button (Draggable) */}

            { vectorDB === 'Yes' ?
            <Animated.View
                style={[chatbotStyles.chatbotButton, { transform: pan.getTranslateTransform() }]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity onPress={() => setChatbotVisible(true)}>
                    <Icon name="chat" size={30} color="white" />
                </TouchableOpacity>
            </Animated.View>
            : '' }


            <Modal animationType="slide" transparent={true} visible={chatbotVisible} onRequestClose={() => setChatbotVisible(false)}>
            <View style={chatbotStyles.chatbotModalContainer}>
                <View style={chatbotStyles.chatbotModal}>

                    {/* Header */}
                    <View style={chatbotStyles.chatbotHeader}>
                        <Text style={chatbotStyles.chatbotTitle}>Semantic Search</Text>
                        <TouchableOpacity onPress={() => setChatbotVisible(false)}>
                            <Icon name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Messages in FlatList */}
                    <View style={{ height:400 }}>
                    <FlatList
                        ref={flatListRef}
                        data={chatMessages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Text style={item.type === 'user' ? chatbotStyles.userMessage : chatbotStyles.botMessage}>
                                {item.text}
                            </Text>
                        )}
                        contentContainerStyle={chatbotStyles.chatArea}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        ListHeaderComponent={historyLoading ? <ActivityIndicator size="small" color="#5BA191" /> : null}
                    />
                    {/* Show loading indicator while waiting for response */}
                    {Chatloading && <ActivityIndicator size="small" color="#5BA191" />}
                    </View>
                    {/* Chat Input */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                    <View style={chatbotStyles.chatInputContainer}>
                        <TextInput
                            style={chatbotStyles.chatInput}
                            placeholder="Ask me anything..."
                            value={chatInput}
                            multiline={false}         // Important: keep it single-line
                            numberOfLines={1}         // Optional: ensures single-line height
                            ellipsizeMode="tail"      // Truncate overflow text with "..."
                            scrollEnabled={true}      // Enables horizontal scroll if needed
                            onChangeText={setChatInput}
                            editable={!loading} // Disable input while waiting for response
                        />
                        <TouchableOpacity
                            style={chatbotStyles.sendButton}
                            onPress={sendMessage}
                            disabled={loading} // Disable button while waiting for response
                        >
                            <Icon name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    </KeyboardAvoidingView>

                </View>
            </View>
        </Modal>
        </SafeAreaView>
    );
};

export default PDFViewerScreen;
