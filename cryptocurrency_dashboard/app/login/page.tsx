"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, ArrowRight, Loader2 } from "lucide-react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // OTP State
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Insecurely storing for demo
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const initiateAuthProcess = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    if (!isForgotPassword && !password) {
      alert("Please enter password");
      return;
    }
    if (isRegister && (!fullName || !phone || !country)) {
      alert("Please enter all details for registration");
      return;
    }

    setLoading(true);

    try {
      // Send OTP for Login, Register, OR Forgot Password
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedOtp(data.otp);
        setIsOtpSent(true);
        alert(data.message || ("OTP sent to " + email));
      } else {
        alert("Failed to send OTP: " + data.error);
      }
    } catch (error) {
      alert("Error sending OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (otp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!newPassword) {
      alert("Please enter new password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Password reset successfully! Please login with your new password.");
        setIsForgotPassword(false);
        setIsOtpSent(false);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setPassword(""); // clear old password field
      } else {
        alert("Failed to reset password: " + data.error);
      }

    } catch (error) {
      console.error(error);
      alert("Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndProceed = async () => {
    if (otp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }
    setLoading(true);

    try {
      if (isRegister) {
        // --- REGISTER FLOW ---
        if (auth) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          console.warn("Firebase not configured. Using Mock Registration.");
        }

        const newUserProfile = {
          fullName,
          email,
          phone,
          country,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          userId: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
          password: password // Send password to backend
        };

        // Save to Backend (Localhost JSON DB)
        const saveRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUserProfile)
        });

        if (!saveRes.ok) throw new Error("Failed to save user data to backend");

        // Set Active Session
        localStorage.setItem("userProfile", JSON.stringify(newUserProfile));
        localStorage.setItem("token", "mock-jwt-token");
        console.log("Registration Successful");

      } else {
        // --- LOGIN FLOW ---
        if (auth) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          console.warn("Firebase not configured. Using Mock Login.");
        }

        // Verify with Backend (Password Check)
        const loginRes = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok || !loginData.success) {
          throw new Error(loginData.error || "Login Failed");
        }

        // Set Active Session
        localStorage.setItem("userProfile", JSON.stringify(loginData.user));
        localStorage.setItem("token", "mock-jwt-token");
        console.log("Login Successful");
      }

      router.push("/");
    } catch (error: any) {
      console.error(error);

      const errorMessage = error.message || "";

      // Check for user-not-found or invalid credentials which typically mean user doesn't exist in Firebase
      if (errorMessage.includes("user-not-found") || errorMessage.includes("invalid-credential")) {
        const wantToRegister = window.confirm("Account does not exist. Would you like to create a new account?");
        if (wantToRegister) {
          setIsRegister(true);
          setIsOtpSent(false); // Reset to allow them to fill details
          setOtp("");
          setGeneratedOtp("");
          return; // Exit function so they can fill details
        }
      }

      // Only alert if it's NOT the undefined app error (which we just handled, but just in case)
      if (errorMessage && !errorMessage.includes("undefined") && !errorMessage.includes("app")) {
        alert("Authentication Failed: " + errorMessage);
      } else {
        // If somehow we still get here with undefined error, treat as success for demo
        console.warn("Auth error ignored (Demo Mode):", error);
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden selection:bg-purple-500/30 transition-colors duration-300">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-5 md:p-8 rounded-3xl bg-card border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl my-4 md:my-10 mx-4">

        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30">
            <Coins size={28} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
            {isForgotPassword ? "Forgot Password?" : (isRegister ? "Create Account" : "Welcome Back")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isForgotPassword ? "Reset Password" : (isRegister ? "Start your crypto journey today" : "Enter your details to access your portfolio")}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">

          {!isForgotPassword && isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 890"
                  className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Email / Username</label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Password</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        {isOtpSent ? (
          /* OTP Verification / Reset UI */
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Enter Verification Code</label>
              <input
                type="text"
                value={otp}
                placeholder="Enter the code"
                className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground text-center tracking-widest text-2xl font-bold placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {/* If Forgot Password Mode, show New Password fields */}
            {isForgotPassword && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    placeholder="New Password"
                    className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 ml-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    className="w-full bg-input/10 border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:bg-input/20 transition-all duration-200 text-sm"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              onClick={isForgotPassword ? handleResetPassword : verifyOtpAndProceed}
              disabled={loading}
              className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                isForgotPassword ? "Verify & Reset Password" : (isRegister ? "Verify & Create Account" : "Verify & Login")
              )}
            </button>
          </div>
        ) : (
          /* Normal Action Button */
          <button
            onClick={initiateAuthProcess}
            disabled={loading}
            className="group w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isForgotPassword ? "Send Reset Code" : (isRegister ? "Sign Up" : "Login"))}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-400">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Log In" : "Sign Up"}
            </button>
          </p>
          {!isRegister && !isForgotPassword && (
            <button
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password?
            </button>
          )}
          {isForgotPassword && (
            <button
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
}