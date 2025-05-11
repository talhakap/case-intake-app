import { useState } from "react";

function Login({ onLogin }) {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const USERS = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = USERS.find(u =>
      u.username === loginForm.username &&
      u.password === loginForm.password
    );
    if (foundUser) {
      setError("");
      onLogin(foundUser);
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
        <p style={{ color: "red" }}>{error}</p>
      </form>
    </div>
  );
}

export default Login;
