/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store'; // Убедитесь, что путь к store правильный
import App from './App'; // Главный компонент вашего приложения
import { name as appName } from './app.json'; // Имя приложения из app.json

const RNReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNReduxApp);
