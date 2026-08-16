import React from 'react';

export default function StudentDashboard({ onLogout }) {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <span className="text-2xl">🧁</span>
            <div>
              <h2 className="font-bold text-amber-500 leading-tight">The Baking School</h2>
              <p className="text-xs text-gray-400">Student Portal</p>
            </div>
          </div>
          <nav className="p-4 space-y-2 text-sm font-semibold">
            <div className="p-3 bg-amber-500 text-slate-900 font-bold rounded-lg cursor-pointer">Dashboard</div>
            <div className="p-3 hover:bg-slate-800 text-gray-300 rounded-lg cursor-pointer transition">My Recipes</div>
            <div className="p-3 hover:bg-slate-800 text-gray-300 rounded-lg cursor-pointer transition">Class Schedule</div>
            <div className="p-3 hover:bg-slate-800 text-gray-300 rounded-lg cursor-pointer transition">Fees & Receipts</div>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center px-8 border-b">
          <h1 className="text-xl font-bold text-gray-800">Welcome Back, Yuvraj!</h1>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">UID: 23BCS10498</span>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <span className="text-xs text-gray-400 font-bold uppercase">Course</span>
              <p className="text-base font-bold text-slate-800 mt-1">Diploma in Pastry Arts</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <span className="text-xs text-gray-400 font-bold uppercase">Attendance</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">94%</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <span className="text-xs text-gray-400 font-bold uppercase">Next Practical</span>
              <p className="text-base font-bold text-slate-800 mt-1">Sourdough & Fermentation</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <span className="text-xs text-gray-400 font-bold uppercase">Pending Dues</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">₹0</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}