import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Modal,
    Animated,
    PanResponder,
    TouchableWithoutFeedback,
} from 'react-native';
import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/bookReadStyle';
import chatbotStyles from '../styles/chatbotStyles';
import NotesManager from './NotesManager';
import axios from 'axios';

export default function BookReadScreen({ route }) {
    const { book } = route.params;

    // State Management
    const [email, setUseremail] = useState('');
    const [page, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [downloadModalVisible, setDownloadModalVisible] = useState(false);
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    // PDF Reference
    const pdfRef = useRef(null);

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

    // Fetch User Email from AsyncStorage
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {throw new Error('No token found');}

                const response = await axios.get('http://192.168.0.128:5000/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUseremail(response.data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserEmail();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* PDF Viewer */}
            <View style={styles.pdfContainer}>
                <Pdf
                    source={{ uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true }}
                    horizontal
                    enablePaging
                    scrollEnabled
                    ref={pdfRef}
                    onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
                    onPageChanged={(Page) => setPages(Page)}
                    style={styles.pdf}
                />
            </View>

            {/* Page Indicator */}
            <View style={styles.pageControls}>
                <Text style={styles.pageIndicator}>
                    {page} / {totalPages}
                </Text>
            </View>

            {/* Bottom Tabs */}
            <View style={styles.bottomTabs}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setNotesModalVisible(true)}>
                    <Icon name="note-add" size={28} color="#5BA191" />
                    <Text style={styles.tabButtonText}>Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => console.log('Audio feature activated')}>
                    <Icon name="mic" size={28} color="#5BA191" />
                    <Text style={styles.tabButtonText}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => setDownloadModalVisible(!downloadModalVisible)}
                >
                    <Icon name="more-horiz" size={28} color="#5BA191" />
                    <Text style={styles.tabButtonText}>More</Text>
                </TouchableOpacity>
            </View>

            {/* Download Modal */}
            <Modal transparent visible={downloadModalVisible} onRequestClose={() => setDownloadModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setDownloadModalVisible(false)}>
                    <View style={styles.modalBackdrop}>
                        <View style={styles.downloadModal}>
                            <TouchableOpacity onPress={() => console.log('Download PDF clicked')}>
                                <Text style={styles.downloadText}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Notes Manager */}
            <NotesManager visible={notesModalVisible} onClose={() => setNotesModalVisible(false)} bookTitle={book} pageNo={page} email={email} />

            {/* Floating Chatbot Button (Draggable) */}
            <Animated.View
                style={[chatbotStyles.chatbotButton, { transform: pan.getTranslateTransform() }]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity onPress={() => setChatbotVisible(true)}>
                    <Icon name="chat" size={30} color="white" />
                </TouchableOpacity>
            </Animated.View>

            {/* Chatbot Modal */}
            <Modal animationType="slide" transparent={true} visible={chatbotVisible} onRequestClose={() => setChatbotVisible(false)}>
                <View style={chatbotStyles.chatbotModalContainer}>
                    <View style={chatbotStyles.chatbotModal}>
                        {/* Header */}
                        <View style={chatbotStyles.chatbotHeader}>
                            <Text style={chatbotStyles.chatbotTitle}>Chatbot</Text>
                            <TouchableOpacity onPress={() => setChatbotVisible(false)}>
                                <Icon name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Chat Messages */}
                        <View style={chatbotStyles.chatArea}>
                            {chatMessages.map((message, index) => (
                                <Text key={index} style={chatbotStyles.chatMessage}>
                                    {message}
                                </Text>
                            ))}
                        </View>

                        {/* Chat Input */}
                        <View style={chatbotStyles.chatInputContainer}>
                            <TextInput
                                style={chatbotStyles.chatInput}
                                placeholder="Ask me anything..."
                                value={chatInput}
                                onChangeText={setChatInput}
                            />
                            <TouchableOpacity
                                style={chatbotStyles.sendButton}
                                onPress={() => {
                                    if (chatInput.trim() !== '') {
                                        setChatMessages([...chatMessages, chatInput]);
                                        setChatInput('');
                                    }
                                }}
                            >
                                <Icon name="send" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
