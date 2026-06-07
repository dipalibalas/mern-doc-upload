import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user && localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? {
            name: data.name,
            email: data.email,
            password: data.password,
          }
        : {
            email: data.email,
            password: data.password,
          };

      const response = await api.post(endpoint, payload);
      login(response.data);
      toast.success(isRegister ? "Account created" : "Welcome back");
      navigate("/");
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          isRegister ? "Registration failed" : "Login failed",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-left">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {isRegister ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {isRegister
            ? "Sign up to create and share documents."
            : "Sign in to access your documents."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <input
              placeholder="Full name"
              {...register("name", { required: true })}
              className="w-full border border-slate-300 p-3 rounded-lg text-sm"
            />
          )}

          <input
            placeholder="Email"
            type="email"
            {...register("email", { required: true })}
            className="w-full border border-slate-300 p-3 rounded-lg text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full border border-slate-300 p-3 rounded-lg text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister((value) => !value)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isRegister ? "Sign in" : "Register"}
          </button>
        </p>

        {!isRegister && (
          <p className="text-xs text-slate-400 mt-4 text-center">
            Demo accounts: alice@example.com / bob@example.com (password123)
            after running <code className="bg-slate-100 px-1 rounded">npm run seed</code>
          </p>
        )}
      </div>
    </div>
  );
}
