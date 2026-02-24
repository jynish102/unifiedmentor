import { useState,useEffect } from "react";
import logo from "../assets/logo2.png";
import {Eye, EyeOff} from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    // Trigger shake only when confirmPassword changes
    if (
      name === "confirmPassword" &&
      updatedForm.password !== value &&
      value !== ""
    ) {
      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 400);
    }
  };

  {/*======================password======================== */}
  const getPasswordStrength = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const passedRules = Object.values(rules).filter(Boolean).length;

    let strength = "Weak";
    if (passedRules >= 4) strength = "Medium";
    if (passedRules === 5) strength = "Strong";

    return { strength, rules, passedRules };
  };

  {/*======================checkpassword======================== */  }
  const passwordsMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;

  {/*======================shake if passwords do not match======================== */}
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setShake(true);

      const timer = setTimeout(() => {
        setShake(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [formData.confirmPassword, formData.password]);  
    {/*======================emaill validation======================== */}
   const validateEmail = (email) => {
     const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
     return emailRegex.test(email);
   };
    const emailIsValid = validateEmail(formData.email);

  
  {/*======================phone validation======================== */}
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  const phoneIsValid = validatePhone(formData.phone);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Glass Form Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">
          <img src={logo} alt="Logo" className="mx-auto w-24 mb-4" />

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Create Your Account
          </h2>

          <form className="space-y-4">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border focus:outline-none focus:ring-2 transition ${
                formData.email
                  ? emailIsValid
                    ? "border-green-400 focus:ring-green-400"
                    : "border-red-500 focus:ring-red-400"
                  : "border-white/30 focus:ring-purple-400"
              }`}
            />
            {formData.email && (
              <p
                className={`mt-2 text-sm ${
                  emailIsValid ? "text-green-400" : "text-red-400"
                }`}
              >
                {emailIsValid
                  ? "✓ Valid email address"
                  : "✗ Email must be lowercase and valid format"}
              </p>
            )}

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                handleChange({
                  target: { name: "phone", value: onlyNumbers },
                });
              }}
              placeholder="Phone Number"
              maxLength={10}
              className={`w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border focus:outline-none focus:ring-2 transition ${
                formData.phone
                  ? phoneIsValid
                    ? "border-green-400 focus:ring-green-400"
                    : "border-red-500 focus:ring-red-400"
                  : "border-white/30 focus:ring-purple-400"
              }`}
            />
            {formData.phone && (
              <p
                className={`mt-2 text-sm ${
                  phoneIsValid ? "text-green-400" : "text-red-400"
                }`}
              >
                {phoneIsValid
                  ? "✓ Valid phone number"
                  : "✗ Phone number must be exactly 10 digits"}
              </p>
            )}

            <select
              name="role"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option className="text-black">Select Role</option>
              <option className="text-black">Buyer</option>
              <option className="text-black">Seller</option>
              <option className="text-black">Agent</option>
            </select>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {formData.password &&
                (() => {
                  const { strength, rules } = getPasswordStrength(
                    formData.password,
                  );

                  return (
                    <div className="mt-2 text-sm text-white">
                      {/* Strength Bar */}
                      <div className="w-full h-2 bg-white/20 rounded-full mb-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            strength === "Weak"
                              ? "bg-red-500 w-1/3"
                              : strength === "Medium"
                                ? "bg-yellow-400 w-2/3"
                                : "bg-green-500 w-full"
                          }`}
                        />
                      </div>

                      <p className="mb-1 font-semibold">Strength: {strength}</p>

                      <ul className="space-y-1 text-xs">
                        <li
                          className={
                            rules.length ? "text-green-400" : "text-red-400"
                          }
                        >
                          • At least 8 characters
                        </li>
                        <li
                          className={
                            rules.uppercase ? "text-green-400" : "text-red-400"
                          }
                        >
                          • One uppercase letter
                        </li>
                        <li
                          className={
                            rules.lowercase ? "text-green-400" : "text-red-400"
                          }
                        >
                          • One lowercase letter
                        </li>
                        <li
                          className={
                            rules.number ? "text-green-400" : "text-red-400"
                          }
                        >
                          • One number
                        </li>
                        <li
                          className={
                            rules.special ? "text-green-400" : "text-red-400"
                          }
                        >
                          • One special character
                        </li>
                      </ul>
                    </div>
                  );
                })()}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <div className={`relative ${shake ? "shake" : ""}`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/20 text-white placeholder-white/70 border focus:outline-none focus:ring-2 ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-white/30 focus:ring-purple-400"
                  }`}
                />

                {/* Toggle button here */}
              </div>
              {formData.confirmPassword && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    passwordsMatch ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {passwordsMatch
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!emailIsValid || !passwordsMatch || !phoneIsValid}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                passwordsMatch
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Register
            </button>
            <div className="text-center mt-6 text-sm text-white/80">
              Already have an account?{" "}
              <Link
                to="/Login"
                className="text-purple-300 font-semibold hover:text-purple-400 transition"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
