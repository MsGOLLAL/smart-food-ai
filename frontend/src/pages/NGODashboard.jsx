import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Map, Clock, Phone, AlertTriangle, ChevronRight, Inbox, Compass, Users } from 'lucide-react';

// Custom Leaflet pins using SVG shapes configured in premium Light settings
const donorIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 rounded-full bg-emerald-55 bg-white border-2 border-emerald-500 flex items-center justify-center shadow-lg animate-pulse"><span class="text-xs">🏢</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const ngoIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 rounded-full bg-white border-2 border-eco-sage flex items-center justify-center shadow-lg"><span class="text-xs">🏫</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const volunteerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 rounded-full bg-white border-2 border-eco-orange flex items-center justify-center shadow-lg animate-bounce"><span class="text-xs">🚚</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function NGODashboard() {
  const { api, user, triggerToast } = useApp();
  const [incoming, setIncoming] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchIncoming = async () => {
    try {
      const res = await api.get('/ngo/incoming/');
      setIncoming(res.data);
      if (res.data.length > 0 && !selectedItem) {
        setSelectedItem(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncoming();
    const interval = setInterval(fetchIncoming, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const getCoordinates = (lat, lng) => {
    const defaultLat = 12.9716;
    const defaultLng = 77.5946;
    return [parseFloat(lat) || defaultLat, parseFloat(lng) || defaultLng];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 min-h-screen bg-[#FAFDFB] text-slate-800">
      
      <div className="border-b border-gray-100 pb-6 mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">NGO Dispatch Cockpit</h1>
        <p className="text-sm text-slate-400 mt-1 font-bold">Manage active food rescue dispatches and authenticate secure deliveries.</p>
      </div>

      {incoming.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border-eco-border/40 bg-white max-w-2xl mx-auto shadow-soft-card">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
          <h4 className="font-extrabold text-slate-700">Radar Terminal Sleep State</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-bold">
            No incoming food surpluses matched to your center's zone currently. You will receive real-time notifications on the active panel once matching donor items appear nearby.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 text-left">
          
          {/* Incoming Items Side List */}
          <div className="lg:col-span-4 space-y-4 max-h-[650px] overflow-y-auto pr-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Surplus Queue Radar</h3>
            {incoming.map((item, idx) => {
              const active = selectedItem?.donation.id === item.donation.id;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                    active 
                      ? 'bg-eco-mint/5 border-eco-emerald shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-extrabold text-sm text-slate-700 group-hover:text-eco-sage">{item.donation.food_name}</span>
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                      item.donation.urgency_level === 'High' ? 'bg-red-50 text-red-600 border border-red-200/50 animate-pulse' :
                      'bg-slate-50 text-slate-400 border border-slate-200/50'
                    }`}>
                      {item.donation.urgency_level}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1 font-semibold">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Prep time: {new Date(item.donation.preparation_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span>Est. Distance: {item.match_details.distance_km} km</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3.5 mt-3.5 text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Status Index</span>
                    <span className={`font-black uppercase tracking-wider ${
                      item.donation.status === 'completed' ? 'text-eco-emerald' :
                      item.donation.status === 'pending' ? 'text-slate-400' : 'text-eco-emerald animate-pulse'
                    }`}>
                      {item.donation.status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Routing Map and Logistics Stats */}
          {selectedItem && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Premium Light Styled Map */}
              <div className="h-96 rounded-3xl overflow-hidden border border-slate-100 shadow-lg relative z-10">
                <MapContainer 
                  center={getCoordinates(selectedItem.donation.latitude, selectedItem.donation.longitude)} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  {/* Clean Positron Light Tiles */}
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  />
                  
                  <Marker 
                    position={getCoordinates(selectedItem.donation.latitude, selectedItem.donation.longitude)}
                    icon={donorIcon}
                  >
                    <Popup>
                      <div className="text-xs text-slate-800 font-semibold p-1">
                        <p className="font-extrabold text-eco-sage">Donor: {selectedItem.donation.donor_name}</p>
                        <p className="mt-0.5 text-slate-600">Food: {selectedItem.donation.food_name}</p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker 
                    position={getCoordinates(user.latitude, user.longitude)}
                    icon={ngoIcon}
                  >
                    <Popup>
                      <div className="text-xs text-slate-800 font-semibold p-1">
                        <p className="font-extrabold text-eco-sage">My NGO Hub: {user.username}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {selectedItem.task && selectedItem.task.volunteer_name && (
                    <Marker 
                      position={getCoordinates(
                        (parseFloat(selectedItem.donation.latitude) + parseFloat(user.latitude)) / 2 + 0.002,
                        (parseFloat(selectedItem.donation.longitude) + parseFloat(user.longitude)) / 2 - 0.002
                      )}
                      icon={volunteerIcon}
                    >
                      <Popup>
                        <div className="text-xs text-slate-800 font-semibold p-1">
                          <p className="font-extrabold text-eco-sage">Volunteer: {selectedItem.task.volunteer_name}</p>
                          <p className="mt-0.5 text-slate-600">Status: {selectedItem.task.status}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  <Polyline 
                    positions={[
                      getCoordinates(selectedItem.donation.latitude, selectedItem.donation.longitude),
                      getCoordinates(user.latitude, user.longitude)
                    ]}
                    color="#059669"
                    weight={3}
                    opacity={0.8}
                    dashArray="6, 12"
                  />

                </MapContainer>
              </div>

              {/* Delivery and OTP Details Card */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Logistics Stats */}
                <div className="glass-panel p-6 rounded-3xl border-eco-border/40 shadow-soft-card bg-white space-y-4">
                  <h4 className="font-extrabold text-slate-700 border-b border-gray-100 pb-2 uppercase tracking-widest text-[10px]">Dispatch Metrics</h4>
                  
                  <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Matched Distance</span>
                      <span className="text-slate-800 font-extrabold">{selectedItem.match_details.distance_km} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Calculated ETA</span>
                      <span className="text-slate-800 font-extrabold">{selectedItem.match_details.eta_minutes} Mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assigned Volunteer</span>
                      <span className="text-eco-emerald font-extrabold flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-eco-emerald mr-1" />
                        <span>{selectedItem.task && selectedItem.task.volunteer_name ? selectedItem.task.volunteer_name : 'Awaiting claim...'}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <span className="text-slate-400">Donor Contact</span>
                      <span className="text-slate-800 font-extrabold flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 mr-1" />
                        <span>{selectedItem.donation.donor_phone || '+91 98845 22000'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Handover OTP Verification Shield */}
                <div className="glass-panel p-6 rounded-3xl border-emerald-250 bg-emerald-50/20 shadow-soft-card space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5 text-eco-emerald mb-2">
                      <ShieldCheck className="w-4 h-4 text-eco-emerald animate-pulse" />
                      <h4 className="font-extrabold text-slate-700 uppercase tracking-widest text-[10px]">Handover Key (OTP)</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-3">
                      Share this unique security verification code with the rescue volunteer once they arrive at your center with the food listing items.
                    </p>
                  </div>

                  <div className="text-center py-4 bg-white rounded-2xl border border-emerald-200/50 shadow-inner relative overflow-hidden">
                    <span className="text-3xl font-black tracking-widest text-eco-sage font-mono">{selectedItem.task?.otp_code || '------'}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
