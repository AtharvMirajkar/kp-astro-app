/**
 * @format
 * Must be first for react-native-gesture-handler
 */
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundHandler } from './src/services/notificationService';
import { registerNotifeeBackgroundHandler } from './src/services/notifeeService';

// 1. Notifee background event handler (notification press / dismiss)
registerNotifeeBackgroundHandler();

// 2. FCM background message handler (receives message → displays via Notifee)
registerBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
