import { Alert } from 'react-native';

export const showAlertDialog = (title, message, buttonText, onPressAction) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: buttonText,
        onPress: onPressAction
      }
    ])
}