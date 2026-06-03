import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Include at least 1 uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Include at least 1 number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (pass) => {
  let score = 0;
  if (pass.length >= 6) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++; // Bonus for special chars
  return score;
};

const strength = getPasswordStrength(formData.password);

// Helper for bar color
const getStrengthColor = (score) => {
  if (score <= 1) return "bg-red-500";
  if (score === 2) return "bg-orange-500";
  if (score === 3) return "bg-yellow-500";
  return "bg-emerald-500";
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const hasValidationErrors = Object.values(validationErrors).some(
    (value) => value && value.trim() !== ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const isValid = validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const data = await registerUser(formData);
      setMessage(
        data.message || "Account request submitted successfully."
      );

      let seconds = 5;
      setCountdown(seconds);

      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);

        if (seconds <= 0) {
          clearInterval(interval);
          navigate("/login");
        }
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
  setMessage(
    data.message ||
      "Google account request submitted successfully. Wait for admin approval."
  );

  let seconds = 5;
  setCountdown(seconds);

  const interval = setInterval(() => {
    seconds -= 1;
    setCountdown(seconds);

    if (seconds <= 0) {
      clearInterval(interval);
      navigate("/login");
    }
  }, 1000);
};

const handleGoogleError = (msg) => {
  setError(msg);
};


  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-50 relative overflow-hidden items-center justify-center border-l border-slate-100">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/cube-grid.png")',
          }}
        ></div>

        <div className="relative z-10 p-16 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Enterprise Ready
          </div>

          <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-8">
            Start scaling your{" "}
            <span className="text-indigo-600">customer success</span> today.
          </h1>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-100">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">
                  Free 14-day trial
                </h4>
                <p className="text-sm text-slate-500">
                  Full access to all CRM modules. No credit card required.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-100">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">
                  Secure Cloud Storage
                </h4>
                <p className="text-sm text-slate-500">
                  ISO 27001 certified data protection for your leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2 text-sm uppercase font-medium tracking-wide">
              Join 5,000+ growing businesses
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
              {message} {countdown !== null && `Redirecting in ${countdown}s...`}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Work Email
              </label>
              <div className="relative group">
                {formData.email && !validationErrors.email ? (
    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
  ) : (
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                /> )}
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
    Secure Password
  </label>
  
  {/* Container for Icon + Input ONLY */}
  <div className="relative group">
    {formData.password && !validationErrors.password ? (
      <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
    ) : (
      <Lock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
        size={18}
      />
    )}
    <input
      type="password"
      name="password"
      required
      value={formData.password}
      onChange={handleChange}
      placeholder="••••••••"
      className={`w-full bg-slate-50/50 border rounded-lg pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-300 ${
        formData.password && !validationErrors.password 
          ? "border-emerald-500 ring-4 ring-emerald-500/5" 
          : "border-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500"
      }`}
    />
  </div>

  {/* Strength Meter - Moved OUTSIDE the relative div */}
  {formData.password && (
    <div className="mt-3">
      <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`transition-all duration-500 ${getStrengthColor(strength)}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
      <p className="text-[10px] uppercase font-bold mt-1 text-slate-400 tracking-wider">
        Strength: {['Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Too Short'}
      </p>
    </div>
  )}

  {validationErrors.password && (
    <p className="text-red-500 text-xs mt-1 ml-1">
      {validationErrors.password}
    </p>
  )}
</div>
            <div className="flex items-start gap-3 py-2">
  <input 
    type="checkbox" 
    id="terms" 
    required
    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" 
  />
  <label htmlFor="terms" className="text-sm text-slate-500 leading-tight cursor-pointer">
    By clicking, you agree to the{" "}
    <Link 
      to="/terms" 
      className="text-indigo-600 font-semibold hover:underline underline-offset-4"
    >
      Terms of Service
    </Link>{" "}
    and{" "}
    <Link 
      to="/privacy" 
      className="text-indigo-600 font-semibold hover:underline underline-offset-4"
    >
      Privacy Policy
    </Link>.
  </label>
</div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || hasValidationErrors}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && !message ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  "Create My Account"
                )}
              </button>
            </div>

                <div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-slate-200"></div>
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white px-3 text-slate-500">Or</span>
  </div>
</div>

<div className="flex justify-center">
  <GoogleSignInButton
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleError}
    text="signup_with"
  />
</div>
            
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;