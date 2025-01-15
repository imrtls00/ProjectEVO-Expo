import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';

interface App {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  firstInstallTime: number;
  lastUpdateTime: number;
  icon: string;
}

const appList = async (): Promise<App[]> => {
  try {
    // Fetch the list of installed apps
    const apps: App[] = await InstalledApps.getSortedApps();
    return apps;
  } catch (error) {
    console.error('Error fetching app list:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

const openApp = async (packageName: string): Promise<void> => {
  try {
    // Check if the package is installed
    const isInstalled: boolean = await RNLauncherKitHelper.checkIfPackageInstalled(packageName);
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
