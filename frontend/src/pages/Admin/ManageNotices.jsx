import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';

// Categories updated to match the public Notices.jsx page
const CATEGORIES = ["Circulars", "Announcements"];

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Circulars");
  const [formContent, setFormContent] = useState("");
  const [formImportant, setFormImportant] = useState(false);

  // Fetch notices from MongoDB
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/notices");
      const result = await res.json();
      if (result.success) {
        setNotices(result.data);
      } else {
        throw new Error(result.message || "Failed to load bulletins.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesCategory = selectedCategory === "All" || notice.category === selectedCategory;
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (notice.content || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [notices, searchQuery, selectedCategory]);

  const openAddModal = () => {
    setIsEditing(false);
    setFormTitle("");
    setFormCategory("Circulars");
    setFormContent("");
    setFormImportant(false);
    setIsFormOpen(true);
  };

  const openEditModal = (notice) => {
    setIsEditing(true);
    setActiveNotice(notice);
    setFormTitle(notice.title || "");
    setFormCategory(notice.category || "Circulars");
    setFormContent(notice.content || "");
    setFormImportant(notice.important || false);
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const token = localStorage.getItem("adminAuth");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };

      const payload = {
        title: formTitle,
        category: formCategory,
        content: formContent,
        important: formImportant,
        date: today
      };

      let url = "http://localhost:5000/api/notices";
      let method = "POST";

      if (isEditing && activeNotice) {
        url = `http://localhost:5000/api/notices/${activeNotice._id}`; // MongoDB uses _id
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        fetchNotices(); // Sync view
        setIsFormOpen(false);
      } else {
        throw new Error(result.message || "Failed to publish notice.");
      }
    } catch (err) {
      alert(`Error saving notice: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bulletin notice?")) return;

    try {
      const token = localStorage.getItem("adminAuth");
      const response = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });

      const result = await response.json();
      if (response.ok) {
        fetchNotices(); // Sync view
      } else {
        throw new Error(result.message || "Failed to remove notice.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Manage Notices</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-semibold">Publish circular forms and announcements.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            ➕ Publish Notice
          </button>
        </div>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Search notices</label>
            <input
              type="text"
              placeholder="Search headline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category Filter</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm bg-white"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Bulletin Details</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="2" className="py-8 text-center text-slate-400 italic">Connecting to database...</td>
                  </tr>
                ) : filteredNotices.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-8 text-center text-slate-400 italic">No notices found.</td>
                  </tr>
                ) : (
                  filteredNotices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 space-y-2">
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="bg-[#EAF2FA] text-[#7A1E2D] text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                            {notice.category}
                          </span>
                          {notice.important && (
                            <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                              Important
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 font-bold">📅 {notice.date}</span>
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900">{notice.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">{notice.content}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(notice)}
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(notice._id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-xs md:text-sm">
            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#F2B84B]">
              <h3 className="font-extrabold text-sm md:text-base">{isEditing ? "Edit Notice" : "Publish Bulletin Notice"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center pt-6 pl-4">
                  <input
                    type="checkbox"
                    id="important-toggle"
                    checked={formImportant}
                    onChange={(e) => setFormImportant(e.target.checked)}
                    className="h-4.5 w-4.5 text-[#7A1E2D] rounded border-slate-300 focus:ring-[#7A1E2D]"
                  />
                  <label htmlFor="important-toggle" className="ml-2 text-xs font-bold text-slate-600 uppercase select-none">
                    Mark as Important
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Selection Trials notice"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Bulletin Content</label>
                <textarea
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows="4"
                  placeholder="Write notice details here..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none resize-none"
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
                  className="px-5 py-2 bg-[#7A1E2D] text-white font-bold rounded-lg"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}