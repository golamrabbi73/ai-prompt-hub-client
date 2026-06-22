import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`
      );
      return res.data?.role || "User";
    },
    enabled: !authLoading && !!user?.email,
  });

  return { role, roleLoading: authLoading || roleLoading };
};

export default useUserRole;