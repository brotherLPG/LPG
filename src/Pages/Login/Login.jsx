import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail, AlertCircle, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(true);
    window.setTimeout(() => {
      setError(false);
      navigate("/Dashboard");
    }, 1500);
  };

  return (
    <main className="flex min-h-screen w-full bg-white">
      <section className="grid w-full lg:grid-cols-2">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-primary">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-white/10" />
            <div className="absolute top-40 right-40 w-32 h-32 rounded-full border border-white/10" />
            <div className="absolute bottom-32 left-32 w-48 h-48 rounded-full border border-white/10" />
            <div className="absolute top-1/3 left-1/4 w-2 h-32 bg-white/10 rounded-full" />
            <div className="absolute bottom-1/4 right-1/3 w-2 h-24 bg-white/10 rounded-full" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Droplets className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LPG Plant ERP</span>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">LPG Plant ERP</h1>
            <p className="text-xl text-white/90">Pakistan's leading LPG cylinder management system</p>
          </div>

          <div className="relative z-10">
            <p className="text-sm text-white/70">© 2026 LPG Plant ERP. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex items-center justify-center p-8 lg:p-16 bg-slate-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 lg:hidden flex items-center gap-3">
              <div className="rounded-xl p-2 bg-gradient-primary">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-dark">LPG Plant ERP</span>
            </div>

            <p className="text-sm font-semibold text-primary-dark">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold text-primary-dark">Sign in to your account</h2>
            <p className="mt-3 text-slate-500">Access your LPG plant operations, inventory, and reports securely.</p>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl flex items-start gap-3 bg-error-light border border-error-light">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-error" />
                <div>
                  <p className="font-semibold text-sm text-error">Access Denied</p>
                  <p className="text-sm mt-1 text-error-dark">The password you entered is incorrect. Please try again or contact the administrator.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block">
                <span className="block text-sm font-semibold mb-2 text-primary-dark">Email Address</span>
                <input 
                  required 
                  type="email" 
                  placeholder="mr.ahmad@cworldlpg.pk"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </label>
              
              <label className="block">
                <span className="block text-sm font-semibold mb-2 text-primary-dark">Password</span>
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 pr-12 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="text-sm font-medium">{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </label>
              
              <div className="flex items-center justify-end text-sm">
                <button type="button" className="font-semibold hover:underline text-accent-blue">Forgot Password?</button>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-primary"
              >
                {isLoading ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Signing in...</> : <><LogIn className="h-5 w-5" /> Sign In</>}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
