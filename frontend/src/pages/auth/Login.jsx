import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { Mail, Lock, CheckCircle2, BarChart3, Loader2 } from 'lucide-react'; // Added Loader icon

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const redirectByRole = (role) => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "user") {
      navigate("/user/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(formData);
      redirectByRole(data?.user?.role);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
  if (data.user.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/user/dashboard");
  }
};

const handleGoogleError = (msg) => {
  setError(msg);
};

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }}>
        </div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-indigo-500 rounded-2xl">
              <BarChart3 size={32} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight italic">SmartCRM</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Manage your relations with <span className="text-indigo-400">precision.</span>
          </h1>
          
          <ul className="space-y-4">
            {['Real-time Analytics', 'Lead Automation', 'Team Collaboration'].map((text) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 size={20} className="text-indigo-400" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your corporate credentials to access the dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email} // CONNECTED TO STATE
                  onChange={handleChange} // CONNECTED TO STATE
                  placeholder="name@company.com"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password} // CONNECTED TO STATE
                  onChange={handleChange} // CONNECTED TO STATE
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="remember" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-sm text-slate-600">Keep me logged in for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transform transition active:scale-[0.99] shadow-xl shadow-slate-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                "Access Dashboard"
              )}
            </button>
            <div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-slate-200"></div>
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-slate-50 px-3 text-slate-500">Or</span>
  </div>
</div>

<div className="flex justify-center">
  <GoogleSignInButton
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleError}
    text="signin_with"
  />
</div>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-slate-600">
              New to the platform?{" "}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700">
                Request access
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;