/**
 * usePasswordStrength
 *
 * Evaluates password strength in real-time based on 5 criteria (length, uppercase,
 * lowercase, number, special). Returns score (0-5), level (Weak/Medium/Strong),
 * color classes, and individual check results.
 *
 * @param {string} password
 * @returns {Object} { score, level, label, color, barColor, checks, checkList }
 */

const CHECKS = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    key: "uppercase",
    label: "One uppercase letter (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    key: "lowercase",
    label: "One lowercase letter (a-z)",
    test: (p) => /[a-z]/.test(p),
  },
  {
    key: "number",
    label: "One number (0-9)",
    test: (p) => /[0-9]/.test(p),
  },
  {
    key: "special",
    label: "One special character (!@#…)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

/**
 * Pure function to evaluate password strength. Returns score, level, labels, and check results.
 * @param {string} password
 */
export function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      level: 0,
      label: "",
      color: "text-slate-400",
      barColor: "bg-slate-200",
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      },
      checkList: CHECKS.map((c) => ({ ...c, passed: false })),
    };
  }

  const checkList = CHECKS.map((c) => ({ ...c, passed: c.test(password) }));
  const score = checkList.filter((c) => c.passed).length;

  // Build the checks object (keyed by check.key)
  const checks = Object.fromEntries(checkList.map((c) => [c.key, c.passed]));

  let level, label, color, barColor;
  if (score <= 2) {
    level = 0;
    label = "Weak";
    color = "text-red-500";
    barColor = "bg-red-500";
  } else if (score <= 4) {
    level = 1;
    label = "Medium";
    color = "text-amber-500";
    barColor = "bg-amber-500";
  } else {
    level = 2;
    label = "Strong";
    color = "text-emerald-500";
    barColor = "bg-emerald-500";
  }

  return { score, level, label, color, barColor, checks, checkList };
}


function usePasswordStrength(password) {
  return evaluatePasswordStrength(password ?? "");
}

export default usePasswordStrength;
