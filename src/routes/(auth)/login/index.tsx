import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "#/api/auth.tsx";
import { useAuth } from "#/context/authContext.tsx";

export const Route = createFileRoute("/(auth)/login/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setAccessToken, setUser } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
    },
    onError: (err: any) => setError(err.message),
  });

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    try {
      await mutateAsync({ email, password });
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto ">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && (
        <h2 className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </h2>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full border border-gray rounded-md p-2"
          placeholder="Email"
          autoComplete="off"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full border border-gray rounded-md p-2"
          placeholder="Password"
          autoComplete="off"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
