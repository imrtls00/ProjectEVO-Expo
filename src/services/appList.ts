import { InstalledApps } from 'react-native-launcher-kit';

const appList = async () => {
  try {
    // Fetch the list of installed apps
    const apps = await InstalledApps.getSortedApps();
    console.log(apps);
    return apps;
  } catch (error) {
    console.error('Error fetching app list:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export default appList;
