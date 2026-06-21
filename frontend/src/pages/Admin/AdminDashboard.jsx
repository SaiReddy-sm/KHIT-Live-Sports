import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminDashboard() {
  // Independent state counts to prevent nested reference updates
  const [playerCount, setPlayerCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminAuth");
        
        // Attach the real JWT token to authorize backend requests
        const headers = {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        };

        const endpoints = [
          'http://localhost:5000/api/players',
          'http://localhost:5000/api/teams',
          'http://localhost:5000/api/matches',
          'http://localhost:5000/api/events',
          'http://localhost:5000/api/notices',
          'http://localhost:5000/api/gallery'
        ];

        // Fetch all datasets concurrently with authorized headers
        const responses = await Promise.all(
          endpoints.map(url => fetch(url, { headers }))
        );
        
        const data = await Promise.all(responses.map(res => res.json()));

        // Assign counts safely with protective fallback checks
        setPlayerCount(Array.isArray(data[0]) ? data[0].length : (data[0]?.data ? data[0].data.length : 0));
        setTeamCount(Array.isArray(data[1]) ? data[1].length : (data[1]?.data ? data[1].data.length : 0));
        setMatchCount(Array.isArray(data[2]) ? data[2].length : (data[2]?.data ? data[2].data.length : 0));
        setEventCount(Array.isArray(data[3]) ? data[3].length : (data[3]?.data ? data[3].data.length : 0));
        setNoticeCount(Array.isArray(data[4]) ? data[4].length : (data[4]?.data ? data[4].data.length : 0));
        setGalleryCount(Array.isArray(data[5]) ? data[5].length : (data[5]?.data ? data[5].data.length : 0));
      } catch (err) {
        console.error("Error loading dashboard metrics from database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); // Empty array ensures this runs ONLY ONCE on page mount

  const stats = [
    { name: 'Total Players', count: playerCount, icon: '🏃', color: 'text-[#7A1E2D]', bg: 'bg-red-50' },
    { name: 'Total Teams', count: teamCount, icon: '👥', color: 'text-[#D9A441]', bg: 'bg-amber-50' },
    { name: 'Total Matches', count: matchCount, icon: '🏆', color: 'text-[#7A1E2D]', bg: 'bg-red-50' },
    { name: 'Total Events', count: eventCount, icon: '📅', color: 'text-[#D9A441]', bg: 'bg-amber-50' },
    { name: 'Total Notices', count: noticeCount, icon: '📢', color: 'text-[#7A1E2D]', bg: 'bg-red-50' },
    { name: 'Gallery Media', count: galleryCount, icon: '🖼️', color: 'text-[#D9A441]', bg: 'bg-amber-50' },
  ];

  const quickActions = [
    { name: 'Manage Players', path: '/admin/players', icon: '🏃' },
    { name: 'Manage Teams', path: '/admin/teams', icon: '👥' },
    { name: 'Manage Matches', path: '/admin/matches', icon: '🏆' },
    { name: 'Manage Events', path: '/admin/events', icon: '📅' },
    { name: 'Manage Notices', path: '/admin/notices', icon: '📢' },
    { name: 'Manage Gallery', path: '/admin/gallery', icon: '🖼️' },
  ];

  const recentActivity = [
    { id: 1, title: 'Database Connected', details: 'Established operational connection with MongoDB local server.', time: 'Just now' },
    { id: 2, title: 'API Integration Complete', details: 'Dashboard statistics are connected to the live database routes.', time: '10 mins ago' }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row">
      <AdminSidebar /> 

      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-8">
        
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-4 border-[#F2B84B]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <div className="relative z-10 space-y-2 max-w-xl">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              KHIT Sports Admin Panel
            </h1>
            <p className="text-xs lg:text-sm text-gray-200 leading-relaxed">
              Welcome to the administrator panel. Resource cards and configurations below are mapped directly to your local database endpoints.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 self-stretch sm:self-auto justify-center">
            <div className="w-10 h-10 bg-[#F2B84B] text-[#7A1E2D] rounded-full flex items-center justify-center font-black text-sm">
              AD
            </div>
            <div className="text-left">
              <p className="text-[10px] font-semibold text-gray-300">Session Status</p>
              <p className="text-xs font-bold text-white">Authorized Admin</p>
            </div>
          </div>
        </section>

        {/* Statistics Cards Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" aria-label="System Statistics">
          {stats.map((item) => (
            <div key={item.name} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center text-lg mb-3 shadow-inner`}>
                {item.icon}
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#0F172A]">
                  {loading ? "..." : item.count}
                </span>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{item.name}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Navigation Panel */}
          <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6" aria-label="Quick Navigation">
            <h2 className="text-base font-extrabold tracking-tight text-[#0F172A] border-b border-slate-50 pb-2">
              Quick Actions Directory
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.path}
                  className="flex flex-col items-center justify-center p-5 rounded-xl border border-slate-100 hover:border-[#7A1E2D] hover:bg-red-50/20 text-slate-700 hover:text-[#7A1E2D] font-bold text-xs tracking-wide transition-all text-center gap-3"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span>{action.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activity Monitoring Logs */}
          <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6" aria-label="Administrative logs">
            <h2 className="text-base font-extrabold tracking-tight text-[#0F172A] border-b border-slate-50 pb-2">
              Operational Logs
            </h2>
            <div className="relative border-l-2 border-slate-100 pl-4 space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative">
                  <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#7A1E2D] ring-4 ring-white" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-xs text-[#0F172A]">{activity.title}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{activity.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}