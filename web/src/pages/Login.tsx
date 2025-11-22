import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../auth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(v: FormData) {
    await login(v.email, v.password);
    nav("/dashboard");
  }

  return (
    <div className="grid place-items-center">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Login</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Access your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && <div className="help">{errors.email.message}</div>}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="flex gap-2">
              <input
                type={show ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShow((s) => !s)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div className="help">{errors.password.message}</div>
            )}
          </div>

          <button className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          New here?{" "}
          <Link className="text-brand-600 hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
