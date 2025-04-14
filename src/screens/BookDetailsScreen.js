import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles/BookDetailStyle';

const BookDetailScreen = ({ route }) => {
  const { book } = route.params; // Extract book details passed from the previous screen

  return (
    <>
    <View style={styles.header}>
            <Text style={styles.headerText}> Book Detail </Text>
        </View>

    <ScrollView contentContainerStyle={styles.container}>

      {/* Book Cover */}
      <Image
        source={{ uri: book.coverUrl }} // Use dynamic cover URL
        style={styles.bookCover}
        resizeMode="cover"
      />

      {/* Book Title */}
      <Text style={styles.bookTitle}>{book.title || 'No Title Available'}</Text>

      {/* Book Author */}
      <Text style={styles.bookAuthor}>by {book.author || 'No Author Available'}</Text>

      {/* Book Language */}
      <Text style={styles.bookLanguage}>
        Language: {book.language || 'Unknown'}
      </Text>

      {/* Price Button */}
      {book.price && (
        <TouchableOpacity style={styles.purchaseButton}>
          <Text style={styles.buttonText}>Purchase | ${book.price}</Text>
        </TouchableOpacity>
      )}

      {/* Book Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Book Description</Text>
        <Text style={styles.description}>
          {book.description || 'No description available for this book.'}
        </Text>
      </View>
    </ScrollView>
    </>);
};

export default BookDetailScreen;
