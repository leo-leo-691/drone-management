import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Failed to log in");
    }
  }

  return (
    <div
      className="container flex justify-center items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card text-center"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 style={{ marginBottom: "2rem", color: "var(--primary-color)" }}>
          Admin Access
        </h2>
        {error && (
          <div style={{ color: "var(--accent-color)", marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "none",
              background: "#333",
              color: "white",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "none",
              background: "#333",
              color: "white",
            }}
            required
          />
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
