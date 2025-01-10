import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';

const appList = async () => {
  try {
    // Fetch the list of installed apps
    const apps = await InstalledApps.getSortedApps();
    return apps;
  } catch (error) {
    console.error('Error fetching app list:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

const openApp = async (packageName: string) => {
  try {
    // Check if the package is installed
    const isInstalled = await RNLauncherKitHelper.checkIfPackageInstalled(packageName);
    if (isInstalled) {
      // Launch the app
      RNLauncherKitHelper.launchApplication(packageName);
    } else {
      console.error(`App with package name ${packageName} is not installed.`);
    }
  } catch (error) {
    console.error('Error opening app:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export { appList, openApp };
