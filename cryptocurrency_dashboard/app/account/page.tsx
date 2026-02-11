"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";




export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    fullName: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    country: "Loading...",
    userId: "Loading..."
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const storedProfileStr = localStorage.getItem("userProfile");
      if (storedProfileStr) {
        const storedProfile = JSON.parse(storedProfileStr);
        setProfile(storedProfile);

        // Fetch fresh data from backend
        try {
          const res = await fetch(`/api/user?email=${storedProfile.email}`);
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setProfile(data.user);
              localStorage.setItem("userProfile", JSON.stringify(data.user));
            }
          }
        } catch (error) {
          console.error("Failed to fetch fresh profile", error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU SURE? \n\nThis will permanently delete your account and all associated data. This action cannot be undone.")) {
      try {
        // Call Backend to Delete
        await fetch(`/api/user?email=${profile.email}`, { method: 'DELETE' });

        // Clear Session
        localStorage.removeItem("userProfile");
        localStorage.removeItem("token");

        alert("Account deleted successfully.");
        router.push("/login");
      } catch (error) {
        alert("Failed to delete account. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8 space-y-6">

        {/* 🔹 Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm text-center md:text-left">
          <div className="relative">
            <Image
              src="/images/profile_logo.jpg"
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#0b0e1a]" />
          </div>

          <div className="flex-1 w-full md:w-auto">
            <h1 className="text-xl font-semibold text-foreground">{profile.fullName}</h1>
            <p className="text-muted-foreground text-sm break-all">{profile.email}</p>
            <p className="text-xs mt-1 text-emerald-400 inline-block px-2 py-0.5 bg-emerald-500/10 rounded-full">✔ Verified Account</p>
          </div>

          <div className="text-center md:text-right text-sm text-muted-foreground w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0 mt-2 md:mt-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
            <p>User ID</p>
            <p className="font-mono text-foreground">{profile.userId || 'USR-...'}</p>
          </div>
        </div>

        {/* 🔹 Personal Information */}
        <Section title="Personal Information">
          <Info label="Full Name" value={profile.fullName} />
          <Info label="Email" value={profile.email} />
          <Info label="Phone" value={profile.phone} />
          <Info label="Country" value={profile.country} />
          <Info label="Member Since" value="March 2024" />
        </Section>

        {/* 🔹 Security Overview */}
        <Section title="Security Overview">
          <SecurityItem label="Password" status="Strong" positive />
          <SecurityItem label="Two-Factor Authentication" status="Enabled" positive />
          <SecurityItem label="Last Login" status="Today, 09:12 AM" />
          <SecurityItem label="Active Sessions" status="2 Devices" />
        </Section>

        {/* 🔹 Preferences */}
        <Section title="Preferences">
          <Info label="Base Currency" value="USD ($)" />
          <Info label="Language" value="English" />
          <Info label="Timezone" value="Asia/Kolkata" />


        </Section>

        {/* 🔴 Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-semibold mb-4">Danger Zone</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30">
              Logout from all devices
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-lg shadow-red-600/20 active:scale-95 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

/* 🔧 Reusable Components */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card backdrop-blur border border-border rounded-3xl p-5 md:p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-muted-foreground mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function SecurityItem({
  label,
  status,
  positive,
}: {
  label: string;
  status: string;
  positive?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p
        className={`text-sm font-medium ${positive ? "text-emerald-400" : "text-white"
          }`}
      >
        {status}
      </p>
    </div>
  );
}