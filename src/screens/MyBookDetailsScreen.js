import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles/MyBookDetailStyle';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For modern and attractive icons

const MyBookDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { book } = route.params;

  console.log(book);

  return (
  <>
    <View style={styles.header}>
        <Text style={styles.headerText}> My Book Detail </Text>
    </View>
    <ScrollView contentContainerStyle={styles.container}>

      {/* Book Cover */}
      <Image
        source={{ uri: book.coverUrl }}
        style={styles.bookCover}
        resizeMode="cover"
      />

      {/* Book Title & Author */}
      <Text style={styles.bookTitle}>{book.title || 'Book Title'}</Text>
      <Text style={styles.bookAuthor}>{book.author || 'Author Name'}</Text>

      {/* Book Language */}
      <View style={styles.infoRow}>
        <Icon name="language-outline" size={20} color="#5BA191" />
        <Text style={styles.bookLanguage}>
          {book.language ? `Language: ${book.language}` : 'Language: Unknown'}
        </Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {book.description ||
            'An exciting journey awaits in this book, packed with insights and interesting stories.'}
        </Text>
      </View>

      {/* Let's Read Button */}
      <TouchableOpacity
        style={styles.readButton}
        onPress={() => navigation.navigate('pdfViewer', { book })}
      >
        <Text style={styles.readButtonText}>Let's Read</Text>
      </TouchableOpacity>
    </ScrollView>
    </>);
};

export default MyBookDetailScreen;
