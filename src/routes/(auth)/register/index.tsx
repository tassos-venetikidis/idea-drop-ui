import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { registerUser } from "#/api/auth.tsx";
import { useAuth } from "#/context/authContext.tsx";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setAccessToken, setUser } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      setUser({ id: data.id, name: data.name, email: data.email });
      navigate({ to: "/ideas" });
    },
    onError: (err: any) => setError(err.message),
  });

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields...");
      return;
    }

    try {
      await mutateAsync({ name, email, password });
    } catch (error: any) {
      console.error(error.message);
      setError(error.message);
      alert("Something went wrong...");
    }
  }

  return (
    <div className="max-w-md mx-auto ">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {error && (
        <h2 className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </h2>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="w-full border border-gray rounded-md p-2"
          placeholder="Name"
          autoComplete="off"
        />
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
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
