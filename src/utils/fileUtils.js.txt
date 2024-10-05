import * as FileSystem from 'expo-file-system';

export const parseFile = async (uri) => {
  // Здесь должна быть логика парсинга различных форматов файлов
  // Для простоты, сейчас мы просто читаем содержимое файла
  return await FileSystem.readAsStringAsync(uri);
};

export const getFileContent = async (uri) => {
  try {
    const content = await FileSystem.readAsStringAsync(uri);
    return content;
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    return '';
  }
};