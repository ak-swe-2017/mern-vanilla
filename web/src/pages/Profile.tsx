import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiFetch } from "../api";
import { useAuth } from "../auth";

type Me = {
  data: {
    email: string;
    name?: string;
    phone?: string;
    role: "user" | "admin";
  };
};

const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  phone: z
    .string()
    .min(7, "Phone too short")
    .max(20, "Too long")
    .optional()
    .or(z.literal(""))
    .optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passSchema = z.object({
  currentPassword: z.string().min(8, "Min 8 chars"),
  newPassword: z.string().min(8, "Min 8 chars"),
});
type PassForm = z.infer<typeof passSchema>;

export default function Profile() {
  const { fetchMe } = useAuth();
  const [me, setMe] = useState<Me["data"] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [perr, setPerr] = useState<string | null>(null);

  const pf = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });
  const cf = useForm<PassForm>({ resolver: zodResolver(passSchema) });

  async function load() {
    const r = await apiFetch<Me>("/account/me");
    setMe(r.data);
    pf.reset({ name: r.data.name ?? "", phone: r.data.phone ?? "" });
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile(v: ProfileForm) {
    setMsg(null);
    await apiFetch("/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setMsg("Profile updated");
    await fetchMe(); // refresh context
    await load(); // refresh local
  }

  async function changePassword(v: PassForm) {
    setPerr(null);
    const res = await fetch("http://localhost:4000/account/password", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    if (res.status === 204) {
      setMsg(
        "Password changed (you will be asked to login again when refresh rotates).",
      );
      cf.reset();
    } else {
      const body = await res.json().catch(() => ({}));
      setPerr(body?.error ?? "Failed to change password");
    }
  }

  return (
    <div className="space-y-8">
      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Profile</h2>
        {me && (
          <p className="text-sm text-gray-500 mt-1">
            Signed in as <b>{me.email}</b>
          </p>
        )}
        {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}

        <form
          onSubmit={pf.handleSubmit(saveProfile)}
          className="mt-6 grid gap-4 max-w-lg"
        >
          <div>
            <label className="label">Full name</label>
            <input className="input" {...pf.register("name")} />
            {pf.formState.errors.name && (
              <div className="help">{pf.formState.errors.name.message}</div>
            )}
          </div>

          <div>
            <label className="label">Phone</label>
            <input className="input" {...pf.register("phone")} />
            {pf.formState.errors.phone && (
              <div className="help">{pf.formState.errors.phone.message}</div>
            )}
          </div>

          <button
            className="btn btn-primary w-fit"
            disabled={pf.formState.isSubmitting}
          >
            {pf.formState.isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>

      <section className="card p-6 sm:p-8 max-w-lg">
        <h3 className="text-lg font-semibold">Change password</h3>
        {perr && <div className="mt-2 text-sm text-red-600">{perr}</div>}
        <form
          onSubmit={cf.handleSubmit(changePassword)}
          className="mt-4 grid gap-4"
        >
          <div>
            <label className="label">Current password</label>
            <input
              type="password"
              className="input"
              {...cf.register("currentPassword")}
            />
            {cf.formState.errors.currentPassword && (
              <div className="help">
                {cf.formState.errors.currentPassword.message}
              </div>
            )}
          </div>
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              className="input"
              {...cf.register("newPassword")}
            />
            {cf.formState.errors.newPassword && (
              <div className="help">
                {cf.formState.errors.newPassword.message}
              </div>
            )}
          </div>
          <button
            className="btn btn-outline w-fit"
            disabled={cf.formState.isSubmitting}
          >
            {cf.formState.isSubmitting ? "Updating…" : "Update password"}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-3">
          Note: we bump <code>tokenVersion</code> on change to revoke all
          existing refresh tokens.
        </p>
      </section>
    </div>
  );
}
