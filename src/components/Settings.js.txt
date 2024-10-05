import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Slider, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/globalStyles';

const Settings = () => {
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
    loadSettings();
  }, []);

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

  const saveSettings = useCallback(async (newSettings) => {
    try {
      await AsyncStorage.setItem('readerSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
    }
  }, []);

  const handleSettingChange = useCallback((key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  return (
    <View style={styles.container}>
      <Text>Размер шрифта: {settings.fontSize}</Text>
      <Slider
        value={settings.fontSize}
        onValueChange={(value) => handleSettingChange('fontSize', value)}
        minimumValue={12}
        maximumValue={24}
        step={1}
      />

      <Text>Шрифт:</Text>
      <Picker
        selectedValue={settings.fontFamily}
        onValueChange={(value) => handleSettingChange('fontFamily', value)}
      >
        <Picker.Item label="Arial" value="Arial" />
        <Picker.Item label="Times New Roman" value="Times New Roman" />
        <Picker.Item label="Courier" value="Courier" />
      </Picker>

      <Text>Цвет фона:</Text>
      <Picker
        selectedValue={settings.backgroundColor}
        onValueChange={(value) => handleSettingChange('backgroundColor', value)}
      >
        <Picker.Item label="Белый" value="#FFFFFF" />
        <Picker.Item label="Кремовый" value="#FFF5E1" />
        <Picker.Item label="Серый" value="#E0E0E0" />
      </Picker>

      <View style={styles.switchContainer}>
        <Text>Ночной режим:</Text>
        <Switch
          value={settings.nightMode}
          onValueChange={(value) => handleSettingChange('nightMode', value)}
        />
      </View>

      <Text>Скорость чтения: {settings.ttsSpeed.toFixed(1)}x</Text>
      <Slider
        value={settings.ttsSpeed}
        onValueChange={(value) => handleSettingChange('ttsSpeed', value)}
        minimumValue={0.5}
        maximumValue={2}
        step={0.1}
      />

      <Text>Высота голоса: {settings.ttsPitch.toFixed(1)}</Text>
      <Slider
        value={settings.ttsPitch}
        onValueChange={(value) => handleSettingChange('ttsPitch', value)}
        minimumValue={0.5}
        maximumValue={2}
        step={0.1}
      />

      <Text>Акцент:</Text>
      <Picker
        selectedValue={settings.ttsAccent}
        onValueChange={(value) => handleSettingChange('ttsAccent', value)}
      >
        <Picker.Item label="Английский (США)" value="en-US" />
        <Picker.Item label="Английский (Великобритания)" value="en-GB" />
        <Picker.Item label="Русский" value="ru-RU" />
      </Picker>
    </View>
  );
};

export default React.memo(Settings);