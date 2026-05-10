import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FEATURES = [
  {
    icon: "🌍",
    t: "Country Dashboard",
    d: "Live weather, currency & cultural tips",
  },
  {
    icon: "📅",
    t: "Itinerary Builder",
    d: "Drag & drop day-by-day trip planning",
  },
  { icon: "💰", t: "Budget Planner", d: "Track expenses, stay on budget" },
  {
    icon: "🤖",
    t: "AI Travel Assistant",
    d: "Instant travel advice & recommendations",
  },
];

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        if (form.password !== form.confirm)
          throw new Error("Passwords do not match");
        if (form.password.length < 6)
          throw new Error("Password must be at least 6 characters");
        register(form.name, form.email, form.password);
        toast.success(`Welcome to TripUgo, ${form.name}! 🎉`);
      } else {
        login(form.email, form.password);
        toast.success("Welcome back! ✈️");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function demoLogin() {
    try {
      const stored = JSON.parse(localStorage.getItem("tripugo_users") || "[]");
      if (!stored.find((u) => u.email === "demo@tripugo.com"))
        localStorage.setItem(
          "tripugo_users",
          JSON.stringify([
            ...stored,
            {
              name: "Traveler",
              email: "demo@tripugo.com",
              password: "demo123",
            },
          ])
        );
      login("demo@tripugo.com", "demo123");
      toast.success("Welcome, Demo User! ✈️");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div
      className="min-h-screen grid lg:grid-cols-[1fr_0.92fr] overflow-hidden relative"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* LEFT hero panel */}
      <motion.div
        className="hidden lg:flex flex-col px-12 py-6 relative overflow-hidden z-10 h-screen"
        style={{
          background: `
          radial-gradient(circle at top left, rgba(125,211,252,0.12), transparent 28%),
          radial-gradient(circle at top right, rgba(45,212,191,0.10), transparent 24%),
          linear-gradient(
            180deg,
            #123B46 0%,
            #174652 35%,
            #1D5561 68%,
            #245C66 100%
          )
        `,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset -12px 0 35px rgba(255,255,255,0.04)",
        }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Glows */}
        <div
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(59,130,246,0.22),transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute left-0 bottom-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(6,182,212,0.14),transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute right-24 bottom-24 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(245,158,11,0.12),transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo icon */}
            <motion.div
              whileHover={{
                rotate: -10,
                scale: 1.08,
                y: -3,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="w-14 h-14 rounded-[22px] flex items-center justify-center text-2xl cursor-pointer relative"
              style={{
                background: "linear-gradient(145deg,#38BDF8,#2563EB)",
                boxShadow: "0 10px 30px rgba(37,99,235,0.35)",
                border: "1px solid rgba(255,255,255,0.18)",
                transform: "rotate(-8deg)",
              }}
            >
              ⛱
              <div
                className="absolute inset-0 rounded-[22px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.22), transparent 60%)",
                }}
              />
            </motion.div>

            {/* Logo text */}
            <motion.div
              whileHover={{
                x: 4,
                y: -1,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
              }}
            >
              <motion.div
                className="font-black text-[28px] text-white cursor-pointer"
                style={{
                  letterSpacing: "-1px",
                  textShadow: "0 4px 20px rgba(0,0,0,0.18)",
                }}
                whileHover={{
                  letterSpacing: "-0.2px",
                }}
              >
                TripUgo
              </motion.div>

              <motion.div
                className="text-[10px] font-bold tracking-[3px] uppercase"
                style={{
                  color: "rgba(255,255,255,0.42)",
                }}
                whileHover={{
                  opacity: 1,
                }}
              >
                Beyond Maps & Miles
              </motion.div>
            </motion.div>
          </motion.div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-5"
            style={{
              background: "rgba(16,185,129,0.15)",
              color: "#34D399",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            🌿 All-in-One Travel Platform
          </div>

          <h1
            className="font-black text-[56px] xl:text-[64px] leading-[0.9] mb-4"
            style={{
              letterSpacing: "-3px",
              color: "#F8FAFC",
              fontFamily: "Inter, Poppins, sans-serif",
              textShadow: "0 4px 30px rgba(0,0,0,0.22)",
            }}
          >
            Plan smarter.
            <br />
            Travel <span className="text-gradient-warm">better.</span>
          </h1>

          <p
            className="text-[15px] leading-[1.7] mb-3"
            style={{
              color: "rgba(255,255,255,0.78)",
              maxWidth: 500,
              fontWeight: 400,
              letterSpacing: "0.3px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Travel beautifully with smart planning, real-time insights,
            budgeting, packing tools and your personal AI travel companion.
          </p>
        </div>

        {/* floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(18)].map((_, i) => {
            const size = Math.random() * 7 + 4;

            return (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: "rgba(255,255,255,0.55)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: "0 0 12px rgba(255,255,255,0.45)",
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 10, -10, 0],
                  opacity: [0.35, 1, 0.35],
                }}
                transition={{
                  duration: Math.random() * 6 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 4,
                }}
              />
            );
          })}
        </div>
        {/* Feature grid */}
        <div className="relative z-10 flex flex-col flex-1">
          <div className="grid grid-cols-2 gap-2 mt-4 mb-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.t}
                className="group rounded-[20px] p-4 transition-all cursor-pointer min-h-[102px] relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #D89A2B, #B87400)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(18px)",
                  boxShadow: "0 8px 30px rgba(216,154,43,0.18)",
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  borderColor: "rgba(216,154,43,0.24)",
                  background: "linear-gradient(145deg, #E0A53A, #B97A08)",
                  boxShadow: "0 14px 40px rgba(216,154,43,0.18)",
                }}
              >
                {/* moving shine effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    background: `
               linear-gradient(
               120deg,
               transparent 20%,
               rgba(255,255,255,0.16) 45%,
               transparent 70%
               )
               `,
                    transform: "translateX(-120%)",
                    animation: "shine 2.8s infinite",
                  }}
                />
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="font-semibold text-[13px] text-white">
                  {f.t}
                </div>
                <div
                  className="text-[11px] mt-0.5 leading-4"
                  style={{ color: "rgba(255,248,220,0.72)", fontWeight: 500 }}
                >
                  {f.d}
                </div>
                <div
                  className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{
                    background: `
                    radial-gradient(circle at 20% 10%, rgba(186,230,253,0.22), transparent 26%),
                    radial-gradient(circle at 80% 0%, rgba(125,211,252,0.18), transparent 24%),
                    linear-gradient(180deg, #0B4F8C 0%, #1565A8 42%, #2A8CCF 100%)
                  `,
                  }}
                />
              </motion.div>
            ))}
          </div>
          <div className="flex gap-8 flex-wrap mb-4">
            {[
              ["3+", "Countries"],
              ["10+", "Features"],
              ["Free", "Forever"],
            ].map(([v, l]) => (
              <motion.div
                key={l}
                whileHover={{
                  y: -4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="group cursor-pointer"
              >
                <div
                  className="font-bold text-2xl text-gradient-warm transition-all duration-300 group-hover:brightness-125"
                  style={{
                    letterSpacing: "-0.5px",
                    textShadow: "0 0 12px rgba(255,170,0,0.18)",
                  }}
                >
                  {v}
                </div>

                <div
                  className="text-xs font-semibold mt-0.5 transition-all duration-300"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {l}
                </div>
              </motion.div>
            ))}
          </div>
          <div
            className="mt-3 pb-2 text-[11px] font-medium"
            style={{
              color: "rgba(255,255,255,0.32)",
              letterSpacing: "0.8px",
              marginTop: "12px",
            }}
          >
            © 2026 TripUgo • Crafted with 🩵 by Manvi
          </div>
        </div>
      </motion.div>

      {/* RIGHT form panel */}
      <div className="flex items-center justify-center relative overflow-hidden z-0 ml-[-22px]">
        {/* RIGHT SIDE VIDEO */}
        <video autoPlay muted loop playsInline className="auth-video">
          <source src="/travel-bg.mp4" type="video/mp4" />
        </video>
        <div className="auth-overlay"></div>
        <motion.div
          className="w-full max-w-xl relative z-10 rounded-[32px] p-10"
          style={{
            background: "rgba(10,18,38,0.24)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
              style={{ background: "var(--g-cyan)" }}
            >
              ⛱
            </div>
            <span className="font-bold text-xl text-white">TripUgo</span>
          </div>

          <div className="mb-7">
            <AnimatePresence mode="wait">
              <motion.h2
                key={mode + "-h"}
                className="font-bold text-3xl text-white mb-1.5"
                style={{ letterSpacing: "-0.8px" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mode === "login" ? "Welcome back 👋" : "Create account ✨"}
              </motion.h2>
            </AnimatePresence>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--muted)" }}
            >
              {mode === "login"
                ? "Sign in to continue planning your trip."
                : "Join TripUgo and start your adventure."}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(18px)",
            }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 capitalize"
                style={
                  mode === m
                    ? {
                        background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                        color: "#ffffff",
                        border: "1px solid rgba(96,165,250,0.45)",
                        boxShadow: "0 8px 22px rgba(37,99,235,0.30)",
                        fontWeight: 700,
                      }
                    : {
                        color: "rgba(255,255,255,0.72)",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }
                }
              >
                {m === "login" ? "🔑 Sign In" : "✨ Register"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={submit}
              initial={{ opacity: 0, x: mode === "login" ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label
                      className="block text-xs font-bold mb-1.5 uppercase tracking-wide"
                      style={{ color: "var(--muted)" }}
                    >
                      Full Name
                    </label>
                    <input
                      className="auth-inp"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                    />
                  </div>
                )}
                <div>
                  <label
                    className="block text-xs font-bold mb-1.5 uppercase tracking-wide"
                    style={{ color: "var(--muted)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="auth-inp"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-bold mb-1.5 uppercase tracking-wide"
                    style={{ color: "var(--muted)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="auth-inp"
                      style={{ paddingRight: 44 }}
                      placeholder={
                        mode === "register"
                          ? "Min. 6 characters"
                          : "Your password"
                      }
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: "var(--muted)" }}
                    >
                      {showPass ? "👁" : "🔒"}
                    </button>
                  </div>
                </div>
                {mode === "register" && (
                  <div>
                    <label
                      className="block text-xs font-bold mb-1.5 uppercase tracking-wide"
                      style={{ color: "var(--muted)" }}
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="auth-inp"
                      placeholder="Repeat password"
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                      required
                    />
                  </div>
                )}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="auth-submit"
                  style={{ marginTop: 6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="30 70"
                        />
                      </svg>
                      Please wait...
                    </span>
                  ) : mode === "login" ? (
                    "🚀 Sign In"
                  ) : (
                    "✨ Create Account"
                  )}
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--muted)" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
          </div>

          <motion.button
            onClick={demoLogin}
            className="auth-demo"
            whileTap={{ scale: 0.98 }}
          >
            ⚡ Continue as Demo User
          </motion.button>

          <p
            className="text-center mt-5 text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #60A5FA, #2563EB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 12px rgba(59,130,246,0.18)",
              }}
            >
              {mode === "login" ? "Sign up free →" : "Sign in →"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
