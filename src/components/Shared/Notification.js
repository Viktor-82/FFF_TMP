import Toast from 'react-native-toast-message';

export const showToast = (message, type = 'error') => {
    Toast.show({
        type: type, // 'success', 'error', 'info'
        text1: message, // Основной текст уведомления
        position: 'top', // Позиция уведомления (top, bottom)
        visibilityTime: 4000, // Время отображения (в миллисекундах)
        autoHide: true, // Автоматическое скрытие
        topOffset: 50, // Отступ сверху (для позиции 'top')
    });
};