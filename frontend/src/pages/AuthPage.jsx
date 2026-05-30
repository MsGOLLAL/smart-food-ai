import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, User as UserIcon, Phone, MapPin, Building, ShieldCheck, Heart } from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [role, setRole] = useState('donor');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [ngoCapacity, setNgoCapacity] = useState('Medium');

  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'donor') {
      setLatitude('12.9716');
      setLongitude('77.5946');
    } else if (selectedRole === 'ngo') {
      setLatitude('12.9830');
      setLongitude('77.5820');
    } else {
      setLatitude('12.9680');
      setLongitude('77.6010');
    }
  };

  const getDashboardPath = (userRole) => {
    switch (userRole) {
      case 'donor': return '/donor-dashboard';
      case 'ngo': return '/ngo-dashboard';
      case 'volunteer': return '/volunteer-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginTab) {
      const res = await login(username, password);
      setLoading(false);
      if (res.success) {
        navigate(getDashboardPath(res.user.role));
      }
    } else {
      const payload = {
        username,
        password,
        email,
        role,
        phone_number: phone,
        location_name: locationName || 'Central Area',
        latitude: parseFloat(latitude) || 12.9716,
        longitude: parseFloat(longitude) || 77.5946,
        ngo_capacity: role === 'ngo' ? ngoCapacity : null
      };
      
      const res = await register(payload);
      setLoading(false);
      if (res.success) {
        setIsLoginTab(true);
      }
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 flex items-center justify-center px-4 overflow-hidden bg-[#FAFDFB]">
      
      {/* Background soft glows */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-eco-mint/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-eco-teal/5 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-panel p-8 rounded-3xl border-eco-border/40 shadow-xl relative z-10 bg-white/95"
      >
        
        {/* Auth Tabs */}
        <div className="flex justify-center mb-8 bg-slate-50 p-1.5 rounded-full border border-slate-100 max-w-[280px] mx-auto shadow-inner">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-full transition-all ${
              isLoginTab ? 'bg-gradient-to-r from-eco-emerald to-eco-teal text-white shadow-md' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-full transition-all ${
              !isLoginTab ? 'bg-gradient-to-r from-eco-emerald to-eco-teal text-white shadow-md' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
            {isLoginTab ? 'Access Smart Food Portal' : 'Register Core Identity Profile'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-bold">
            {isLoginTab ? 'Welcome back! Enter credentials' : 'Choose your node role and details'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* Dynamic Role Cards Selection for Sign Up */}
          {!isLoginTab && (
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Network Node Role</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'donor', title: 'Donor', emoji: '🏢', desc: 'Hotel/Restaurant' },
                  { id: 'ngo', title: 'NGO', emoji: '🏫', desc: 'Shelter/Food bank' },
                  { id: 'volunteer', title: 'Volunteer', emoji: '🚚', desc: 'Rescue Courier' },
                  { id: 'admin', title: 'Admin', emoji: '🛡️', desc: 'Control Center' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleSelect(item.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center group ${
                      role === item.id 
                        ? 'bg-eco-mint/5 border-eco-emerald shadow-md shadow-emerald-500/5' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-black text-slate-700">{item.title}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 leading-none font-bold">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields container */}
          <div className="grid md:grid-cols-2 gap-5.5">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                <UserIcon className="w-3.5 h-3.5 text-eco-emerald" />
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter unique ID"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white focus:ring-1 focus:ring-eco-emerald outline-none text-slate-800 transition-colors font-medium shadow-inner"
              />
            </div>

            {/* Email (Signup only) */}
            {!isLoginTab ? (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-eco-emerald" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white focus:ring-1 focus:ring-eco-emerald outline-none text-slate-800 transition-colors font-medium shadow-inner"
                />
              </div>
            ) : null}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-eco-emerald" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔐 SECURITY KEYS"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white focus:ring-1 focus:ring-eco-emerald outline-none text-slate-800 transition-colors font-medium shadow-inner"
              />
            </div>

            {/* Phone Number (Signup only) */}
            {!isLoginTab && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-eco-emerald" />
                  <span>Contact Number</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white focus:ring-1 focus:ring-eco-emerald outline-none text-slate-800 transition-colors font-medium shadow-inner"
                />
              </div>
            )}

            {/* Location (Signup only) */}
            {!isLoginTab && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-eco-emerald" />
                  <span>General Address</span>
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Indiranagar, Bangalore"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white focus:ring-1 focus:ring-eco-emerald outline-none text-slate-800 transition-colors font-medium shadow-inner"
                />
              </div>
            )}

            {/* NGO specific: capacity */}
            {!isLoginTab && role === 'ngo' && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-eco-emerald" />
                  <span>Distribution Capacity</span>
                </label>
                <select
                  value={ngoCapacity}
                  onChange={(e) => setNgoCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald outline-none text-slate-700 transition-colors font-bold shadow-inner"
                >
                  <option value="Small">Small (up to 50 meals)</option>
                  <option value="Medium">Medium (50 - 200 meals)</option>
                  <option value="Large">Large (200+ meals capacity)</option>
                </select>
              </div>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold text-sm uppercase tracking-widest rounded-xl hover:scale-[1.01] hover:shadow-lg transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Transmitting Data Node...' : (isLoginTab ? 'Authenticate Portal Access' : 'Construct Identity Node')}
          </button>

        </form>

      </motion.div>
    </div>
  );
}
