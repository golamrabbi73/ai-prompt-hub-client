import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

const usePremium = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: isPremium = false, isLoading } = useQuery({
    queryKey: ["isPremium", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`
      );
      return res.data?.subscription === "premium";
    },
    enabled: !authLoading && !!user?.email,
  });

  return { isPremium, isLoading: authLoading || isLoading };
};

export default usePremium;