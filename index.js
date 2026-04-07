/**
 * @format
 * Must be first for react-native-gesture-handler
 */
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import notifee, { EventType } from '@notifee/react-native';
import { navigateFromNotification } from './src/hooks/useNotifications';

// Import navigation ref from notifeeService
import {
  setNavigationRef,
  _navigationRef,
} from './src/services/notifeeService';

// 1. Notifee Background PRESS Handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const screen = detail.notification?.data?.screen;
    console.log('[Notifee Background PRESS] screen received:', screen);

    if (!screen) {
      console.warn('[Notifee] No screen in notification data');
      return;
    }

    if (!_navigationRef) {
      console.warn('[Notifee] _navigationRef is null');
      return;
    }

    if (!_navigationRef.isReady()) {
      console.warn('[Notifee] Navigation ref is NOT ready');
      return;
    }

    console.log(
      '[Notifee] Calling navigateFromNotification with screen:',
      screen,
    );
    navigateFromNotification(screen, _navigationRef);
  }
});

// 2. FCM Background Message Handler (for displaying incoming notifications)
import { registerBackgroundHandler } from './src/services/notificationService';
registerBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
