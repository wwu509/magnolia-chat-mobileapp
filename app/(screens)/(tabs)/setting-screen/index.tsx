import {Alert, Pressable, Switch} from 'react-native';
import React from 'react';
import {useTheme} from '@/app/components/theme-context';
import styles from '@/app/styles/setting-style';
import CustomText from '@/app/components/custom-text';
import {TEST_IDS} from '@/app/constants/test-ids/setting-screen';
import {navigateTo} from '@/app/helper/navigation';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import {APIAxiosError, LOGIN_TYPES} from '@/app/constants';
import BackButtonWithTitle from '@/app/components/header/back-button';
import showToast from '@/app/components/toast';
import {translate} from '@/app/utils/i18n';
import axiosConfig from '@/app/helper/axios-config';
import {AUTH_API} from '@/app/constants/api-routes';
import {logoutUser} from '@/app/utils/helper-functions';
import {muteUserNotifications, RootState} from '@/app/store/global-slice';

type MuteNotificationProps = {
  isNotificationEnabled: boolean;
};

type MuteNotificationResponse = {
  message: string;
};

const Setting: React.FC = () => {
  const {activeTheme} = useTheme();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {user} = useSelector((state: RootState) => state.global);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          await logoutUser(dispatch, () => {
            queryClient.removeQueries();
          });
        },
      },
    ]);
  };

  const handleChangePassword = () => {
    navigateTo(NAVIGATION_ROUTES.RESET_PASSWORD, {
      type: LOGIN_TYPES.LOGIN_MOBILE_OTP,
    });
  };

  const toggleSwitch = () => {
    dispatch(muteUserNotifications(!user?.muteNotifications));
    onSubmit({isNotificationEnabled: !user?.muteNotifications});
  };

  const notificationSettings = async ({
    isNotificationEnabled,
  }: MuteNotificationProps): Promise<MuteNotificationResponse> => {
    const {data} = await axiosConfig.put<MuteNotificationResponse>(
      AUTH_API.MUTE_NOTIFICATION,
      {muteNotifications: isNotificationEnabled},
    );

    return data;
  };

  const MuteNotificationMutation: UseMutationResult<
    MuteNotificationResponse,
    unknown,
    MuteNotificationProps
  > = useMutation({
    mutationFn: notificationSettings,
    onSuccess: (
      data: MuteNotificationResponse,
      {isNotificationEnabled}: MuteNotificationProps,
    ) => {
      showToast(
        translate(
          isNotificationEnabled
            ? 'mute_notification_success'
            : 'unmute_notification_success',
        ),
      );
    },
    onError: (error: APIAxiosError) => {
      showToast(
        error?.response?.data?.message || translate('something_went_wrong'),
      );
    },
  });

  const onSubmit = (formData: MuteNotificationProps) => {
    MuteNotificationMutation.mutate(formData);
  };

  return (
    <SafeAreaView className={`${styles.container} ${activeTheme.background}`}>
      <BackButtonWithTitle title="Settings" />
      <Pressable
        onPress={handleChangePassword}
        className="w-[90%] border-b border-gray-300 py-4 mx-auto">
        <CustomText
          title="change_password"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
      </Pressable>
      <Pressable
        onPress={handleChangePassword}
        className="w-[90%] flex-row justify-between border-b border-gray-300 py-4 mx-auto">
        <CustomText
          title="mute_notification"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
        <Switch
          trackColor={{
            false: activeTheme?.backgroundColor,
            true: activeTheme?.primaryColor,
          }}
          thumbColor={activeTheme?.backgroundColor}
          ios_backgroundColor={activeTheme?.checkboxUnchecked}
          onValueChange={toggleSwitch}
          value={user?.muteNotifications}
        />
      </Pressable>
      <Pressable
        className="w-[90%] border-b border-gray-300 py-4 mx-auto"
        onPress={handleLogout}>
        <CustomText
          title="logout"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default Setting;
