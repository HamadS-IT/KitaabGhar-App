/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import RNFS from 'react-native-fs';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import styles from '../styles/HomeScreenStyles';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const handleDeleteBook = async (item, setOfflineBooks) => {

  Alert.alert(
    'Delete Book',
    'Are you sure you want to delete this book?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: async () => {
        try {
            // Update database to remove the book from downloadedBooks
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
              `/books/downloaded/delete/${item.bookId}`,
              {},  // No body needed, but an empty object is required
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Get response message from API
            const apiMessage = response.data?.message;

            await RNFS.unlink(item.filePath);
            await RNFS.unlink(item.coverPath);
            Alert.alert('Success', apiMessage);
            setOfflineBooks((prevBooks) => prevBooks.filter((book) => book.filePath !== item.filePath));
        } catch (error) {
          let errorMessage = 'Failed to delete the book.';

          // Extract error response from API
          if (error.response) {
              errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
          } else if (error.message) {
              errorMessage = error.message;
          }

          Alert.alert('Error', errorMessage);
          console.error('Error deleting book:', error);
        }
        }, style: 'destructive' },
    ]
  );
};

const OfflineScreen = () => {
  const navigation = useNavigation();
  const [offlineBooks, setOfflineBooks] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const listDownloadedBooks = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) { setLoggedIn(true); }

        const hiddenFolderPath = `${RNFS.DocumentDirectoryPath}/.ebooks`;

        // Ensure the folder exists
        const folderExists = await RNFS.exists(hiddenFolderPath);
        if (!folderExists) {
            console.log('⚠️ No hidden folder found.');
            return [];
        }

        // Read files from hidden directory
        const files = await RNFS.readDir(hiddenFolderPath);

        // Current date for expiry check
        const today = new Date();

        const books = files
            .filter(file => file.name.endsWith('.pdf')) // Only process PDF files
            .map(file => {
                const bookFileName = file.name.replace('.pdf', '');
                const coverFile = `${hiddenFolderPath}/${bookFileName}.jpg`;

                // Validate file name format
                const nameParts = bookFileName.split('____');
                if (nameParts.length !== 4) {
                    console.warn(`⚠️ Skipping file with invalid format: ${file.name}`);
                    return null;
                }

                // Extract book details
                const [bookId, bookName, authorName, expiryDateStr] = nameParts;

                // Convert expiry date format (replace "99999" with "-")
                const formattedExpiryDateStr = expiryDateStr.replace(/99999/g, '-');

                // Parse expiry date
                const expiryDate = new Date(formattedExpiryDateStr);

                // Check if book is expired
                if (expiryDate < today) {
                    console.log(`📅 Book expired: ${bookName} (Expired on: ${formattedExpiryDateStr})`);
                    return null;
                }

                return {
                    bookName: bookName,
                    bookId: bookId,
                    authorName: authorName,
                    filePath: file.path,
                    coverPath: coverFile,
                    expiryDate: formattedExpiryDateStr,
                };
            })
            .filter(book => book !== null); // Remove null values (invalid or expired books)

        return books;
    } catch (error) {
        console.error('❌ Error listing downloaded books:', error.message);
        return [];
    }
  };


  const fetchOfflineBooks = async () => {
      const books = await listDownloadedBooks();
      setOfflineBooks(books);
  };

  // Call `fetchOfflineBooks` when opening offline mode
  useEffect(() => {
      fetchOfflineBooks();
  }, []);

  const renderBook = ({ item }) => (
    <>
    <View style={styles.headerBookOffline}>
            <Text style={styles.headerBookText}>Book </Text>
            {loggedIn && (
      <TouchableOpacity onPress={() => handleDeleteBook(item, setOfflineBooks)} style={styles.deleteIcon}>
        <Icon name="close" size={24} color="#FFF" />
      </TouchableOpacity>
      )}
    </View>
    <TouchableOpacity
      style={styles.bookContainer}
      onPress={() => navigation.navigate('offlinePDFViewer', { item })}
    >
      <Image source={{ uri: `file://${item.coverPath}` }} style={styles.bookCover} />
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.bookName ? item.bookName.replace('pdf','').replace(/_/g,' ').replace(/00000/g,'(').replace(/11111/g,')') : ''}</Text>
        <Text style={styles.bookAuthor}>by {item.authorName ? item.authorName.replace('pdf','').replace(/_/g,' ').replace(/00000/g,'(').replace(/11111/g,')') : ''}</Text>
        <Text style={styles.bookExpiry}>Expires on: {item.expiryDate ? item.expiryDate.replace('pdf','').replace(/99999/g,'-') : 'N/A'}</Text>

      </View>
    </TouchableOpacity>
    </>
  );

  return (<>
  <View style={styles.headerOffline}>
            <Text style={styles.headerText}> Downloaded Books </Text>
  </View>

    <View style={styles.container}>
      {offlineBooks.length > 0 ?
      <FlatList
        data={offlineBooks}
        keyExtractor={(item) => item.bookName}
        renderItem={renderBook}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
      /> : (<Text style={styles.noBooksText}>No books downloaded yet.</Text>)}
    </View>
    </>);
};

export default OfflineScreen;
