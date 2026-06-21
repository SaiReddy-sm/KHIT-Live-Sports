import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';

const DEPARTMENTS = ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"];
const SPORTS = ["Cricket", "Volleyball", "Basketball", "Kabaddi", "Athletics", "Badminton", "Throwball", "Chess", "Carroms", "Table Tennis"];

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSport, setSelectedSport] = useState("All");

  // Modals States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formDept, setFormDept] = useState("CSE");
  const [formSport, setFormSport] = useState("Cricket");
  const [formCaptain, setFormCaptain] = useState("");
  const [formSquadSize, setFormSquadSize] = useState(12);
  const [formWinRatio, setFormWinRatio] = useState(70);

  // Fetch teams from database
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/teams");
      const result = await res.json();
      if (result.success) {
        setTeams(result.data);
      } else {
        throw new Error(result.message || "Failed to load squads.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesDept = selectedDept === "All" || (team.department || "").toUpperCase() === selectedDept.toUpperCase();
      const matchesSport = selectedSport === "All" || team.sport === selectedSport;
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (team.captain || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDept && matchesSport && matchesSearch;
    });
  }, [teams, searchQuery, selectedDept, selectedSport]);

  const openAddModal = () => {
    setIsEditing(false);
    setFormName("");
    setFormDept("CSE");
    setFormSport("Cricket");
    setFormCaptain("");
    setFormSquadSize(12);
    setFormWinRatio(70);
    setIsFormOpen(true);
  };

  const openEditModal = (team) => {
    setIsEditing(true);
    setActiveTeam(team);
    setFormName(team.name);
    setFormDept(team.department || "CSE");
    setFormSport(team.sport || "Cricket");
    setFormCaptain(team.captain || "");
    setFormSquadSize(team.squadSize || 12);
    setFormWinRatio(team.winRatio || 70);
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      const token = localStorage.getItem("adminAuth");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };

      const payload = {
        name: formName,
        department: formDept,
        sport: formSport,
        captain: formCaptain,
        squadSize: Number(formSquadSize),
        winRatio: Number(formWinRatio)
      };

      let url = "http://localhost:5000/api/teams";
      let method = "POST";

      if (isEditing && activeTeam) {
        url = `http://localhost:5000/api/teams/${activeTeam._id}`; // MongoDB uses _id
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        fetchTeams(); // Sync view
        setIsFormOpen(false);
      } else {
        throw new Error(result.message || "Failed to save squad.");
      }
    } catch (err) {
      alert(`Error saving team: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this squad?")) return;

    try {
      const token = localStorage.getItem("adminAuth");
      const response = await fetch(`http://localhost:5000/api/teams/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });

      const result = await response.json();
      if (response.ok) {
        fetchTeams(); // Sync view
      } else {
        throw new Error(result.message || "Failed to remove squad.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Manage Teams</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-semibold">Register and oversee branch squads.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            ➕ Register New Team
          </button>
        </div>

        {/* Filters */}
        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Search Squad</label>
            <input
              type="text"
              placeholder="Search team name, captain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm bg-white"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sport Discipline</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm bg-white"
            >
              <option value="All">All Sports</option>
              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </section>

        {/* Data List Table Card */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Team Name</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Sport</th>
                  <th className="py-4 px-6">Captain</th>
                  <th className="py-4 px-6">Squad Size</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 italic">Connecting to database...</td>
                  </tr>
                ) : filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 italic">No squads found.</td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => (
                    <tr key={team._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-extrabold text-slate-900 text-sm">{team.name}</td>
                      <td className="py-4 px-6 font-semibold text-slate-600">{team.department}</td>
                      <td className="py-4 px-6">
                        <span className="bg-red-50 text-[#7A1E2D] text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                          {team.sport}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{team.captain || "Not Named"}</td>
                      <td className="py-4 px-6 text-slate-500">{team.squadSize || 0} Members</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(team)}
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(team._id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-xs md:text-sm">
            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#F2B84B]">
              <h3 className="font-extrabold text-sm md:text-base">{isEditing ? "Edit Team Roster" : "Register Team"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Team / Club Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. CSE Strikers"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Department</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Sport Discipline</label>
                  <select
                    value={formSport}
                    onChange={(e) => setFormSport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Team Captain Name</label>
                <input
                  type="text"
                  value={formCaptain}
                  onChange={(e) => setFormCaptain(e.target.value)}
                  placeholder="Enter captain name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Squad Size</label>
                  <input
                    type="number"
                    value={formSquadSize}
                    onChange={(e) => setFormSquadSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Win Ratio (%)</label>
                  <input
                    type="number"
                    value={formWinRatio}
                    onChange={(e) => setFormWinRatio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold rounded-lg"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}