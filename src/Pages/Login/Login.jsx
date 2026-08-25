import { useState } from "react";
import {  LoaderCircle, LogIn, Droplets } from "lucide-react";
import logo from "../../assets/Images/logo.jpeg";
import loginpimage from "../../assets/Images/loginpage.jpg"
import { useNavigate } from "react-router-dom";
import { useToast } from "../../utils/GlobalToast";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Login successful!");
      navigate("/Dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-white">
      <section className="grid w-full lg:grid-cols-2">
        {/* Left Panel - Branding */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-cover bg-bottom bg-no-repeat "
          style={{ backgroundImage: `url(${loginpimage})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-white/10" />
            <div className="absolute top-40 right-40 w-32 h-32 rounded-full border border-white/10" />
            <div className="absolute bottom-32 left-32 w-48 h-48 rounded-full border border-white/10" />
            <div className="absolute top-1/3 left-1/4 w-2 h-32 bg-white/10 rounded-full" />
            <div className="absolute bottom-1/4 right-1/3 w-2 h-24 bg-white/10 rounded-full" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            {/* <div className="rounded-xl bg-white/20 p-1 backdrop-blur-sm">
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-16 border rounded-sm object-cover"
              />
            </div> */}
            {/* <div>
              <span className="text-2xl font-bold text-white block">
                Brother LPG
              </span>
              <span className="text-sm text-white/80">(PVT)</span>
            </div> */}
          </div>

          <div className="relative z-10">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-16 border rounded-sm object-cover"
            />
            <h1 className="text-5xl font-bold text-white leading-tight mb-3">
              Brother LPG
            </h1>
            <p className="text-xl text-white/90">
              Pakistan's leading LPG cylinder management system
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex items-center justify-center py-2 bg-white w-full">
          <div>
            {/* Desktop Logo */}
            <div className="mb-6 hidden lg:flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 border rounded-sm"
              />
            </div>

            <p className="text-sm font-bold text-accent-blue">Welcome back</p>
            <h2 className="mt-1 text-4xl font-bold text-BLUE-dark">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-tertiary">
              Access your LPG plant operations, inventory, and reports securely.
            </p>

            <div className="bg-[white] shadow-2xl shadow-[#0F172A1A] rounded-lg p-6">
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <label className="block">
                  <span className="block text-sm font-semibold mb-2 text-slate-900">
                    Email Address
                  </span>
                  <input
                    required
                    type="email"
                    placeholder="ri.ahmad@overlandlpg.pk"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold mb-2 text-slate-900">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 pr-20 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-BLUE-dark">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="font-semibold hover:underline text-accent-blue"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-sm text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-tertiary hover:underline"
                >
                  Contact Administrator for Account Access
                </button>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-sm text-[#6B7280]">
                Authorized personnel only. Activities are recorded under
                Pakistan Cybersecurity Law.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
