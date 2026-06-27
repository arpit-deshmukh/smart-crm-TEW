/**
 * PasswordStrengthMeter
 * 
 * Real-time password strength indicator with segmented bars, color-coded label,
 * and criteria checklist.
 *
 * @param {string} password - Current password value
 * @param {string} [className] - Optional wrapper classes
 */

import usePasswordStrength from "../../hooks/usePasswordStrength";
import { CheckCircle2, XCircle } from "lucide-react";

/* ---------- segment bar ---------- */
const SEGMENTS = [
  { threshold: 0, activeColor: "bg-red-500",     label: "Weak"   },
  { threshold: 1, activeColor: "bg-amber-500",   label: "Medium" },
  { threshold: 2, activeColor: "bg-emerald-500", label: "Strong" },
];

const PasswordStrengthMeter = ({ password, className = "" }) => {
  const { level, label, color, checkList } = usePasswordStrength(password);

  // Hide meter when password field is empty
  if (!password) return null;

  return (
    <div className={`mt-3 space-y-2.5 ${className}`} aria-live="polite">

      {/* ── Segmented bars + label row ── */}
      <div className="flex items-center gap-3">
        {/* Three bar segments */}
        <div className="flex flex-1 gap-1.5" role="group" aria-label="Password strength bars">
          {SEGMENTS.map((seg, idx) => (
            <div
              key={seg.label}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  level >= idx ? seg.activeColor : "bg-transparent"
                }`}
                style={{ width: level >= idx ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>

        {/* Strength label */}
        <span
          className={`text-[11px] font-bold uppercase tracking-widest min-w-[46px] text-right transition-colors duration-300 ${color}`}
          aria-label={`Password strength: ${label}`}
        >
          {label}
        </span>
      </div>

      {/* ── Criteria checklist ── */}
      <ul className="grid grid-cols-1 gap-y-1" aria-label="Password requirements">
        {checkList.map((check) => (
          <li
            key={check.key}
            className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-200 ${
              check.passed ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {check.passed ? (
              <CheckCircle2
                size={12}
                className="shrink-0 text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <XCircle
                size={12}
                className="shrink-0 text-slate-300"
                aria-hidden="true"
              />
            )}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
