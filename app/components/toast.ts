import Toast from "react-native-root-toast";

type ToastOptions = {
    duration?: number;
    position?: number;
    animation?: boolean;
    hideOnPress?: boolean;
    delay?: number;
    backgroundColor?: string;
    opacity?: number;
    containerStyle?: object;
}

const showToast = (message: string, options: ToastOptions = {}): void => {
    const toast = Toast.show(message, {
        duration: Toast.durations.LONG,
        position: 100,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#60A5FA",
        opacity: 1,
        containerStyle: { padding: 10 },
        ...options,
    });
    setTimeout(() => {
        Toast.hide(toast);
    }, 1500);
};

export default showToast;
