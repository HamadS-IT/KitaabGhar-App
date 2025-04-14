import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatbotStyles from '../styles/chatbotStyles'; // Ensure you have a styles file

const ChatbotModal = ({ chatbotVisible, setChatbotVisible, bookId }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to send user message to the API
    const sendMessage = async () => {
        if (!chatInput.trim()) {return;}

        const userMessage = chatInput.trim();
        setChatMessages([...chatMessages, { type: 'user', text: userMessage }]);
        setChatInput('');
        setLoading(true);

        try {
            // Retrieve token for authentication
            const token = await AsyncStorage.getItem('token');

            // Make API request to Node.js backend using Axios
            const response = await axios.post(
                '/books/ask',
                { question: userMessage, bookId: bookId },
                { headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`                }}
            );

            if (response.status === 200) {
                const { answer, pageNumbers } = response.data;
                setChatMessages([...chatMessages,
                    { type: 'user', text: userMessage },
                    { type: 'bot', text: answer + (pageNumbers ? ` (Page: ${pageNumbers})` : '') }                ]);
            } else {
                setChatMessages([...chatMessages,
                    { type: 'user', text: userMessage },
                    { type: 'bot', text: 'Error: Unable to retrieve answer.' }                ]);
            }
        } catch (error) {
            console.error('Chatbot API Error:', error);
            setChatMessages([...chatMessages,
                { type: 'user', text: userMessage },
                { type: 'bot', text: 'Error: Something went wrong. Please try again.' }            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
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

                    {/* Chat Messages */}
                    <View style={chatbotStyles.chatArea}>
                        {chatMessages.map((message, index) => (
                            <Text key={index} style={message.type === 'user' ? chatbotStyles.userMessage : chatbotStyles.botMessage}>
                                {message.text}
                            </Text>
                        ))}

                        {/* Show loading indicator while waiting for response */}
                        {loading && <ActivityIndicator size="small" color="#0000ff" />}
                    </View>

                    {/* Chat Input */}
                    <View style={chatbotStyles.chatInputContainer}>
                        <TextInput
                            style={chatbotStyles.chatInput}
                            placeholder="Ask me anything..."
                            value={chatInput}
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

                </View>
            </View>
        </Modal>
    );
};

export default ChatbotModal;
