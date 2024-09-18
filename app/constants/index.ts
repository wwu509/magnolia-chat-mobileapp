import ArrowLeftSvg from '@/assets/svgs/arrow-left-svg';
import ArrowRightSvg from '@/assets/svgs/arrow-right-svg';
import SMSSvg from '@/assets/svgs/sms-svg';

export const ArrowIconDirections = {
  ArrowRight: ArrowRightSvg,
  ArrowLeft: ArrowLeftSvg,
};

export const LOGIN_TYPES = {
  FORGOT_PASSWORD_EMAIL_OTP: 'forgot_password_email_otp',
  LOGIN_MOBILE_OTP: 'login_mobile_otp',
};

export const verificationMethods = [
  {
    type: 'email',
    icon: SMSSvg,
    value: '***dos01@gmail.com',
    selected: false,
  },
];
