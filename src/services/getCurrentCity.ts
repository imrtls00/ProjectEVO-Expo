import * as Location from 'expo-location';

export async function getCurrentCity(): Promise<string> {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();
        return data.city || "Unknown city";
    } catch (error) {
        throw new Error(`Failed to fetch city data: ${error.message}`);
    }
}
