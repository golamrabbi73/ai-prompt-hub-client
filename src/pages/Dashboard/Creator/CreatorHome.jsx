import { useQuery } from "@tanstack/react-query";
import {
  FiFileText, FiCheckCircle, FiCopy, FiStar, FiBookmark,
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import StatCard from "../../../components/dashboard/StatCard";

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
    <div>
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Creator Dashboard
      </h1>
      <p className="mt-1 text-sm text-base-content/50">
        Overview of your prompt performance
      </p>

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
          label="Total Saves"
          value={stats?.totalBookmarks}
          icon={FiBookmark}
        />
        <StatCard
          label="Avg Rating"
          value={stats?.avgRating ? stats.avgRating.toFixed(1) : "—"}
          icon={FiStar}
        />
      </div>

      {/* Charts */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Total Copies per Prompt */}
        <div className="border border-base-300 bg-base-200 p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-base-content/50">
            Copies per Prompt
          </h2>
          {stats?.copiesData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220} className="mt-4">
              <BarChart data={stats.copiesData}>
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="copies" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="mt-6 text-center text-sm text-base-content/30">
              No approved prompts yet
            </p>
          )}
        </div>

        {/* Prompt Growth */}
        <div className="border border-base-300 bg-base-200 p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-base-content/50">
            Prompt Growth
          </h2>
          {stats?.promptGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220} className="mt-4">
              <LineChart data={stats.promptGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="mt-6 text-center text-sm text-base-content/30">
              No data yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorHome;