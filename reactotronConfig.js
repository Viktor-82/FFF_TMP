// import Reactotron from 'reactotron-react-native';
// import { reactotronRedux } from 'reactotron-redux';
//
// // const reactotron = Reactotron.configure({ name: 'FarmFresh App' }) // Имя приложения
// const reactotron = Reactotron.configure({
//     name: 'FarmFresh App',
//     host: '10.0.2.2'  // Либо твой локальный IP
// })
//     .useReactNative()
//     .use(reactotronRedux())
//     .connect();
//
// console.tron = reactotron; // Добавляем глобальный console.tron для логов
//
// export default reactotron;
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

// Настройка Reactotron
Reactotron
    .configure() // Настройки по умолчанию (можно указать host, если нужно)
    .useReactNative() // Подключение React Native плагинов
    .use(reactotronRedux()) // Подключение Redux плагина
    .connect(); // Подключение к приложению

export default Reactotron;