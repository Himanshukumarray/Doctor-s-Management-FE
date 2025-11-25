import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, User, Stethoscope, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    specialty: "",
    fee: "",
    qualification: "",
    experienceYears: "",
    licenseNumber: "",
    availability: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalHistory: "",
    allergies: "",
    insuranceProvider: "",
    insuranceNumber: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format";
      case "password":
        return value.length >= 6 ? "" : "Password must be at least 6 characters";
      case "phone":
        return /^\d{10}$/.test(value.replace(/\D/g, "")) ? "" : "Invalid phone number";
      case "age":
        return value > 0 && value < 150 ? "" : "Invalid age";
      case "name":
        return value.trim().length >= 2 ? "" : "Name must be at least 2 characters";
      default:
        return "";
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-orange-500" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return levels[strength - 1] || { strength: 0, label: "", color: "" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ ...formData, role: selectedRole });
    setTimeout(() => setStep(3), 300);
  };

  const handleContinueToRoleSelection = () => {
    const step1Fields = ["name", "email", "password"];
    const newErrors = {};

    step1Fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error || !formData[field]) {
        newErrors[field] = error || "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(step1Fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
      return;
    }

    setStep(2);
  };

  const handleSubmit = async () => {
    const requiredFields = ["age", "gender", "phone", "address"];
    const newErrors = {};

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error || !formData[field]) {
        newErrors[field] = error || "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      console.log("Signup Success:", data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Signup failed:", err);
      const errorMsg = err.message || "Signup failed. Please try again.";
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50" style={{
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Account created successfully!</span>
        </div>
      )}

      <div className="flex bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl">
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white w-2/5 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-5"></div>
          <div className="relative z-10 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-8 mb-8 inline-block">
              <Stethoscope className="w-24 h-24" />
            </div>
            <h2 className="text-4xl font-bold mb-4">My Discounted Labs</h2>
            <p className="text-blue-100 text-lg mb-8">Join our healthcare platform today</p>

            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'} font-semibold`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-white' : 'bg-white/20'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'} font-semibold`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-white' : 'bg-white/20'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'} font-semibold`}>
                3
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <span>Connect with verified healthcare professionals</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <span>Secure and confidential health records</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <span>24/7 access to medical assistance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/5 p-8 lg:p-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600 mb-8">
              {step === 1 && "Let's start with your basic information"}
              {step === 2 && "Choose your role"}
              {step === 3 && "Complete your profile"}
            </p>

            <div className="space-y-5">
              {step === 1 && (
                <div className="space-y-5" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.name && errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                      />
                      {touched.name && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {errors.name ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : formData.name ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {touched.name && errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="john@example.com"
                        className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.email && errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                      />
                      {touched.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {errors.email ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : formData.email ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.password && errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                        </p>
                      </div>
                    )}
                    {touched.password && errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleContinueToRoleSelection}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>


                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Back to {" "}
                      <Link
                        to="/"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <p className="text-center text-gray-600">Select your account type to continue</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRoleSelect("PATIENT")}
                      className="group relative p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <div className="bg-blue-100 group-hover:bg-blue-500 rounded-full p-6 inline-block mb-4 transition-all duration-300">
                        <User className="w-12 h-12 text-blue-600 group-hover:text-white transition-all duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Patient</h3>
                      <p className="text-gray-600 text-sm">I'm looking for healthcare services</p>
                    </button>

                    <button
                      onClick={() => handleRoleSelect("DOCTOR")}
                      className="group relative p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <div className="bg-blue-100 group-hover:bg-blue-500 rounded-full p-6 inline-block mb-4 transition-all duration-300">
                        <Stethoscope className="w-12 h-12 text-blue-600 group-hover:text-white transition-all duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Doctor</h3>
                      <p className="text-gray-600 text-sm">I'm a healthcare professional</p>
                    </button>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full text-gray-600 hover:text-gray-800 font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center gap-3 mb-4">
                    {role === "PATIENT" ? <User className="w-5 h-5 text-blue-600" /> : <Stethoscope className="w-5 h-5 text-blue-600" />}
                    <span className="text-blue-800 font-semibold">
                      Signing up as: {role === "PATIENT" ? "Patient" : "Doctor"}
                    </span>
                  </div>

                  <div className="space-y-5 overflow-y-auto max-h-[50vh] pr-2" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f1f1'
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="25"
                            className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.age && errors.age ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                          />
                          {touched.age && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {errors.age ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                              ) : formData.age ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {touched.age && errors.age && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.age}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Male/Female/Other"
                            className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.gender && errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                          />
                          {touched.gender && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {errors.gender ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                              ) : formData.gender ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {touched.gender && errors.gender && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="+1 (555) 123-4567"
                          className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.phone && errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        />
                        {touched.phone && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {errors.phone ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : formData.phone ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {touched.phone && errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="123 Main St, City, State"
                          className={`w-full pl-4 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.address && errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        />
                        {touched.address && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {errors.address ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : formData.address ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {touched.address && errors.address && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {role === "DOCTOR" && (
                      <div className="space-y-5">
                        <div className="border-t-2 border-blue-100 pt-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-blue-600" />
                            Professional Information
                          </h3>
                          <div className="space-y-5">
                            <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Specialty" className="w-full pl-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300" />
                            <input type="number" name="fee" value={formData.fee} onChange={handleChange} placeholder="Consultation Fee" className="w-full pl-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300" />
                            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" className="w-full pl-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300" />
                            <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} placeholder="Experience (Years)" className="w-full pl-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300" />
                            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="License Number" className="w-full pl-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300" />
                            <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="Availability" className="w-full pl-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300" />
                          </div>
                        </div>
                      </div>
                    )}

                    {role === "PATIENT" && (
                      <>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                          <input
                            type="text"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            placeholder="A+, O-, AB+, etc."
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                          <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            placeholder="Full name"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                          <input
                            type="text"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            placeholder="10-digit number"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                          <textarea
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            placeholder="Describe any past medical conditions"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                          <textarea
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="If any"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                          <input
                            type="text"
                            name="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={handleChange}
                            placeholder="Your insurance provider"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                          <input
                            type="text"
                            name="insuranceNumber"
                            value={formData.insuranceNumber}
                            onChange={handleChange}
                            placeholder="Insurance ID"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    {/* ------------------------ DOCTOR-SPECIFIC FIELDS ------------------------ */}
                    {role === "DOCTOR" && (
                      <>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                          <input
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            placeholder="Cardiology, Neurology, etc."
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee *</label>
                          <input
                            type="number"
                            name="fee"
                            value={formData.fee}
                            onChange={handleChange}
                            placeholder="500"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                          <input
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            placeholder="MBBS, MD, etc."
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
                          <input
                            type="number"
                            name="experienceYears"
                            value={formData.experienceYears}
                            onChange={handleChange}
                            placeholder="5"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            placeholder="Doctor license ID"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
                          <input
                            type="text"
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            placeholder="Mon–Fri, 10 AM – 5 PM"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full text-gray-600 hover:text-gray-800 font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;