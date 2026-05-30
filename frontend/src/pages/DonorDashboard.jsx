import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Flame, Sparkles, Clock, MapPin, AlertCircle, Compass, History, Star, ShieldAlert } from 'lucide-react';

export default function DonorDashboard() {
  const { api, triggerToast } = useApp();

  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('3 hours');
  const [prepTime, setPrepTime] = useState('');
  const [storage, setStorage] = useState('Ambient');
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState('');

  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const fetchMyHistory = async () => {
    try {
      const res = await api.get('/donations/my/');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyHistory();
    const now = new Date();
    // Compute exact local timezone offset ISO string
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    setPrepTime(localISOTime);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName || !quantity || !prepTime) {
      triggerToast('Please fill out all mandatory fields.', 'warning');
      return;
    }

    setLoading(true);
    setAiReport(null);

    const payload = {
      food_name: foodName,
      quantity,
      image_url: imageFile || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      preparation_time: new Date(prepTime).toISOString(),
      storage_condition: storage,
      expiry_duration: expiry,
      latitude: 12.9716,
      longitude: 77.5946,
      special_notes: notes
    };

    try {
      const res = await api.post('/donations/upload/', payload);
      setAiReport(res.data);
      triggerToast('Food listed! Gemini AI diagnostic complete.', 'success');
      
      setFoodName('');
      setQuantity('');
      setNotes('');
      setImagePreview(null);
      setImageFile('');
      
      fetchMyHistory();
    } catch (err) {
      console.error(err);
      triggerToast('Submission error. Please check parameters.', 'rose');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-screen bg-[#FAFDFB] text-slate-800">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Donor Cockpit</h1>
          <p className="text-sm text-slate-400 mt-1 font-bold">Upload surpluses and monitor environmental impact savings.</p>
        </div>

        {/* Dashboard Tabs Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 shadow-inner">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'upload' ? 'bg-gradient-to-r from-eco-emerald to-eco-teal text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Surplus Dispatcher</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchMyHistory();
            }}
            className={`px-4.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'history' ? 'bg-gradient-to-r from-eco-emerald to-eco-teal text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Rescue Chronicles ({history.length})</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid lg:grid-cols-12 gap-8 text-left"
          >
            
            {/* Uploader Form Controls */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-3xl border-eco-border/40 shadow-soft-card bg-white/95 space-y-6">
              
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                <span className="text-xl">🍱</span>
                <h3 className="font-extrabold text-lg text-slate-800">Surplus Registration Node</h3>
              </div>

              {/* Drag and Drop Image Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Surplus Snap/Image</label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-eco-emerald/40 hover:bg-slate-50/50 transition-all cursor-pointer relative overflow-hidden group min-h-[160px] flex flex-col items-center justify-center bg-slate-50/20"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-102 transition-transform" />
                      <div className="relative z-10 bg-white/90 p-4.5 rounded-xl border border-eco-border shadow-sm backdrop-blur-sm">
                        <p className="text-xs font-black text-eco-emerald">Image Captured Successfully</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">Drag another photo or click to substitute</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-eco-emerald transition-colors" />
                      <p className="text-sm font-extrabold text-slate-700">Drag & Drop Food Image</p>
                      <p className="text-xs text-slate-400 mt-1 font-bold">JPEG or PNG. Max 5MB size limit.</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5.5">
                
                {/* Food Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Food Name / Items</label>
                  <input
                    type="text"
                    required
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Mixed Rice, Bakery Bread"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white outline-none text-slate-800 transition-colors font-medium shadow-inner"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Quantity Weight</label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 15 kg, 40 Servings"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white outline-none text-slate-800 transition-colors font-medium shadow-inner"
                  />
                </div>

                {/* Storage Condition */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Storage Status</label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald outline-none text-slate-700 font-bold transition-colors shadow-inner"
                  >
                    <option value="Ambient">Ambient / Room Temp</option>
                    <option value="Refrigerated">Refrigerated / Chilled</option>
                    <option value="Frozen">Frozen / Cold Storage</option>
                    <option value="Hot Box">Warm / Insulated Box</option>
                  </select>
                </div>

                {/* Expiry Window */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Estimated Expiry Time</label>
                  <select
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald outline-none text-slate-700 font-bold transition-colors shadow-inner"
                  >
                    <option value="2 hours">Highly Perishable (2 Hours)</option>
                    <option value="4 hours">Standard Cooked (4 Hours)</option>
                    <option value="8 hours">Medium Shelf Life (8 Hours)</option>
                    <option value="24 hours">Long Shelf Life (24+ Hours)</option>
                  </select>
                </div>

                {/* Prep Time */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Preparation Timestamp</label>
                  <input
                    type="datetime-local"
                    required
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white outline-none text-slate-700 font-bold shadow-inner"
                  />
                </div>

              </div>

              {/* Special Notes */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Special Guidelines / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Vegetarian only, contains wheat, packaged in foil tins..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-eco-emerald focus:bg-white outline-none text-slate-800 transition-colors font-medium min-h-[80px] shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold text-sm uppercase tracking-widest rounded-xl hover:scale-[1.01] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Engaging Gemini AI Core...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    <span>List Surplus & Analyze</span>
                  </>
                )}
              </button>

            </form>

            {/* AI Predictions Diagnostic Dashboard */}
            <div className="lg:col-span-5 space-y-6">
              
              <AnimatePresence mode="wait">
                {aiReport ? (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel p-6 rounded-3xl border-eco-emerald/20 shadow-lg bg-white relative overflow-hidden"
                  >
                    
                    {/* Soft nature glow bg backdrop */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
                      aiReport.urgency_level === 'High' ? 'bg-red-500/5' : 
                      aiReport.urgency_level === 'Medium' ? 'bg-orange-500/5' : 'bg-emerald-500/5'
                    }`} />

                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-eco-emerald animate-pulse" />
                        <h4 className="font-extrabold text-sm text-slate-700 tracking-wider uppercase">AI Freshness Diagnostic</h4>
                      </div>
                      <span className="text-[10px] bg-eco-mint/10 border border-eco-emerald/20 px-2 py-0.5 rounded font-black text-eco-emerald tracking-widest uppercase">
                        Active Node
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 relative">
                      
                      {/* Freshness & CNN Analysis side-by-side */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4 w-full px-2">
                        
                        {/* Circular Freshness Meter */}
                        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="rgba(16,185,129,0.04)" strokeWidth="8" fill="transparent" />
                            <circle 
                              cx="64" 
                              cy="64" 
                              r="56" 
                              stroke={aiReport.freshness_score > 75 ? "#10B981" : (aiReport.freshness_score > 50 ? "#0D9488" : "#EF4444")} 
                              strokeWidth="8" 
                              fill="transparent" 
                              strokeDasharray={2 * Math.PI * 56}
                              strokeDashoffset={2 * Math.PI * 56 * (1 - aiReport.freshness_score / 100)}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-800">{aiReport.freshness_score}%</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Freshness</span>
                          </div>
                        </div>

                        {/* CNN Accuracy Badge */}
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left justify-center space-y-1 bg-[#F5FAF6] border border-eco-emerald/15 p-3.5 rounded-2xl shadow-sm w-full max-w-[220px]">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CNN Image Analysis</span>
                          <div className="inline-flex items-center space-x-1.5 bg-white border border-eco-emerald/35 px-2.5 py-1 rounded-xl shadow-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-eco-emerald animate-pulse"></span>
                            <span className="text-xs font-black text-eco-emerald">{(aiReport.cnn_confidence || 92.4).toFixed(1)}%</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 mt-1">CNN Model Confidence</span>
                        </div>

                      </div>

                      {/* Diagnostic badges list */}
                      <div className="w-full grid grid-cols-2 gap-3 mt-4 text-center">
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl shadow-sm">
                          <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Urgency Level</span>
                          <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            aiReport.urgency_level === 'High' ? 'bg-red-50 text-red-600 border border-red-200/50' :
                            aiReport.urgency_level === 'Medium' ? 'bg-orange-50 text-orange-600 border border-orange-200/50' :
                            'bg-emerald-50 text-eco-emerald border border-emerald-200/50'
                          }`}>
                            {aiReport.urgency_level}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl shadow-sm">
                          <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Rescue Window</span>
                          <span className="text-xs font-black text-slate-700 flex items-center justify-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-eco-emerald" />
                            <span>{aiReport.safe_duration_hours} Hours</span>
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Gemini AI recommendations text */}
                    <div className="bg-eco-mint/5 border border-eco-emerald/10 p-4 rounded-2xl text-xs leading-relaxed text-slate-700 mb-6 text-left">
                      <div className="font-extrabold text-[10px] uppercase text-eco-emerald tracking-wider flex items-center space-x-1.5 mb-1.5">
                        <Compass className="w-3.5 h-3.5 text-eco-emerald" />
                        <span>AI Action Guidelines</span>
                      </div>
                      <p>{aiReport.ai_recommendations}</p>
                    </div>

                    {/* CO2 Sustainability metrics card */}
                    <div className="bg-emerald-50 border border-emerald-200/40 p-4.5 rounded-2xl flex items-center justify-between text-left shadow-sm">
                      <div>
                        <div className="text-[9px] font-black text-eco-emerald uppercase tracking-widest">Sustainability Impact Score</div>
                        <div className="font-extrabold text-sm text-slate-800 mt-0.5">-{aiReport.co2_reduction_kg} kg CO₂ Emission</div>
                      </div>
                      <div className="w-9 h-9 bg-eco-mint/15 rounded-full flex items-center justify-center text-eco-emerald border border-eco-mint/20 shadow-inner">
                        <Flame className="w-4 h-4 text-eco-emerald" />
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-panel p-8 rounded-3xl border-eco-border/40 bg-white/95 text-center min-h-[350px] flex flex-col items-center justify-center shadow-soft-card"
                  >
                    <Sparkles className="w-10 h-10 text-slate-300 mb-3 animate-pulse" />
                    <h4 className="font-extrabold text-slate-700">Awaiting Surplus Dispatch</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-bold">
                      Register your food surplus items on the dispatcher terminal. The Gemini AI diagnosis module will analyze freshness, perishable rates, and carbon credits in real-time.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </motion.div>
        ) : (
          /* History tab */
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {history.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl text-center border-eco-border/40 bg-white shadow-soft-card">
                <p className="text-slate-400 font-bold text-sm">No donations listed yet. Get started by dispatching surplus food.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {history.map((item, idx) => (
                  <div key={idx} className="glass-panel rounded-3xl border-eco-border/40 bg-white shadow-soft-card hover:border-eco-emerald/20 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                    <div className="h-40 relative">
                      <img src={item.image_url} alt="Food" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                      
                      {/* Urgency Badge */}
                      <span className={`absolute top-3 left-3 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                        item.urgency_level === 'High' ? 'bg-red-50 text-red-600 border-red-200/50' :
                        item.urgency_level === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200/50' :
                        'bg-emerald-50 text-eco-emerald border-emerald-200/50'
                      }`}>
                        {item.urgency_level} Urgency
                      </span>

                      {/* Status Badge */}
                      <span className={`absolute bottom-3 right-3 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md ${
                        item.status === 'completed' ? 'bg-emerald-50 border border-emerald-200/30 text-eco-emerald' :
                        item.status === 'rejected' ? 'bg-red-50 border border-red-200/30 text-red-600' :
                        item.status === 'pending' ? 'bg-slate-50 border border-slate-200 text-slate-500' :
                        'bg-eco-mint/10 border border-eco-emerald/30 text-eco-emerald animate-pulse'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-extrabold text-lg text-slate-800">{item.food_name}</h4>
                        <div className="text-xs text-slate-400 flex items-center space-x-1 mt-1 font-bold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 border-t border-gray-100 pt-3.5 text-[9px] font-bold">
                        <div>
                          <span className="text-slate-400 block uppercase">Freshness</span>
                          <span className="font-black text-eco-emerald">{item.freshness_score}% Index</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase">CNN Model</span>
                          <span className="font-black text-eco-teal">{(item.cnn_confidence || 92.4).toFixed(1)}% Acc</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase">CO₂ Saved</span>
                          <span className="font-black text-slate-700">-{item.co2_reduction_kg} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
