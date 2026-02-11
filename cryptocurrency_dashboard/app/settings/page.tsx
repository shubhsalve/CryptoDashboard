"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CreditCard, Trash2, Star, Plus, X, Check, Mail } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Default Settings State
  const defaultSettings: SettingsState = {
    baseCurrency: "USD ($)",
    language: "English",
    timezone: "UTC",
    twoFactorAuth: false,
    loginAlerts: true,
    autoLogout: false,
    livePriceUpdates: true,
    showPnL: true,
    highVolatilityAlerts: false,
    priceAlerts: true,
    marketNews: true,
    systemNotifications: true,
    apiAccess: false,
    emailPreference: "existing", // 'existing' or 'new'
  };

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("userSettings", JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings(defaultSettings);
      localStorage.removeItem("userSettings");
    }
  };

  /* ================= PAYMENT LOGIC ================= */
  const [savedCards, setSavedCards] = useState<Card[]>([
    { id: "1", name: "Mayad Ahmed", number: "•••• •••• •••• 2538", expiry: "02/28", cvv: "123", isDefault: true, type: "visa" },
    { id: "2", name: "Mayad Ahmed", number: "•••• •••• •••• 8943", expiry: "11/26", cvv: "456", isDefault: false, type: "mastercard" }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const handleAddCard = () => {
    if (!newCard.name || !newCard.number || !newCard.expiry || !newCard.cvv) {
      alert("Please fill in all details");
      return;
    }
    const card: Card = {
      id: Date.now().toString(),
      name: newCard.name,
      number: `•••• •••• •••• ${newCard.number.slice(-4)}`,
      expiry: newCard.expiry,
      cvv: newCard.cvv,
      isDefault: savedCards.length === 0,
      type: "visa" // Simplification
    };
    setSavedCards([...savedCards, card]);
    setIsAddingCard(false);
    setNewCard({ name: "", number: "", expiry: "", cvv: "" });
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Delete this card?")) {
      setSavedCards(savedCards.filter(c => c.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setSavedCards(savedCards.map(c => ({ ...c, isDefault: c.id === id })));
  };

  /* ================= EMAIL LOGIC ================= */
  const [savedEmails, setSavedEmails] = useState<Email[]>([
    { id: "1", address: "shubham@gmail.com", isDefault: true },
    { id: "2", address: "work@crypto.com", isDefault: false }
  ]);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    const email: Email = {
      id: Date.now().toString(),
      address: newEmail,
      isDefault: savedEmails.length === 0
    };
    setSavedEmails([...savedEmails, email]);
    setIsAddingEmail(false);
    setNewEmail("");
  };

  const handleDeleteEmail = (id: string) => {
    if (confirm("Delete this email?")) {
      setSavedEmails(savedEmails.filter(e => e.id !== id));
    }
  };

  const handleSetDefaultEmail = (id: string) => {
    setSavedEmails(savedEmails.map(e => ({ ...e, isDefault: e.id === id })));
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden md:ml-64 ml-0 p-4 md:p-8 space-y-10 mb-20 md:mb-0 pb-24 md:pb-8">

        <Topbar />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage preferences, security, billing, and payments
          </p>
        </div>

        {/* ================= APPEARANCE & REGION ================= */}
        <Section title="Appearance & Region">
          <Toggle
            label="Dark Mode"
            description="Use dark theme across dashboard"
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
          <Select
            label="Base Currency"
            options={["USD ($)", "INR (₹)", "EUR (€)"]}
            value={settings.baseCurrency}
            onChange={(val) => updateSetting("baseCurrency", val)}
          />
          <Select
            label="Language"
            options={["English", "Hindi", "Spanish"]}
            value={settings.language}
            onChange={(val) => updateSetting("language", val)}
          />
          <Select
            label="Timezone"
            options={["Asia/Kolkata", "UTC", "EST", "PST"]}
            value={settings.timezone}
            onChange={(val) => updateSetting("timezone", val)}
          />
        </Section>

        {/* ================= SECURITY ================= */}
        <Section title="Security & Privacy">
          <Toggle
            label="Two-Factor Authentication (2FA)"
            description="Extra security for login"
            checked={settings.twoFactorAuth}
            onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
          />
          <Toggle
            label="Login Alerts"
            description="Alert on new device login"
            checked={settings.loginAlerts}
            onChange={(e) => updateSetting("loginAlerts", e.target.checked)}
          />
          <Toggle
            label="Auto Logout"
            description="Logout after inactivity"
            checked={settings.autoLogout}
            onChange={(e) => updateSetting("autoLogout", e.target.checked)}
          />
        </Section>

        {/* ================= TRADING ================= */}
        <Section title="Trading Preferences">
          <Toggle
            label="Live Price Updates"
            description="Real-time market prices"
            checked={settings.livePriceUpdates}
            onChange={(e) => updateSetting("livePriceUpdates", e.target.checked)}
          />
          <Toggle
            label="Show PnL Percentage"
            checked={settings.showPnL}
            onChange={(e) => updateSetting("showPnL", e.target.checked)}
          />
          <Toggle
            label="High Volatility Alerts"
            checked={settings.highVolatilityAlerts}
            onChange={(e) => updateSetting("highVolatilityAlerts", e.target.checked)}
          />
        </Section>

        {/* ================= NOTIFICATIONS ================= */}
        <Section title="Notifications">
          <Toggle
            label="Price Alerts"
            checked={settings.priceAlerts}
            onChange={(e) => updateSetting("priceAlerts", e.target.checked)}
          />
          <Toggle
            label="Market News"
            checked={settings.marketNews}
            onChange={(e) => updateSetting("marketNews", e.target.checked)}
          />
          <Toggle
            label="System Notifications"
            checked={settings.systemNotifications}
            onChange={(e) => updateSetting("systemNotifications", e.target.checked)}
          />
        </Section>

        {/* ================= API ================= */}
        <Section title="API & Advanced">
          <Toggle
            label="Enable API Access"
            description="Allow external integrations"
            checked={settings.apiAccess}
            onChange={(e) => updateSetting("apiAccess", e.target.checked)}
          />
          <Info label="API Usage" value={`${settings.apiAccess ? "124" : "0"} / 10,000 requests`} />
          <button className="btn-secondary" disabled={!settings.apiAccess}>
            Manage API Keys
          </button>
        </Section>

        {/* ================= BILLING HISTORY ================= */}
        <Section title="Billing History">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3">Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-left">Tracking & Address</th>
                  <th></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                <BillingRow
                  invoice="Account Sale"
                  date="Apr 14, 2004"
                  amount="$3,050"
                  status="Pending"
                  statusClass="bg-emerald-500/20 text-emerald-400"
                  tracking="LM580405575CN"
                  address="313 Main Road, Sunderland"
                />
                <BillingRow
                  invoice="Account Sale"
                  date="Jun 24, 2008"
                  amount="$1,050"
                  status="Cancelled"
                  statusClass="bg-rose-500/20 text-rose-400"
                  tracking="AZ938540353US"
                  address="96 Grange Road, Peterborough"
                />
              </tbody>
            </table>
          </div>
        </Section>

        {/* ================= CONTACT EMAIL ================= */}
        <Section title="Contact Email">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Manage your contact emails</p>
              {!isAddingEmail && (
                <button
                  onClick={() => setIsAddingEmail(true)}
                  className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Plus size={14} /> Add new email
                </button>
              )}
            </div>

            <div className="space-y-3">
              {savedEmails.map((email) => (
                <div
                  key={email.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${email.isDefault
                    ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : "bg-muted/20 border-border hover:border-muted-foreground/20"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${email.isDefault ? "bg-purple-500/20 text-purple-400" : "bg-muted text-muted-foreground"}`}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{email.address}</p>
                      {email.isDefault && (
                        <span className="text-[10px] text-purple-300">Primary Email</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!email.isDefault && (
                      <button
                        onClick={() => handleSetDefaultEmail(email.id)}
                        className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                      >
                        <Star size={14} /> Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteEmail(email.id)}
                      className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAddingEmail && (
              <div className="bg-popover border border-border rounded-xl p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Add a new email</h3>
                  <button onClick={() => setIsAddingEmail(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex gap-4">
                  <input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 bg-input/50 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50"
                    placeholder="Enter email address"
                  />
                  <button
                    onClick={handleAddEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-indigo-500 transition-all"
                  >
                    <Check size={16} /> Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* ================= PAYMENT METHOD ================= */}
        <Section title="Payment Method">
          <div className="space-y-6">
            {/* Header / Add Button */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Manage your saved cards</p>
              {!isAddingCard && (
                <button
                  onClick={() => setIsAddingCard(true)}
                  className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Plus size={14} /> Add new card
                </button>
              )}
            </div>

            {/* Saved Cards List */}
            <div className="space-y-3">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-all ${card.isDefault
                    ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : "bg-muted/20 border-border hover:border-muted-foreground/20"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${card.isDefault ? "bg-purple-500/20 text-purple-400" : "bg-muted text-muted-foreground"}`}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{card.name}</p>
                        {card.isDefault && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span className="font-mono">{card.number}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span>Exp: {card.expiry}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0 ml-auto md:ml-0">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                        title="Set as default"
                      >
                        <Star size={14} /> Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Card Form */}
            {isAddingCard && (
              <div className="bg-popover border border-border rounded-xl p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Add a new card</h3>
                  <button onClick={() => setIsAddingCard(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Name on Card</label>
                    <input
                      value={newCard.name}
                      onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Card Number</label>
                    <input
                      value={newCard.number}
                      onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                      maxLength={19}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Expiry Date</label>
                    <input
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      maxLength={5}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">CVV</label>
                    <input
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                      maxLength={4}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAddCard}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25"
                  >
                    <Check size={16} /> Save Card
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* ================= DANGER ZONE ================= */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-semibold mb-4">Danger Zone</h3>
          <button onClick={resetSettings} className="btn-danger">
            Reset All Settings
          </button>
        </div>

      </main>
    </div>
  );
}

interface Email {
  id: string;
  address: string;
  isDefault: boolean;
}

interface Card {
  id: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  isDefault: boolean;
  type: string;
}

interface SettingsState {
  baseCurrency: string;
  language: string;
  timezone: string;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  autoLogout: boolean;
  livePriceUpdates: boolean;
  showPnL: boolean;
  highVolatilityAlerts: boolean;
  priceAlerts: boolean;
  marketNews: boolean;
  systemNotifications: boolean;
  apiAccess: boolean;
  emailPreference: string;
}

/* ================= COMPONENTS ================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card backdrop-blur border border-border rounded-3xl p-4 md:p-6 space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="pr-4">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <input
        type="checkbox"
        className="toggle"
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm mb-1">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-input/50 border border-input rounded-xl px-4 py-2 text-foreground"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function BillingRow({
  invoice,
  date,
  amount,
  status,
  statusClass,
  tracking,
  address,
  checked,
}: {
  invoice: string;
  date: string;
  amount: string;
  status: string;
  statusClass: string;
  tracking: string;
  address: string;
  checked?: boolean;
}) {
  return (
    <tr>
      <td className="py-4 flex gap-3 items-center">
        <input type="checkbox" defaultChecked={checked} />
        {invoice}
      </td>
      <td className="text-center">{date}</td>
      <td className="text-center">{amount}</td>
      <td className="text-center">
        <span className={`px-3 py-1 rounded-full text-xs ${statusClass}`}>
          {status}
        </span>
      </td>
      <td>
        <p className="text-sky-400 text-xs">{tracking}</p>
        <p className="text-muted-foreground text-xs">{address}</p>
      </td>
      <td className="text-right">⋮</td>
    </tr>
  );
}

function Input({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <input
        readOnly
        value={value}
        className="w-full bg-input/50 border border-input rounded-xl px-4 py-2 text-foreground"
      />
    </div>
  );
}
