import { useQuery } from "@tanstack/react-query";
import { FiDollarSign } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllPayments = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-base-content">
        All Payments
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Transaction history for all premium subscriptions.
      </p>

      {/* Summary card */}
      <div className="mt-6 inline-flex flex-wrap items-center gap-4 border border-base-300 bg-base-200 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center border border-secondary/30 bg-base-100 text-secondary">
          <FiDollarSign size={18} />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
            Total Revenue
          </p>
          <p className="font-display text-2xl font-semibold text-base-content">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="border-base-300 pl-8 md:ml-8 md:border-l">
          <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/40">
            Transactions
          </p>
          <p className="font-display text-2xl font-semibold text-base-content">
            {payments.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto border border-base-300">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-300 bg-base-200">
            <tr>
              {["Transaction ID", "User", "Amount", "Date", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-base-content/40"
                >
                  No payments yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-base-300 last:border-0 hover:bg-base-200/50"
                >
                  {/* Transaction ID */}
                  <td className="px-4 py-3 font-mono text-xs text-base-content/60">
                    {payment.transactionId || "—"}
                  </td>

                  {/* User */}
                  <td className="px-4 py-3 font-mono text-xs text-base-content/70">
                    {payment.email}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-success">
                    ${(payment.amount || 5).toFixed(2)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 font-mono text-xs text-base-content/50">
                    {new Date(
                      payment.date || payment.createdAt
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className="border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
                      Paid
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPayments;