import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  cityName: string;
}

const WeatherScreen: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY; // Replace with actual API key
  
  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod === '404') {
        Alert.alert('Error', 'City not found');
        return;
      }

      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        cityName: data.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={fetchWeather}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityText}>{weather.cityName}</Text>
          <Text style={styles.tempText}>{weather.temp}°C</Text>
          <Text style={styles.descText}>{weather.description}</Text>
          <Text style={styles.humidityText}>Humidity: {weather.humidity}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tempText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  descText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
  humidityText: {
    fontSize: 16,
    color: '#666',
  },
});

export default WeatherScreen;