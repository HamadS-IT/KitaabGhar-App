/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Image,
    ActivityIndicator,
    Switch,
    Modal,
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeScreenStyles';
import axios from '../api/axios';

const HomeScreen = () => {

    const navigation = useNavigation();

    const [username, setUsername] = useState('Guest');
    const [avatar, setAvatar] = useState(null);
    const [recentBooks, setRecentBooks] = useState([]);
    const [purchasedBooks, setPurchasedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(true);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPurchasedBooks, setFilteredPurchasedBooks] = useState([]);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const fetchBooks = async () => {
        try {
            const token      = await AsyncStorage.getItem('token');
            const name       = await AsyncStorage.getItem('name');
            const profilePic = await AsyncStorage.getItem('profilePic');


            if (!token) {
                Alert.alert('Session expired', 'Please log in again.');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
                return;
            }

            const recentResponse = await axios.get('/books/recent', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecentBooks(recentResponse.data.recentBooks);

            const purchasedResponse = await axios.get('/books/purchased', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPurchasedBooks(purchasedResponse.data.purchasedBooks);
            setFilteredPurchasedBooks(purchasedResponse.data.purchasedBooks);

            setLoading(false);
            setUsername(name);
            setAvatar(profilePic);
        } catch (error) {
            console.error('Error fetching books:', error.message);
            Alert.alert('Error', 'Failed to fetch books. Please try again.');
            setLoading(false);
        }
    };

    const handleLogout = async () => {
      Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          {
              text: 'Logout',
              onPress: async () => {
                try {
                  const token = await AsyncStorage.getItem('token');
                  // eslint-disable-next-line no-unused-vars
                  const response = await axios.get('/auth/logout', {
                      headers: { Authorization: `Bearer ${token}` },
                  });

                  console.log('🔒 Logging out...');
                  await AsyncStorage.clear();
                  await EncryptedStorage.clear();
                  setIsMenuVisible(false);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                  console.log('✅ Logout successful.');


              }catch (Error) {
                  console.error('Failed to logout:', Error.message);
                  }
              },
          },
      ]);
  };



    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (query) => {
      setSearchQuery(query);
      if (query.trim() === '') {
          setFilteredPurchasedBooks(purchasedBooks);
      } else {
          setFilteredPurchasedBooks(
              purchasedBooks.filter(book =>
                  book.title.toLowerCase().includes(query.toLowerCase())
              )
          );
      }
  };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5BA191" />
        </View>
      );
    }

    const navigateToMyBookDetail = (book) => {
      navigation.navigate('PurchasedBookDetails', { book });
    };

    const navigateToBookDetails = (book) => {
      navigation.navigate('BookDetails', { book });
    };

    const filteredBooks = recentBooks.filter(
      (book) => !purchasedBooks.some((userBook) => userBook._id === book._id)
    );

    const renderBook = ({ item }) => (
      <TouchableOpacity
        style={styles.bookContainer}
        onPress={() => navigateToBookDetails(item)}
      >
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} />
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>by {item.author}</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)} style={{flex: 1, alignItems: 'flex-end', margin: 10, zIndex:101 }}>
                  <Icon name={isMenuVisible ? 'close' : 'menu'}  size={24} color={'#5BA191'} />
          </TouchableOpacity>
        </View>
        {isMenuVisible && (
                <View style={styles.Menu}>
                  <TouchableOpacity onPress={() => {setIsMenuVisible(false);
                                                    navigation.navigate('Home');}} style={styles.MenuButton}>
                        <Text style={styles.MenuButtonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setIsMenuVisible(false);
                                                     navigation.navigate('Offline');}} style={styles.MenuButton}>
                        <Text style={styles.MenuButtonText}>Downloaded Books</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.MenuButton}>
                        <Text style={styles.MenuButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        {/* Header Section */}
        <View style={styles.header}>
          {avatar ? (
            <TouchableOpacity>
              <Image source={{ uri: avatar }} style={styles.profileImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Icon
                name="account-circle"
                size={40}
                color="#5BA191"
                style={styles.profileImage}
              />
            </TouchableOpacity>
          )}
          <View style={styles.greetingContainer}>
            {username.split(' ').length > 1 ?
            <Text style={styles.greeting}>Hi {username.split(' ')[0]} {username.split(' ')[1].split('')[0]}. ,</Text> :
            <Text style={styles.greeting}>Hi {username},</Text>}
            <Text style={styles.greetingW}>Welcome back</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={25} color="#5BA191" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search books..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* My Books Section */}
        <Text style={styles.sectionTitle}>My Books</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {filteredPurchasedBooks.length > 0 ? (
            filteredPurchasedBooks.map((book) => (
              <TouchableOpacity
                key={book._id}
                style={styles.myBookContainer}
                onPress={() => navigateToMyBookDetail(book)}
              >
                <Image source={{ uri: book.coverUrl }} style={styles.myBookCover} />
                {/* <Text style={styles.myBookTitle}>{book.title}</Text>
                <Text style={styles.myBookAuthor}>by {book.author}</Text> */}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noBooksText}>No books purchased yet</Text>
          )}
        </ScrollView>

        {/* Trending Books Section */}
        <Text style={styles.sectionTitle}>Trending Books</Text>
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item._id}
          renderItem={renderBook}
          contentContainerStyle={styles.booksList}
          showsVerticalScrollIndicator={false}
        />
          <Modal visible={isSettingsVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 250 }}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>Settings</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text>Offline Mode</Text>
                            <Switch value={isOffline} onValueChange={setIsOffline} />
                        </View>
                        <TouchableOpacity onPress={() => handleLogout()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Icon name="logout" size={20} color="red" style={{ marginRight: 10 }} />
                            <Text style={{ color: 'red' }}>Logout</Text>
                        </TouchableOpacity>
                        <Button title="Close" onPress={() => setIsSettingsVisible(false)} />
                    </View>
                </View>
            </Modal>
      </View>
    );
  };

export default HomeScreen;
