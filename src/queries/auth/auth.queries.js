import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { loginUser } from "../../api/auth.api";


export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      // Store access token
      if (data?.data?.accessToken) {
        localStorage.setItem(
          "token",
          data.data.accessToken
        );
      }

      // Store refresh token
      if (data?.data?.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          data.data.refreshToken
        );
      }

      // Store user data
      if (data?.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );
      }

      // Clear old cache
      queryClient.clear();
    },
  });
};