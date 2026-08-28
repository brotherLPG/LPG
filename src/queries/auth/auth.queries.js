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
      // Store token
      if (data?.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // Store user if required
      if (data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Clear old cache
      queryClient.clear();
    },
  });
};