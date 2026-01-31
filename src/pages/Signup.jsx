import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft, FaGoogle, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { supabase } from '../utils/supabaseClient';

const Signup = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ REAL SUPABASE SIGNUP
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile in profiles table
        await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              name: formData.name || formData.email.split('@')[0],
              created_at: new Date().toISOString()
            }
          ]);

        setSuccess('Account created successfully! Redirecting to dashboard...');
        
        // Auto-login after signup
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (!loginError) {
  localStorage.setItem('userLoggedIn', 'true');
  setTimeout(() => {
    navigate('/resume-builder/dashboard'); // ✅ Ye change karo
  }, 1500);
}

      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ SOCIAL SIGNUP
  const handleSocialSignup = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* Back & Theme Toggle */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 hover:text-blue-500 transition text-sm md:text-base">
          <FaArrowLeft /> <span>Back to Home</span>
        </Link>
        <button
          onClick={toggleDarkMode}
          className={`p-2 md:p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Signup Card */}
      <div className={`w-full max-w-md rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <IoDocumentTextOutline className="text-4xl md:text-5xl text-blue-500 mb-3 md:mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold">Create ResumePro Account</h1>
          <p className={`mt-1 md:mt-2 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Build professional resumes in minutes
          </p>
        </div>

        {/* Success & Error Messages */}
        {success && (
          <div className={`mb-4 p-3 md:p-4 rounded-lg text-sm md:text-base ${darkMode 
            ? 'bg-green-900/30 text-green-200 border border-green-800/50' 
            : 'bg-green-50 text-green-700 border border-green-200'}`}
          >
            {success}
          </div>
        )}

        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm md:text-base ${darkMode 
            ? 'bg-red-900/30 text-red-200 border border-red-800/50' 
            : 'bg-red-50 text-red-700 border border-red-200'}`}
          >
            {error}
          </div>
        )}

        {/* Social Signup */}
        <div className="mb-6 md:mb-8">
          <p className="text-center mb-3 md:mb-4 text-sm md:text-base text-gray-500">Sign up with</p>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button 
              onClick={() => handleSocialSignup('google')}
              className={`py-2 md:py-3 rounded-xl flex items-center justify-center space-x-2 transition ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FcGoogle className="text-xl md:text-2xl" />
              <span className="text-sm md:text-base">Google</span>
            </button>
            <button 
              onClick={() => handleSocialSignup('github')}
              className={`py-2 md:py-3 rounded-xl flex items-center justify-center space-x-2 transition ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaGithub className="text-xl md:text-2xl" />
              <span className="text-sm md:text-base">GitHub</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4 md:my-6">
          <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <span className={`px-3 md:px-4 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            or with email
          </span>
          <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleEmailSignup}>
          {/* Name Field */}
          <div className="mb-3 md:mb-4">
            <label className="block mb-2 font-medium text-sm md:text-base">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full p-3 md:p-4 rounded-xl border-2 transition text-sm md:text-base ${darkMode 
                ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:bg-gray-800' 
                : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:bg-white'}`}
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div className="mb-3 md:mb-4">
            <label className="block mb-2 font-medium text-sm md:text-base">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-3 md:p-4 rounded-xl border-2 transition text-sm md:text-base ${darkMode 
                ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:bg-gray-800' 
                : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:bg-white'}`}
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 md:mb-4">
            <label className="block mb-2 font-medium text-sm md:text-base">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full p-3 md:p-4 rounded-xl border-2 transition pr-12 text-sm md:text-base ${darkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:bg-gray-800' 
                  : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:bg-white'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 md:mb-6">
            <label className="block mb-2 font-medium text-sm md:text-base">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full p-3 md:p-4 rounded-xl border-2 transition pr-12 text-sm md:text-base ${darkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-blue-500 focus:bg-gray-800' 
                  : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:bg-white'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-6 md:mb-8">
            <label className="flex items-start space-x-2 md:space-x-3 cursor-pointer text-xs md:text-sm">
              <input 
                type="checkbox" 
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 md:mt-1 rounded accent-blue-500" 
                required 
              />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                I agree to the{' '}
                <Link to="/terms" className={`underline hover:text-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className={`underline hover:text-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 
              hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
              ${darkMode 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 md:mt-8 text-sm md:text-base">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{' '}
          </span>
          <Link 
            to="/login" 
            className={`font-bold hover:text-blue-500 transition ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;