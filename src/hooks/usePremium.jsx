import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const usePremium = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isPremium = false, isLoading } = useQuery({
    queryKey: ["isPremium", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data?.subscription === "premium";
    },
    enabled: !authLoading && !!user?.email,
  });

  return { isPremium, isLoading: authLoading || isLoading };
};

export default usePremium;