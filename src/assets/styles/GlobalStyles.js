import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
    text: {
        fontFamily: 'OpenSans-Regular', // Шрифт для текста
        color: '#333',
        letterSpacing: 0.5,
    },
    heading: {
        fontFamily: 'Pacifico-Regular', // Шрифт для заголовков
        fontSize: 24,
        color: '#333',
        letterSpacing: 0.5,
    },
    button: {
        fontFamily: 'OpenSans-Regular', // Шрифт для кнопок
        letterSpacing: 0.5,
        color: '#333',
    },
    container: {
        flex: 1,
        backgroundColor: '#FDFDFD', // Фон приложения
    },
});

export default GlobalStyles;
