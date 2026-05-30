import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldAlert, Award, ChevronRight, MapPin, CheckSquare, Clock, Send, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VolunteerDashboard() {
  const { api, user, triggerToast, fetchNotifications, refreshUserProfile } = useApp();

  const [available, setAvailable] = useState([]);
  const [active, setActive] = useState([]);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/volunteer/tasks/');
      setAvailable(res.data.available_tasks);
      setActive(res.data.active_tasks);
      
      if (res.data.active_tasks.length > 0 && !selectedTask) {
        setSelectedTask(res.data.active_tasks[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimTask = async (taskId) => {
    try {
      const res = await api.post(`/volunteer/tasks/${taskId}/claim/`);
      triggerToast('Rescue task claimed! En route to pickup coordinate.', 'success');
      fetchTasks();
      setSelectedTask(res.data);
    } catch (err) {
      triggerToast(err.response?.data?.error || 'Task claiming failed.', 'rose');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await api.post(`/volunteer/tasks/${taskId}/status/`, { status: newStatus });
      triggerToast(newStatus === 'picked_up' ? 'Food picked up! Delivery en route.' : 'Status updated.', 'success');
      fetchTasks();
      setSelectedTask(res.data);
    } catch (err) {
      triggerToast('Status update failed.', 'rose');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length !== 6) {
      triggerToast('Please input a valid 6-digit security code.', 'warning');
      return;
    }

    setVerifying(true);
    try {
      const res = await api.post(`/volunteer/tasks/${selectedTask.id}/verify-otp/`, { otp_code: otpValue });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#10B981', '#34D399', '#059669']
      });

      triggerToast(res.data.message, 'success');
      setPointsEarned(res.data.points_awarded);
      setOtpValue('');
      setSelectedTask(null);
      fetchTasks();
      fetchNotifications();
      refreshUserProfile();
    } catch (err) {
      triggerToast(err.response?.data?.error || 'Invalid OTP code. Delivery validation failed.', 'rose');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-screen bg-[#FAFDFB] text-slate-800">
      
      {/* Dynamic Header */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Volunteer Radar</h1>
          <p className="text-sm text-slate-400 mt-1 font-bold">Claim local food rescue missions and earn sustainability points.</p>
        </div>

        {/* Level indicator */}
        <div className="flex items-center space-x-3 bg-eco-mint/15 text-eco-emerald px-4.5 py-2.5 rounded-full border border-eco-mint/20">
          <Zap className="w-5 h-5 text-eco-emerald animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-bold leading-none mb-0.5 uppercase tracking-wider">Active XP Rank</span>
            <span className="text-sm font-black text-eco-emerald">{user.volunteer_points} XP</span>
          </div>
        </div>
      </div>

      {/* Confetti Success Dialog popup */}
      <AnimatePresence>
        {pointsEarned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="glass-panel p-8 rounded-3xl border-eco-emerald/20 shadow-2xl bg-white text-center max-w-sm space-y-6 relative overflow-hidden"
            >
              <span className="text-6xl block animate-bounce">🏆</span>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Rescue Completed!</h3>
                <p className="text-xs text-slate-400 mt-2 font-bold leading-relaxed">
                  Delivery authenticated successfully using OTP security code handshake. You saved surplus items from going to waste!
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 py-4.5 rounded-2xl">
                <span className="text-[10px] text-eco-emerald font-black block uppercase tracking-widest">Reward XP Earned</span>
                <span className="text-4xl font-black text-eco-emerald font-mono">+{pointsEarned} XP</span>
              </div>

              <button
                onClick={() => setPointsEarned(null)}
                className="w-full py-3 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold rounded-xl transition-all hover:scale-[1.01] shadow-sm"
              >
                Return to Radar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Side: Tasks Radar (Available and Active) */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Active Tasks claimed by this volunteer */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Claimed Missions</h3>
            {active.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl border-slate-100 text-center bg-white shadow-soft-card">
                <p className="text-xs text-slate-400 font-bold">No claimed rescue tasks active right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {active.map((task, idx) => {
                  const isSelected = selectedTask?.id === task.id;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedTask(task)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                        isSelected ? 'bg-eco-mint/5 border-eco-emerald' : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-extrabold text-sm text-slate-700">{task.donation_details.food_name}</span>
                          <span className="text-[10px] text-eco-emerald font-extrabold block mt-1 uppercase tracking-wider">
                            From: {task.donation_details.donor_name}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                          task.status === 'picked_up' ? 'bg-orange-50 text-eco-orange border-orange-200/50 animate-pulse' :
                          'bg-emerald-50 text-eco-emerald border-emerald-200/50 animate-pulse'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1 font-bold">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Delivery Target NGO: {task.ngo_details?.name || 'Assigned NGO Hub'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Yield Quantity: {task.donation_details.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available local unassigned tasks radar */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Local Rescue Tasks</h3>
            {available.length === 0 ? (
              <div className="glass-panel p-8 rounded-3xl border-slate-100 text-center bg-white shadow-soft-card">
                <span className="text-3xl block mb-1 animate-pulse">📡</span>
                <p className="text-xs text-slate-400 font-bold">Scanning coordinates... No new unclaimed tasks found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {available.map((task, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-3xl border-slate-100 space-y-4 bg-white hover:border-slate-200 transition-all shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-sm text-slate-700">{task.donation_details.food_name}</span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1.5 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>From: {task.donation_details.donor_name}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase border ${
                        task.donation_details.urgency_level === 'High' ? 'bg-red-50 text-red-600 border-red-200/50' :
                        'bg-slate-50 text-slate-400 border border-slate-200/50'
                      }`}>
                        {task.donation_details.urgency_level}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 font-bold">
                      <div>Quantity: {task.donation_details.quantity}</div>
                      <div>Target shelter: {task.ngo_details?.name} ({task.ngo_details?.location})</div>
                    </div>

                    <button
                      onClick={() => handleClaimTask(task.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all hover:scale-[1.01] shadow-sm"
                    >
                      Accept Rescue Mission
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Active Rescue Workflow details & OTP Lock */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {selectedTask ? (
              <motion.div
                key={selectedTask.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-6 rounded-3xl border-eco-border/40 shadow-soft-card bg-white space-y-6"
              >
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-widest text-[10px]">Mission Control Log</h4>
                  <span className="text-[9px] uppercase bg-eco-mint/10 text-eco-emerald px-2 py-0.5 rounded font-black border border-eco-mint/20">Active</span>
                </div>

                {/* Workflow stepper nodes */}
                <div className="py-4">
                  <div className="flex justify-between items-center relative">
                    
                    {/* Background track line */}
                    <div className="absolute left-3 right-3 h-0.5 bg-slate-100 z-0" />
                    
                    {[
                      { status: 'assigned', label: 'Claimed' },
                      { status: 'picked_up', label: 'Picked Up' },
                      { status: 'completed', label: 'Handover' }
                    ].map((step, idx) => {
                      const isActive = selectedTask.status === step.status;
                      const isDone = 
                        (step.status === 'assigned' && ['assigned', 'picked_up', 'completed'].includes(selectedTask.status)) ||
                        (step.status === 'picked_up' && ['picked_up', 'completed'].includes(selectedTask.status)) ||
                        (step.status === 'completed' && selectedTask.status === 'completed');
                      
                      return (
                        <div key={idx} className="flex flex-col items-center relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                            isDone ? 'bg-gradient-to-r from-eco-emerald to-eco-teal text-white border-2 border-eco-emerald shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] mt-2 font-black ${isDone ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Action Guidelines buttons */}
                <div className="space-y-4">
                  
                  {selectedTask.status === 'assigned' && (
                    <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl text-xs space-y-3.5">
                      <p className="text-slate-600 font-bold leading-relaxed">
                        Proceed to the donor facility located at <span className="font-extrabold text-eco-sage">{selectedTask.donation_details.donor_name}</span> center. Collect the food item surplus packages.
                      </p>
                      <button
                        onClick={() => handleUpdateStatus(selectedTask.id, 'picked_up')}
                        className="w-full py-3 bg-gradient-to-r from-eco-orange to-orange-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
                      >
                        Confirm Items Picked Up
                      </button>
                    </div>
                  )}

                  {selectedTask.status === 'picked_up' && (
                    <div className="space-y-4">
                      
                      {/* OTP handover block */}
                      <form onSubmit={handleVerifyOtp} className="glass-panel border-emerald-200/50 p-5 rounded-2xl bg-emerald-50/20 shadow-sm space-y-4 text-xs">
                        <div className="flex items-center space-x-1.5 text-eco-emerald mb-1">
                          <Award className="w-4 h-4 text-eco-emerald animate-pulse" />
                          <h5 className="font-black uppercase tracking-widest text-[10px]">Secure Handover Key</h5>
                        </div>
                        <p className="text-slate-500 font-bold leading-relaxed">
                          Once arrived at the <span className="font-extrabold text-eco-sage">{selectedTask.ngo_details?.name}</span> shelter, obtain the unique 6-digit security OTP code from the NGO dispatch dashboard to authenticate delivery closure.
                        </p>
                        
                        <div className="flex space-x-3.5">
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            placeholder="Enter 6-digit OTP code"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-center tracking-widest font-black text-sm focus:border-eco-emerald outline-none text-eco-sage font-mono shadow-inner"
                          />
                          <button
                            type="submit"
                            disabled={verifying}
                            className="px-5 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold uppercase rounded-xl transition-all shadow-sm"
                          >
                            Verify
                          </button>
                        </div>
                      </form>

                    </div>
                  )}

                </div>

              </motion.div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl border-slate-100 bg-white text-center min-h-[300px] flex flex-col items-center justify-center shadow-soft-card">
                <Trophy className="w-10 h-10 text-slate-300 mb-3 animate-pulse" />
                <h4 className="font-extrabold text-slate-700">Mission Details Cockpit</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-bold">
                  Select an active rescue task from your dashboard checklist queue. Dynamic route tracks, stepper milestones, and OTP verification nodes will populate here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
