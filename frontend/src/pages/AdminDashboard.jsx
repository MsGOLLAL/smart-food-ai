import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Users, Activity, BarChart2, Compass, AlertTriangle } from 'lucide-react';

const COLORS = ['#059669', '#10B981', '#34D399', '#F97316'];

export default function AdminDashboard() {
  const { api } = useApp();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard/');
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-screen flex items-center justify-center bg-[#FAFDFB]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-eco-emerald border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-black tracking-widest uppercase">Syncing Admin Command Grid...</p>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {
    meals_saved: 2450,
    co2_reduced_kg: 6125.4,
    active_rescues: 3,
    ngos_connected: 8,
    volunteers_count: 45
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-screen bg-[#FAFDFB] text-slate-800">
      
      {/* Header section */}
      <div className="border-b border-gray-100 pb-6 mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Admin Intelligence Center</h1>
        <p className="text-sm text-slate-400 mt-1 font-bold">Platform-wide carbon savings, volunteer metrics, and regional hot zones.</p>
      </div>

      {/* Grid widgets aggregated counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
        
        <div className="glass-panel p-6 rounded-3xl border-eco-border/40 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-eco-mint/5 blur-2xl pointer-events-none" />
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total Meals Distributed</span>
          <h3 className="text-2xl lg:text-3xl font-black text-eco-sage mt-1">{summary.meals_saved}+</h3>
          <div className="text-[9px] text-slate-400 mt-1 font-bold">Sustenance secured successfully</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-eco-border/40 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-eco-teal/5 blur-2xl pointer-events-none" />
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">CO₂ Emission Reduced</span>
          <h3 className="text-2xl lg:text-3xl font-black text-eco-emerald mt-1">{summary.co2_reduced_kg} kg</h3>
          <div className="text-[9px] text-slate-400 mt-1 font-bold">Greenhouse offset index</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-eco-border/40 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-eco-orange/5 blur-2xl pointer-events-none" />
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Active Rescues En Route</span>
          <h3 className="text-2xl lg:text-3xl font-black text-eco-orange mt-1">{summary.active_rescues} List</h3>
          <div className="text-[9px] text-slate-400 mt-1 font-bold">Couriers en route coordinates</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-eco-border/40 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-eco-rose/5 blur-2xl pointer-events-none" />
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Active Distribution Network</span>
          <h3 className="text-2xl lg:text-3xl font-black text-eco-sage mt-1">{summary.ngos_connected + summary.volunteers_count} Nodes</h3>
          <div className="text-[9px] text-slate-400 mt-1 font-bold">Registered NGOs and volunteers</div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 text-left">
        
        {/* Recharts Area Plot Chart (7 days trends) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border-eco-border/40 bg-white shadow-soft-card space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-widest text-xs flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-eco-emerald" />
              <span>Weekly Meals Rescue Timeline</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-bold">Live updating metrics</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weekly_rescue_timeline || []}>
                <defs>
                  <linearGradient id="colorRescued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                  labelStyle={{ color: '#065F46', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="rescued" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRescued)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart categories distribution */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border-eco-border/40 bg-white shadow-soft-card flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-2">
            <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-widest text-xs flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-eco-emerald" />
              <span>Food Categories</span>
            </h4>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categories_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics.categories_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Surplus Share</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] mt-4 font-bold">
            {(analytics.categories_distribution || []).map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-500 font-medium">{entry.name}</span>
                </div>
                <span className="text-slate-700">{entry.value} listings</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Volunteer Points scoreboards leaderboard */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border-eco-border/40 bg-white shadow-soft-card space-y-4">
          <h4 className="font-extrabold text-slate-700 border-b border-gray-100 pb-2 uppercase tracking-widest text-[10px]">Top Active Couriers Leaderboard</h4>
          
          <div className="space-y-3 pt-2">
            {(analytics.volunteers_leaderboard || []).map((vol, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-black text-eco-emerald text-sm">{idx + 1}.</span>
                  <span className="font-extrabold text-slate-700">{vol.username}</span>
                </div>
                <div className="flex items-center space-x-3 font-bold">
                  <span className="text-[9px] text-eco-emerald font-black bg-eco-mint/10 border border-eco-mint/20 px-2.5 py-0.5 rounded-full">{vol.badge}</span>
                  <span className="font-black text-eco-sage font-mono">{vol.points} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proximity Hotspots radar checklist logs */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border-eco-border/40 bg-white shadow-soft-card space-y-4">
          <h4 className="font-extrabold text-slate-700 border-b border-gray-100 pb-2 uppercase tracking-widest text-[10px]">Active Logistics Hotspots</h4>
          
          <div className="space-y-3 pt-2 overflow-y-auto max-h-[220px] pr-2">
            {(analytics.live_hotspots || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-bold">Scanning regional telemetry hotspots...</p>
            ) : (
              (analytics.live_hotspots || []).map((hot, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-[11px] font-bold">
                  <div>
                    <span className="font-extrabold text-slate-700 block">{hot.food_name}</span>
                    <span className="text-[9px] text-slate-400">Coord: {hot.lat.toFixed(4)}, {hot.lng.toFixed(4)}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                      hot.urgency === 'High' ? 'bg-red-50 text-red-600 border-red-200/50 animate-pulse' :
                      'bg-slate-50 text-slate-400 border border-slate-200/50'
                    }`}>
                      {hot.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 uppercase">{hot.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
