import React, { useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import EVENTS_DATA from '../../data/events.json';

const STATUSES = ["Open", "Ongoing", "Completed"];

export default function ManageEvents() {
  const [events, setEvents] = useState(EVENTS_DATA || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState("");
  const [formSport, setFormSport] = useState("All Sports");
  const [formDate, setFormDate] = useState("");
  const [formVenue, setFormVenue] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState("Open");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus = selectedStatus === "All" || event.status === selectedStatus;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.sport.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [events, searchQuery, selectedStatus]);

  const openAddModal = () => {
    setIsEditing(false);
    setFormTitle("");
    setFormSport("All Sports");
    setFormDate("");
    setFormVenue("");
    setFormDescription("");
    setFormStatus("Open");
    setIsFormOpen(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setActiveEvent(event);
    setFormTitle(event.title || "");
    setFormSport(event.sport || "All Sports");
    setFormDate(event.date || "");
    setFormVenue(event.venue || "");
    setFormDescription(event.description || "");
    setFormStatus(event.status || "Open");
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (isEditing && activeEvent) {
      setEvents(events.map(ev => ev.id === activeEvent.id ? {
        ...ev,
        title: formTitle,
        sport: formSport,
        date: formDate,
        venue: formVenue,
        description: formDescription,
        status: formStatus
      } : ev));
    } else {
      const newEvent = {
        id: `ev-${Date.now()}`,
        title: formTitle,
        sport: formSport,
        date: formDate,
        venue: formVenue,
        description: formDescription,
        status: formStatus,
        image: "/assets/events/logo.jpg"
      };
      setEvents([...events, newEvent]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Manage Events</h1>
            <p className="text-sm text-slate-500 mt-1">Host trial updates, celebrations, and tournament events.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            ➕ Add Sports Event
          </button>
        </div>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search Event</label>
            <input
              type="text"
              placeholder="Search event title, sport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-6 col-span-2 text-center">No matches or events configured.</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-red-50 text-[#7A1E2D] text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                      {event.sport}
                    </span>
                    <span className={`text-xs font-bold uppercase ${
                      event.status === "Open" ? "text-emerald-600" :
                      event.status === "Ongoing" ? "text-[#F2B84B]" : "text-slate-400"
                    }`}>
                      ● {event.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mb-2">{event.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{event.description}</p>
                </div>

                <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs text-slate-500">
                  <div>
                    <p>📅 <b>Date:</b> {event.date}</p>
                    <p className="mt-1">📍 <b>Venue:</b> {event.venue}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-lg">{isEditing ? "Edit Event details" : "Schedule Event"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Meet 2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sport / Scope</label>
                  <input
                    type="text"
                    value={formSport}
                    onChange={(e) => setFormSport(e.target.value)}
                    placeholder="e.g. Cricket, Basketball"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Venue</label>
                  <input
                    type="text"
                    required
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Indoor Stadium"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description Details</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows="3"
                  placeholder="Provide registration details and practice outlines..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A1E2D] text-white font-bold text-sm rounded-xl"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}