import { useState } from "react";

type LoginProps = {
  onLogin: (role: string) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");

  function handleLogin() {
    const lowerEmail = email.toLowerCase();

    if (lowerEmail === "owner@pivot.com") {
      onLogin("owner");
      return;
    }

    if (lowerEmail === "alumni@pivot.com") {
      onLogin("alumni");
      return;
    }

    onLogin("student");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Pivot Tech Connect</h1>

        <p>
          Sign in to access your career dashboard, job opportunities, and
          resources.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="demo-logins">
          <h4>Demo Accounts</h4>

          <p>owner@pivot.com</p>
          <p>alumni@pivot.com</p>
          <p>student@pivot.com</p>
        </div>
      </div>
    </div>
  );
}