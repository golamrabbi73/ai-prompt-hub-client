import { useQuery } from "@tanstack/react-query";
import { FiFileText, FiCheckCircle, FiCopy, FiStar } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import StatCard from "../../../components/dashboard/StatCard";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CreatorHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["creatorStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/creator/stats/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Creator Dashboard
      </h1>
      <p className="mt-1 text-sm text-base-content/50">
        Overview of your prompt performance
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Prompts"
          value={stats?.totalPrompts}
          icon={FiFileText}
        />
        <StatCard
          label="Approved"
          value={stats?.approvedPrompts}
          icon={FiCheckCircle}
          accent
        />
        <StatCard
          label="Total Copies"
          value={stats?.totalCopies}
          icon={FiCopy}
        />
        <StatCard
          label="Avg Rating"
          value={stats?.avgRating ? stats.avgRating.toFixed(1) : "—"}
          icon={FiStar}
        />
      </div>
    </div>
  );
};

export default CreatorHome;