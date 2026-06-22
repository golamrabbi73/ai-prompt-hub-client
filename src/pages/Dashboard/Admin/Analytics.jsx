import { useQuery } from "@tanstack/react-query";
import {
  FiUsers, FiFileText, FiClock, FiAlertTriangle, FiDollarSign,
} from "react-icons/fi";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import StatCard from "../../../components/dashboard/StatCard";
import ChartCard from "../../../components/dashboard/ChartCard";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

const Analytics = () => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/analytics/admin`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  const categoryData = (data?.promptsByCategory || []).map((c) => ({
    name: c._id || "Uncategorized",
    count: c.count,
  }));

  const statusData = (data?.promptsByStatus || []).map((s) => ({
    name: s._id,
    value: s.count,
  }));

  const aiToolData = (data?.topAiTools || []).map((t) => ({
    name: t._id || "Unknown",
    count: t.count,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Analytics
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Site-wide stats and performance overview.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Users" value={data?.totalUsers} icon={FiUsers} />
        <StatCard label="Total Prompts" value={data?.totalPrompts} icon={FiFileText} />
        <StatCard label="Pending Prompts" value={data?.pendingPrompts} icon={FiClock} accent />
        <StatCard label="Pending Reports" value={data?.totalReports} icon={FiAlertTriangle} />
        <StatCard
          label="Revenue"
          value={`$${data?.totalRevenue || 0}`}
          icon={FiDollarSign}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Prompts by category */}
        <ChartCard title="Approved Prompts by Category">
          {categoryData.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/40">
              No data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Prompts by status */}
        <ChartCard title="Prompts by Status">
          {statusData.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/40">
              No data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Top AI tools */}
        <ChartCard title="Top AI Tools Used">
          {aiToolData.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/40">
              No data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={aiToolData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Revenue summary */}
        <ChartCard title="Revenue Summary">
          <div className="flex h-full flex-col items-center justify-center gap-2 py-8">
            <p className="font-display text-3xl font-semibold text-secondary">
              ${data?.totalRevenue || 0}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-base-content/40">
              from {data?.totalPayments || 0} payment
              {data?.totalPayments === 1 ? "" : "s"}
            </p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;