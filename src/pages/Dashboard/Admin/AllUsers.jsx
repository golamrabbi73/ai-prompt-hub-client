import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiTrash2, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../../components/shared/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ROLES = ["User", "Creator", "Admin"];

const ROLE_COLOR = {
  Admin: "text-secondary border-secondary",
  Creator: "text-success border-success",
  User: "border-base-300 text-base-content/50",
};

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      return res.data;
    },
  });

  const handleRoleChange = async (email, newRole) => {
    try {
      await axiosSecure.patch(`/users/${email}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/users/${deleteTarget.email}`);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

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
        All Users
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Manage roles and remove users. Total: {users.length}
      </p>

      <div className="mt-6 overflow-x-auto border border-base-300">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-300 bg-base-200">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                User
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Email
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Role
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Joined
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-base-content/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-base-300 last:border-0 hover:bg-base-200/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        u.photoURL ||
                        "https://i.ibb.co/2kR4R7g/default-avatar.png"
                      }
                      alt={u.displayName}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-base-content">
                      {u.displayName || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-base-content/60">
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <div className="relative inline-block">
                    <select
                      value={u.role || "User"}
                      onChange={(e) => handleRoleChange(u.email, e.target.value)}
                      className={`cursor-pointer appearance-none border bg-transparent py-1 pl-2 pr-6 font-mono text-[10px] uppercase tracking-wider outline-none ${
                        ROLE_COLOR[u.role] || ROLE_COLOR["User"]
                      }`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="text-base-content">
                          {r}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      size={11}
                      className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-base-content/40"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-base-content/40">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      setDeleteTarget({ email: u.email, name: u.displayName })
                    }
                    className="text-base-content/40 hover:text-accent"
                    title="Delete user"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          heading="Delete User"
          itemLabel="user"
          title={deleteTarget.name || deleteTarget.email}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AllUsers;