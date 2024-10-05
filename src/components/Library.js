import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/globalStyles';
import { parseFile } from '../utils/fileUtils';

const Library = ({ navigation }) => {
  const [books, setBooks] = useState([]);

  const loadBooks = useCallback(async () => {
    try {
      const savedBooks = await AsyncStorage.getItem('books');
      if (savedBooks !== null) {
        setBooks(JSON.parse(savedBooks));
      }
    } catch (error) {
      console.error('Ошибка при загрузке книг:', error);
    }
  }, []);

  React.useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleFileUpload = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/epub+zip', 'text/plain', 'application/x-fictionbook+xml'],
      });
      if (result.type === 'success') {
        const newBook = { id: Date.now(), name: result.name, uri: result.uri };
        const updatedBooks = [...books, newBook];
        setBooks(updatedBooks);
        await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
        await parseFile(result.uri);
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  }, [books]);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Читалка', { book: item })}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  ), [navigation]);

  const memoizedBookList = useMemo(() => (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderBookItem}
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      windowSize={21}
    />
  ), [books, renderBookItem]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
        <Text>Загрузить книгу</Text>
      </TouchableOpacity>
      {memoizedBookList}
    </View>
  );
};

export default React.memo(Library);