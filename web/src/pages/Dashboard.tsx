import { useEffect } from "react";
import { useAuth } from "../auth";

export default function Dashboard() {
  const { user, fetchMe } = useAuth();
  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div className="space-y-8">
      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Welcome, {user?.name ?? user?.email}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here’s your account overview.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm text-gray-500">Role</div>
          <div className="text-2xl font-semibold mt-1">{user?.role}</div>
          <div className="text-xs text-gray-400 mt-1">Default access</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500">Email</div>
          <div className="text-2xl font-semibold mt-1 truncate">
            {user?.email}
          </div>
          <div className="text-xs text-gray-400 mt-1">Verified</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500">Status</div>
          <div className="text-2xl font-semibold mt-1">Active</div>
          <div className="text-xs text-gray-400 mt-1">Good standing</div>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="text-lg font-semibold">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="text-gray-500">Name</div>
          <div>{user?.name ?? "-"}</div>
          <div className="text-gray-500">Email</div>
          <div>{user?.email}</div>
          <div className="text-gray-500">Phone</div>
          <div>{user?.phone ?? "-"}</div>
        </div>
      </section>
    </div>
  );
}
