import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';

const DEPARTMENTS = ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"];
const SPORTS = ["Cricket", "Volleyball", "Basketball", "Kabaddi", "Athletics", "Badminton", "Throwball", "Chess", "Carroms", "Table Tennis"];

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSport, setSelectedSport] = useState("All");

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Field States
  const [formName, setFormName] = useState("");
  const [formDept, setFormDept] = useState("CSE");
  const [formSport, setFormSport] = useState("Cricket");
  const [formPosition, setFormPosition] = useState("");
  const [formRollNo, setFormRollNo] = useState("");
  const [formYear, setFormYear] = useState("1st Year");
  const [formGender, setFormGender] = useState("Boys");
  const [formImage, setFormImage] = useState("");

  // Helper to fetch players list from MongoDB
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/players");
      const result = await res.json();
      if (result.success) {
        setPlayers(result.data);
      } else {
        throw new Error(result.message || "Failed to load players");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Filter Logic
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesDept = selectedDept === "All" || (player.department || "").toUpperCase() === selectedDept.toUpperCase();
      const matchesSport = selectedSport === "All" || player.sport === selectedSport;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        player.name.toLowerCase().includes(searchLower) ||
        (player.rollNo || "").toLowerCase().includes(searchLower) ||
        player.sport.toLowerCase().includes(searchLower);

      return matchesDept && matchesSport && matchesSearch;
    });
  }, [players, searchQuery, selectedDept, selectedSport]);

  // Open Form for Adding New Player
  const openAddModal = () => {
    setIsEditing(false);
    setFormName("");
    setFormDept("CSE");
    setFormSport("Cricket");
    setFormPosition("");
    setFormRollNo("");
    setFormYear("1st Year");
    setFormGender("Boys");
    setFormImage("");
    setIsFormOpen(true);
  };

  // Open Form for Editing Player
  const openEditModal = (player) => {
    setIsEditing(true);
    setActivePlayer(player);
    setFormName(player.name);
    setFormDept(player.department || "CSE");
    setFormSport(player.sport || "Cricket");
    setFormPosition(player.position || "");
    setFormRollNo(player.rollNo || "");
    setFormYear(player.year || "1st Year");
    setFormGender(player.gender || "Boys");
    setFormImage(player.image || "");
    setIsFormOpen(true);
  };

  // View Player Profile Details
  const openViewModal = (player) => {
    setActivePlayer(player);
    setIsViewOpen(true);
  };

  // Save Handler (Add / Edit API Integration)
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
        position: formPosition,
        rollNo: formRollNo,
        year: formYear,
        gender: formGender,
        image: formImage || "/logo.jpg"
      };

      let url = "http://localhost:5000/api/players";
      let method = "POST";

      if (isEditing && activePlayer) {
        url = `http://localhost:5000/api/players/${activePlayer._id}`; // MongoDB uses _id
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        fetchPlayers(); // Synchronize view
        setIsFormOpen(false);
      } else {
        throw new Error(result.message || "Failed to process player record.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete Handler (API Integration)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this athlete?")) return;

    try {
      const token = localStorage.getItem("adminAuth");
      const response = await fetch(`http://localhost:5000/api/players/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });

      const result = await response.json();
      if (response.ok) {
        fetchPlayers(); // Synchronize view
      } else {
        throw new Error(result.message || "Failed to delete player.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-6">
        
        {/* Top Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Manage Players</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-semibold">Add, update, or remove athletes from the database.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <span>➕</span> Add New Athlete
          </button>
        </div>

        {/* Filter Toolbar */}
        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, roll no..."
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
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sport</label>
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

        {/* Roster Data Table Card */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Athlete</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Sport</th>
                  <th className="py-4 px-6">Position / Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 italic">Querying athletes collection...</td>
                  </tr>
                ) : filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 italic">No athlete profiles match your filters.</td>
                  </tr>
                ) : (
                  filteredPlayers.map((player) => (
                    <tr key={player._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 p-0.5">
                          <img
                            src={player.image || "/logo.jpg"}
                            alt={player.name}
                            className="w-full h-full object-contain rounded-full"
                            onError={(e) => { e.target.src = "/logo.jpg"; }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{player.name}</p>
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{player.rollNo || "No Roll No"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-600">{player.department}</td>
                      <td className="py-4 px-6">
                        <span className="bg-red-50 text-[#7A1E2D] text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                          {player.sport}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">{player.position || "Athlete"}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openViewModal(player)}
                            className="p-2 text-slate-500 hover:text-[#7A1E2D] hover:bg-red-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => openEditModal(player)}
                            className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(player._id)}
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

      {/* Form modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-xs md:text-sm">
            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#F2B84B]">
              <h3 className="font-extrabold text-sm md:text-base">{isEditing ? "Edit Athlete Details" : "Add New Athlete"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Athlete Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Roll Number</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing} // Prevents editing unique RollNo after registration
                    value={formRollNo}
                    onChange={(e) => setFormRollNo(e.target.value)}
                    placeholder="e.g. 21H71A0501"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D] disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Year of Study</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-semibold"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Department</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-semibold"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Sport Discipline</label>
                  <select
                    value={formSport}
                    onChange={(e) => setFormSport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-semibold"
                  >
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Position / Role</label>
                  <input
                    type="text"
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    placeholder="e.g. All-Rounder, Spiker"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Gender Division</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-semibold"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Photo URL Path (Optional)</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="/logo.jpg"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A1E2D]"
                />
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile details Modal */}
      {isViewOpen && activePlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden text-xs md:text-sm">
            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#F2B84B]">
              <h3 className="font-extrabold text-sm">Athlete Profile Summary</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-6 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-slate-50 border-2 border-[#7A1E2D] p-1">
                <img
                  src={activePlayer.image || "/logo.jpg"}
                  alt={activePlayer.name}
                  className="w-full h-full object-contain rounded-full bg-slate-50"
                  onError={(e) => { e.target.src = "/logo.jpg"; }}
                />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">{activePlayer.name}</h4>
                <p className="text-[11px] font-mono text-slate-400 font-bold mt-1 uppercase tracking-wide">{activePlayer.rollNo || "No Roll Number Registered"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Department</span>
                  <p className="font-bold text-slate-700">{activePlayer.department}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Discipline</span>
                  <p className="font-bold text-[#7A1E2D]">{activePlayer.sport}</p>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Position / Role</span>
                  <p className="font-bold text-slate-700">{activePlayer.position || "Athlete"}</p>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Year / Gender</span>
                  <p className="font-bold text-slate-700">{activePlayer.year} ({activePlayer.gender})</p>
                </div>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}