import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FDFD', // Softer background for better readability
    alignItems: 'center',
    padding: 20,
  },

  /** Header */
  // header: {
  //   width: '100%',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 20,
  // },
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

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#5BA191',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },

  /** Book Cover */
  bookCover: {
    width: width * 0.8, // 80% of screen width for full cover effect
    height: width * 1.2, // Maintain aspect ratio
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  /** Book Info */
  bookTitle: {
    fontSize: 26,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
    color: '#1E1E1E',
  },
  bookAuthor: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#5BA191',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  bookLanguage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginLeft: 8,
    fontFamily: 'Manrope-Regular',
  },

  /** Description Section */
  descriptionContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 10,
    fontFamily: 'Manrope-Bold',
    color: '#1E1E1E',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'Manrope-Regular',
  },

  /** Buttons */
  readButton: {
    marginTop: 30,
    paddingVertical: 16,
    paddingHorizontal: 50,
    backgroundColor: '#5BA191', // Updated color for better branding
    borderRadius: 30, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  readButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Manrope-Regular',
  },
});

export default styles;
