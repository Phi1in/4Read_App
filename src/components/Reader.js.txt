import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/globalStyles';
import { getFileContent } from '../utils/fileUtils';

const Reader = ({ route, navigation }) => {
  const { book } = route.params;
  const [content, setContent] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 16,
    fontFamily: 'Arial',
    backgroundColor: '#FFFFFF',
    nightMode: false,
    ttsSpeed: 1,
    ttsPitch: 1,
    ttsAccent: 'en-US',
  });

  useEffect(() => {
    loadContent();
    loadReadingPosition();
    loadSettings();
    return () => {
      if (isReading) {
        Speech.stop();
      }
    };
  }, [book]);

  const loadContent = useCallback(async () => {
    try {
      const fileContent = await getFileContent(book.uri);
      setContent(fileContent);
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
    }
  }, [book]);

  const loadReadingPosition = useCallback(async () => {
    try {
      const position = await AsyncStorage.getItem(`readingPosition_${book.id}`);
      if (position !== null) {
        setCurrentPosition(parseInt(position, 10));
      }
    } catch (error) {
      console.error('Ошибка при загрузке позиции чтения:', error);
    }
  }, [book]);

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('readerSettings');
      if (savedSettings !== null) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек:', error);
    }
  }, []);

  const saveReadingPosition = useCallback(async (position) => {
    try {
      await AsyncStorage.setItem(`readingPosition_${book.id}`, position.toString());
    } catch (error) {
      console.error('Ошибка при сохранении позиции чтения:', error);
    }
  }, [book]);

  const handleTextToSpeech = useCallback(async () => {
    if (isReading) {
      await Speech.stop();
      setIsReading(false);
    } else {
      setIsReading(true);
      await Speech.speak(content.substring(currentPosition), {
        rate: settings.ttsSpeed,
        pitch: settings.ttsPitch,
        language: settings.ttsAccent,
        onDone: () => setIsReading(false),
      });
    }
  }, [content, currentPosition, isReading, settings]);

  const handleScroll = useCallback((event) => {
    const position = event.nativeEvent.contentOffset.y;
    setCurrentPosition(position);
    saveReadingPosition(position);
  }, [saveReadingPosition]);

  return (
    <View style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <Text
          style={[
            styles.content,
            {
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              color: settings.nightMode ? '#FFFFFF' : '#000000',
            },
          ]}
        >
          {content}
        </Text>
      </ScrollView>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleTextToSpeech}>
          <Text>{isReading ? 'Пауза' : 'Читать вслух'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(Reader);