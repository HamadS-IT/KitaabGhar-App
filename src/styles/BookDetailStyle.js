import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get the screen width

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: 20,
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
  bookCover: {
    width: width - 40, // Cover image takes full width with padding subtracted
    height: (width - 40) * 1.5, // Maintain aspect ratio (e.g., 2:3 ratio)
    borderRadius: 15, // Slightly more rounded corners
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 28,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
    color: '#1E1E1E',
  },
  bookAuthor: {
    fontSize: 18,
    color: '#5BA191', // Updated to your app's primary color
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },
  bookLanguage: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },
  purchaseButton: {
    width: '80%',
    paddingVertical: 14, // Slightly larger padding for a more prominent button
    backgroundColor: '#5BA191', // Updated to your app's primary color
    borderRadius: 12, // More rounded button corners
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000', // Add shadow for button depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Manrope-Regular',
  },
  descriptionContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20, // Add padding for description container
  },
  sectionTitle: {
    fontSize: 22, // Slightly larger font for better hierarchy
    marginBottom: 10,
    fontFamily: 'Manrope-Bold',
    color: '#1E1E1E',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'Manrope-Regular',
  },
});

export default styles;
