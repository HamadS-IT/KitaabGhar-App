import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** Main Container */
  container: {
    flex: 1,
    backgroundColor: '#FFFF', // Softer background to complement #5BA191
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerOffline: {
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
headerBookOffline: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:'space-between',
  borderWidth:2,
  borderColor:'#5BA191',
  borderRadius:20,
  width:'60%',
  height:35,
  backgroundColor: '#5BA191',
  borderBottomWidth: 1,

},
headerBookText: {
  color:'#FFF',
  fontFamily: 'Manrope-Regular',
  fontSize:16,
  paddingLeft:20,
},

  /** Header Section */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#5BA191',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18, // Enhanced font size for visibility
    color: '#1E1E1E',
    fontFamily: 'Manrope-Bold',
  },
  greetingW: {
    fontSize: 22, // Enhanced font size for visibility
    // fontWeight: 'bold',
    color: '#5BA191',
    fontFamily: 'Manrope-ExtraBold',
    marginTop:'-8',
  },

  /** Search Bar */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#5BA191', // Muted border to match the theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#5BA191',
    resizeMode: 'contain',
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Manrope-Regular',
    color: '#1E1E1E',
    paddingVertical: 0,
  },

  /** My Books Section */
  myBooksSection: {
    marginBottom: 20,
  },
  myBooksTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  horizontalScroll: {
    marginBottom: 20,
    minHeight:20,
    height:500,
  },
  myBookContainer: {
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    height:200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderColor: '#5BA191',
    borderWidth: 2,
    ...shadowStyles,
  },
  myBookCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  myBookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  myBookAuthor: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  bookExpiry: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
    fontFamily: 'Manrope-Regular',
  },

  /** Trending Books Section */
  sectionTitle: {
    fontSize: 22,
    marginBottom: 15,
    fontFamily: 'Manrope-Bold',
    color: '#5BA191',
  },

  /** Book Container */
  bookContainer: {

    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    borderColor: '#5BA191',
    borderWidth: 2,
    ...shadowStyles,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    margin: 10,
  },
  bookDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#1E1E1E',
    marginBottom: 3,
  },
  bookAuthor: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#1E1E1E',
  },

  /** No Books Text */
  noBooksText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
    color: '#1E1E1E',
  },

  /** Books List */
  booksList: {
    paddingBottom: 20,
  },

  /** Loading Styles */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#5BA191',
  },
  deleteIcon:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight:10,

  },
  Menu:{
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     backgroundColor: '#FFF',
     justifyContent: 'center',
     alignItems: 'center',
     zIndex:100,
    },
  MenuButton:{
    backgroundColor:'#5BA191',
    width:250,
    height:70,
    marginBottom:20,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
  },
  MenuButtonText:{
    fontSize:20,
    fontFamily: 'Manrope-Regular',
    color:'#FFF',
  },
});

/** Shared Shadow Styles */
const shadowStyles = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 3,
};

export default styles;
