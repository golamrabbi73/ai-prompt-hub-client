import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiImage, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Logo from "../../components/shared/Logo";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("register form data:", data);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-base-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="border border-base-300 bg-base-200 p-8">
          <h1 className="font-display text-2xl font-semibold text-base-content">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Start discovering and saving AI prompts.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
                Name
              </label>
              <div className="flex items-center gap-2 border border-base-300 bg-base-100 px-3 py-2.5">
                <FiUser className="text-base-content/40" size={16} />
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full bg-transparent text-sm outline-none"
                  {...register("name", { required: true })}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-accent">Name is required</p>
              )}
            </div>

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
                Photo URL
              </label>
              <div className="flex items-center gap-2 border border-base-300 bg-base-100 px-3 py-2.5">
                <FiImage className="text-base-content/40" size={16} />
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full bg-transparent text-sm outline-none"
                  {...register("photoURL", { required: true })}
                />
              </div>
              {errors.photoURL && (
                <p className="mt-1 text-xs text-accent">
                  Photo URL is required
                </p>
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
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent text-sm outline-none"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-base-content/40 hover:text-base-content"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password?.type === "required" && (
                <p className="mt-1 text-xs text-accent">
                  Password is required
                </p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="mt-1 text-xs text-accent">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-base-300" />
            <span className="text-[11px] uppercase tracking-wider text-base-content/40">
              or
            </span>
            <div className="h-px flex-1 bg-base-300" />
          </div>

          <button className="btn btn-outline w-full border-base-300">
            <FcGoogle size={18} /> Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-secondary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;