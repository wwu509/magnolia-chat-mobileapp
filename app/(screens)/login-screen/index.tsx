import React, { useCallback, useEffect } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Href, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Control } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginScreenStyles } from "@/app/styles/login-screen-style";
import CustomCheckbox from "@/app/components/custom-checkbox";
import CustomButton from "@/app/components/custom-button";
import CustomFormField from "@/app/components/custom-form-field";
import globalStyle from "@/app/styles/global-style";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  getConfidentialData,
  setConfidentialData,
} from "@/app/utils/secure-storage";
import { useTheme } from "@/app/components/theme-context";
import { navigateBack, navigateTo } from "@/app/helper/navigation";
import axiosConfig from "@/app/helper/axios-config";
import { setAccessToken } from "@/app/utils/access-token-data";
import { AUTH_API } from "@/app/constants/api-routes";
import { NAVIGATION_ROUTES } from "@/app/constants/navigation-routes";
import CustomText from "@/app/components/custom-text";
import Translate from "@/app/components/translate";
import i18n from "@/app/utils/i18n";
import { TEST_IDS } from "@/app/constants/test-ids/login-screen";
import { LOGIN_TYPES } from "@/app/constants";
import BackSvg from "@/assets/svgs/arrow-left-svg";
import EmailSvg from "@/assets/svgs/sms-svg";
import LockSvg from "@/assets/svgs/password-lock-svg";

type FormDataProps = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  id?: string;
  options?: {
    is2FAEnabled: boolean;
  };
  type?: string;
};

const schema = yup.object().shape({
  email: yup.string().email("invalid_email").required("email_required"),
  password: yup
    .string()
    .min(6, "password_min_length")
    .required("password_required"),
  rememberMe: yup.boolean(),
});

const Login: React.FC = () => {
  const { activeTheme } = useTheme();
  const ns = i18n.language;

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEmail = await getConfidentialData("email");
        const storedPassword = await getConfidentialData("password");
        const rememberMe = (await getConfidentialData("rememberMe")) === "true";

        if (rememberMe) {
          if (storedEmail) setValue("email", storedEmail);
          if (storedPassword) setValue("password", storedPassword);
          setValue("rememberMe", rememberMe);
        }
      } catch (error) {
        console.warn(JSON.stringify(error, null, 2));
      }
    };

    (async () => await loadStoredData())();
  }, [setValue]);

  const authenticateUser = useCallback(
    async ({ email, password }: FormDataProps): Promise<AuthResponse> => {
      const { data } = await axiosConfig.post<AuthResponse>(AUTH_API.LOGIN, {
        email,
        password,
      });
      return data;
    },
    []
  );

  const UserLogin: UseMutationResult<AuthResponse, unknown, FormDataProps> =
    useMutation({
      mutationFn: authenticateUser,
      onSuccess: async (data, formData) => {
        await loginSuccess(data, formData);
      },
      onError: (error) => {
        console.warn(JSON.stringify(error, null, 2));
      },
    });

  const onSubmit = useCallback(
    (formData: FormDataProps) => {
      UserLogin.mutate(formData);
    },
    [UserLogin]
  );

  return (
    <SafeAreaView className={loginScreenStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View className={globalStyle.responsiveStyle}>
        <CustomText
          title={"welcome_back"}
          classname={`${loginScreenStyles.title} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.WELCOME_BACK}
        />
        <CustomText
          title={"login_to_account"}
          classname={`${loginScreenStyles.description} ${activeTheme.label}`}
          testID={TEST_IDS.TEXT.LOGIN_TO_ACCOUNT}
        />
        <CustomFormField
          control={control as unknown as Control}
          name="email"
          label="email"
          placeholder="enter_your_email"
          inputMode="email"
          errors={errors}
          autoCapitalize="none"
          customIcon={EmailSvg}
          labelID={TEST_IDS.TEXT.ENTER_YOUR_EMAIL}
          errorID={TEST_IDS.ERROR.ENTER_YOUR_EMAIL}
          inputID={TEST_IDS.INPUT.ENTER_YOUR_EMAIL}
        />

        <CustomFormField
          control={control as unknown as Control}
          name="password"
          label="password"
          placeholder="enter_your_password"
          secureTextEntry
          errors={errors}
          autoCapitalize="none"
          customIcon={LockSvg}
          labelID={TEST_IDS.TEXT.ENTER_YOUR_PASSWORD}
          errorID={TEST_IDS.ERROR.ENTER_YOUR_PASSWORD}
          inputID={TEST_IDS.INPUT.ENTER_YOUR_PASSWORD}
        />
        <View className={"w-full flex-row justify-between items-center mt-5"}>
          <CustomCheckbox
            control={control as unknown as Control}
            name="rememberMe"
            label="remember_me"
            labelID={TEST_IDS.TEXT.REMEMBER_ME}
            errorID={TEST_IDS.ERROR.REMEMBER_ME}
          />
          <View className={loginScreenStyles.forgotPassword}>
            <Link
              testID={TEST_IDS.TEXT.FORGOT_PASSWORD}
              accessibilityLabel={TEST_IDS.TEXT.FORGOT_PASSWORD}
              href={
                NAVIGATION_ROUTES.FORGOT_PASSWORD_OPTIONS as Href<
                  string | object
                >
              }
              className={`text-sm font-medium ${activeTheme.linkContainer}`}
            >
              <Translate value={"forgot_password"} ns={ns} />
            </Link>
          </View>
        </View>
        <CustomButton
          title={"login"}
          onPress={handleSubmit(onSubmit)}
          disabled={false}
          loading={UserLogin?.isPending}
          testID={TEST_IDS.BUTTON.LOGIN}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;

export const loginSuccess = async (
  data: AuthResponse,
  formData?: FormDataProps
) => {
  const tokenData = {
    access_token: data?.access_token,
    refresh_token: data?.refresh_token,
    userId: data?.id,
    is2FAEnabled: data?.options?.is2FAEnabled,
  };

  if (formData?.rememberMe) {
    await setConfidentialData("email", formData.email);
    await setConfidentialData("password", formData.password);
    await setConfidentialData("rememberMe", "true");
  } else {
    await setConfidentialData("email", "");
    await setConfidentialData("password", "");
    await setConfidentialData("rememberMe", "false");
  }

  if (data?.options?.is2FAEnabled) {
    navigateTo(NAVIGATION_ROUTES.OTP, {
      email: formData?.email || "",
      type: LOGIN_TYPES.LOGIN_MOBILE_OTP,
    });
  } else {
    await setAccessToken(tokenData);
    navigateTo(NAVIGATION_ROUTES.HOME);
  }
};
