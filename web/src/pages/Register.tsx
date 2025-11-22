import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../auth";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(7, "Phone is too short")
    .max(20, "Phone is too long")
    .optional(),
  password: z.string().min(8, "Min 8 characters"),
  agree: z
    .boolean()
    .refine((v) => v === true, { message: "Please accept terms" }),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const nav = useNavigate();
  const { register: doRegister } = useAuth();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(v: FormData) {
    const { agree, ...payload } = v;
    await doRegister(payload);
    nav("/login");
  }

  return (
    <div className="grid place-items-center">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Create account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sign up to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              placeholder="Jane Doe"
              {...register("name")}
            />
            {errors.name && <div className="help">{errors.name.message}</div>}
          </div>

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
            <label className="label">Phone (optional)</label>
            <input
              className="input"
              placeholder="+91 90000 00000"
              {...register("phone")}
            />
            {errors.phone && <div className="help">{errors.phone.message}</div>}
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

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("agree")} />
            <span>I agree to the Terms & Privacy</span>
          </label>
          {errors.agree && <div className="help">{errors.agree.message}</div>}

          <button className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link className="text-brand-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
