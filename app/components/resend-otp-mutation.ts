import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axiosConfig from '@/app/helper/axios-config';
import { AUTH_API } from '@/app/constants/api-routes';
import showToast from './toast';

type ResendOtpResponse = {
  message: string;
};

const useResendOtpMutation = (
  email: string,
  type: string,
): UseMutationResult<ResendOtpResponse, unknown, void> => {
  const resendOtp = async () => {
    const { data } = await axiosConfig.post(`${AUTH_API.OTP_RESEND}${type}`, {
      email,
    });
    return data;
  };

  return useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      showToast('otp_resent_success');
    },
    onError: error => {
      showToast('otp_resent_failure');
    },
  });
};

export default useResendOtpMutation;
