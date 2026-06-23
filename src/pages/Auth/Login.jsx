import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import SocialLogin from "../../components/shared/SocialLogin";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/shared/Logo";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-base-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="border border-base-300 bg-base-200 p-8">
          <h1 className="font-display text-2xl font-semibold text-base-content">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Log in to access your saved and submitted prompts.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
                Email
              </label>
              <div className="flex items-center gap-2 border border-base-300 bg-base-100 px-3 py-2.5">
                <FiMail className="text-base-content/40" size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-accent">Email is required</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
                Password
              </label>
              <div className="flex items-center gap-2 border border-base-300 bg-base-100 px-3 py-2.5">
                <FiLock className="text-base-content/40" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-base-content/40 hover:text-base-content"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-accent">
                  Password is required
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-base-300" />
            <span className="text-[11px] uppercase tracking-wider text-base-content/40">
              or
            </span>
            <div className="h-px flex-1 bg-base-300" />
          </div>

          <SocialLogin />

          <p className="mt-6 text-center text-sm text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-secondary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;