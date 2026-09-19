import { useState } from "react";
import type { AuthMode } from "../types/auth";
import { login, register } from "../api/auth";
import "./css/AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignIn = mode === "signin";

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = isSignIn
        ? await login({ email, password })
        : await register({ username: name, email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
      }));

      // позже: navigate to Home
      console.log("Auth ok", data);
      alert("Success! Token saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isSignIn ? "signup" : "signin");
    setError(null);
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">
          {isSignIn ? "Nice to see you again" : "Create your account"}
        </h1>

        {!isSignIn && (
          <input
            className="auth-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Please wait…" : isSignIn ? "Sign in" : "Sign up"}
        </button>

        <p className="auth-switch">
          {isSignIn ? (
            <>
              Don&apos;t have an account?{" "}
              <button type="button" className="auth-link" onClick={switchMode}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="auth-link" onClick={switchMode}>
                Sign in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}