import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F9F4', // Soft background that complements the theme
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign:'center',
        justifyContent:'center',
        height:60,
        backgroundColor: '#5BA191',
        borderBottomWidth: 1,

    },
    headerText: {
        color:'#FFF',
        fontFamily: 'Manrope-Regular',
        fontSize:18,
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    pdfContainer: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    pageControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#F4F9F4',
    },
    pageControlButton: {
        backgroundColor: '#E0F2E9', // Lighter theme shade for button background
        padding: 10,
        borderRadius: 50,
        marginHorizontal: 5,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: '#D3D3D3', // Disabled button color
    },
    pageIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFF',
        marginHorizontal: 10,
        backgroundColor:'#5BA191',
        paddingHorizontal:30,
        paddingVertical:15,
        borderRadius:20,
    },
    bottomTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 80,
        borderTopWidth: 1,
        borderColor: '#FFF',
        backgroundColor: '#5BA191', // Slightly lighter theme shade
    },
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabButtonText: {
        fontSize: 14,
        color: '#FFF',
        marginTop: 4,
        fontFamily: 'Manrope-Regular',
    },
    moreOptions: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#5BA191',
        fontFamily: 'Manrope-Regular',
    },
    // Styles for the modal and download text
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    downloadModal: {
        width: '80%',
        padding: 20,
        backgroundColor: '#5BA191',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 10,
    },
    downloadText: {
      color: '#FFF',
      fontSize: 18,
      fontFamily: 'Manrope-Regular',
    },
    /** Loading Styles */
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFF',
    },
    loadingStatus:{
        fontFamily: 'Manrope-Regular',
        fontSize: 18,
        color:'#1E1E1E',
        marginTop:10,
        width:'80%',
        textAlign:'center',
    },
});

export default styles;
