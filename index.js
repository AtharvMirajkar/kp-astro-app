/**
 * @format
 * Must be first for react-native-gesture-handler
 */
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundHandler } from './src/services/notificationService';

// Register FCM background/quit state handler
registerBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);