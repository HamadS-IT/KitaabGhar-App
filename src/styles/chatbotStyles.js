import { StyleSheet } from 'react-native';

const chatbotStyles = StyleSheet.create({
    chatbotButton: {
        position: 'absolute',
        bottom: '10%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        right: 20,
        backgroundColor: '#5BA191',
        padding: 15,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    chatbotModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    chatbotModal: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    chatbotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    chatbotTitle: {
        fontSize: 18,
        fontFamily: 'Manrope-SemiBold',
        color: '#5BA191',
    },
    chatArea: {
        // minHeight: 400,
        // maxHeight: 400,
        paddingVertical: 10,
    },
    chatMessage: {
        fontSize: 16,
        marginVertical: 5,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontFamily: 'Manrope-Regular',
    },
    sendButton: {
        backgroundColor: '#5BA191',
        padding: 10,
        marginLeft: 5,
        borderRadius: 5,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#5BA191',
        color: '#FFF',
        padding: 8,
        borderRadius: 10,
        marginBottom: 5,
        fontFamily: 'Manrope-Regular',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#f1f1f1',
        color: 'black',
        padding: 8,
        borderRadius: 10,
        marginBottom: 5,
        fontFamily: 'Manrope-Regular',
    },
});

export default chatbotStyles;
