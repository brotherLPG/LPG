import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail, ShieldCheck, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => navigate("/Dashboard"), 800);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-slate-900 via-emerald-900 to-blue-900 p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl lg:grid-cols-2">
        {/* Left Panel - Branding */}
        <div className="hidden min-h-155 flex-col justify-between bg-linear-to-br from-emerald-600 via-emerald-700 to-blue-700 p-10 text-white lg:flex relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Flame className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold">GasFlow ERP</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold tracking-widest text-emerald-100">GAS MANAGEMENT SYSTEM</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Efficient gas flow management starts here.</h1>
            <p className="mt-5 max-w-sm text-emerald-100">Monitor gas flow, track inventory, and manage operations from one place.</p>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-emerald-100">© 2026 GasFlow ERP. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex min-h-155 items-center p-7 sm:p-12">
          <div className="w-full">
            <div className="mb-10 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-emerald-700">
                <Flame className="h-5 w-5" />
                <span className="font-bold">GasFlow ERP</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-emerald-600">WELCOME BACK</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">Sign in to your account</h2>
            <p className="mt-3 text-slate-500">Enter your details to access the GasFlow ERP dashboard.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">Email address</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input 
                    required 
                    type="email" 
                    placeholder="admin@gasflow-erp.com" 
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" 
                  />
                </div>
              </label>
              
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-12 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    aria-label={showPassword ? "Hide password" : "Show password"} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-600" /> 
                  Remember me
                </label>
                <button type="button" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot password?</button>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-700 hover:to-blue-700 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Signing in...</> : <><LogIn className="h-5 w-5" /> Sign In</>}
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-slate-500">
              Don't have an account? <button className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Contact administrator</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
