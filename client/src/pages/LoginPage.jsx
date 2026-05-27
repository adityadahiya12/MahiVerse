import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  // ------------------ States ------------------
  const [currState, setCurrState] = useState("Sign Up"); // Toggle between Sign Up / Login
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get login function from context
  const { login } = useContext(AuthContext);

  // ------------------ Handle Form Submission ------------------
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Prepare credentials
      const credentials = {
        email,
        password,
        ...(currState === "Sign Up" && { fullName, bio }),
      };

      // ✅ Call AuthContext login/signup
      const result = await login(
        currState === "Sign Up" ? "signup" : "login",
        credentials
      );

      // ✅ Check server response
      if (!result || !result.success) {
        setError(result?.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Switch Mode ------------------
  const switchMode = (newMode) => {
    setCurrState(newMode);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-cover bg-center items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ------------------ Left Section (Logo) ------------------ */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className="w-[min(30vw,250px)]"
      />

      {/* ------------------ Right Section (Form) ------------------ */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[300px]"
      >
        {/* ------------------ Heading ------------------ */}
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
        </h2>

        {/* ------------------ Error Message ------------------ */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* ------------------ Input Fields ------------------ */}
        {currState === "Sign Up" && (
          <input
            type="text"
            placeholder="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-500 p-2 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="name" // FIXED: Added autocomplete attribute
            required
          />
        )}

        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-500 p-2 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoComplete="email" // FIXED: Added autocomplete attribute
          required
        />

        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-500 p-2 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          // FIXED: Added dynamic autocomplete for password
          autoComplete={currState === 'Sign Up' ? 'new-password' : 'current-password'}
          required
        />

        {currState === "Sign Up" && (
          <textarea
            placeholder="Provide a short bio (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border border-gray-500 p-2 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        )}

        {/* ------------------ Submit Button ------------------ */}
        <button
          type="submit"
          disabled={loading}
          className={`py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-purple-600 hover:to-indigo-600"
          }`}
        >
          {loading ? "Processing..." : currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        {/* ------------------ Terms & Policy Checkbox (Only for Sign Up) ------------------ */}
        {currState === "Sign Up" && (
          <div className="flex items-start text-sm text-gray-300 gap-2">
            <input type="checkbox" required className="mt-1" />
            <p>I agree to the terms of use & privacy policy of MahiVerse</p>
          </div>
        )}

        {/* ------------------ Switch between Login & Sign Up ------------------ */}
        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => switchMode("Login")}
                className="font-medium text-pink-400 cursor-pointer hover:text-pink-300"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Don’t have an account?{" "}
              <span
                onClick={() => switchMode("Sign Up")}
                className="font-medium text-pink-400 cursor-pointer hover:text-pink-300"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
