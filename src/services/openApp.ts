import { Linking, Alert } from 'react-native';

const appUrlSchemes: { [key: string]: string } = {
  "WhatsApp": "whatsapp://",
  "Facebook": "fb://",
  "Instagram": "instagram://",
  "Twitter": "twitter://",
  "LinkedIn": "linkedin://",
  "YouTube": "youtube://",
  "Gmail": "googlegmail://",
  "Google Maps": "comgooglemaps://",
  "Spotify": "spotify://",
  "Snapchat": "snapchat://",
  "Pinterest": "pinterest://",
  "Reddit": "reddit://",
  "Skype": "skype://",
  "Telegram": "tg://",
  "Viber": "viber://",
  "Uber": "uber://",
  "Lyft": "lyft://",
  "Zoom": "zoomus://",
  "Slack": "slack://",
  "Medium": "medium://",
  "PayPal": "paypal://",
  "Venmo": "venmo://",
  "Amazon": "amazon://",
  "eBay": "ebay://",
  "Yelp": "yelp://",
  "TikTok": "snssdk1128://",
  "Netflix": "nflx://",
  "Dropbox": "dbapi-1://",
  "Google Drive": "googledrive://",
  "OneDrive": "ms-onedrive://",
  "Evernote": "evernote://",
  "Microsoft Teams": "msteams://"
};

const openApp = async (appName: string) => {
  const url = appUrlSchemes[appName];

  if (url) {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`App not installed`, `The app ${appName} doesn't seem to be installed on your device.`);
    }
  } else {
    Alert.alert(`App not supported`, `The app ${appName} is not in the supported list.`);
  }
};

export default openApp;