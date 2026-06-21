import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';

const SPORTS = ["Cricket", "Volleyball", "Basketball", "Kabaddi", "Badminton"];
const CATEGORIES = ["Photos", "Achievements", "Events"];

export default function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false); // Track file upload progress

  // Form Fields State
  const [formTitle, setFormTitle] = useState("");
  const [formSport, setFormSport] = useState("Cricket");
  const [formCategory, setFormCategory] = useState("Photos");
  const [importSource, setImportSource] = useState("local"); // "local" or "url"
  
  // Image handling states
  const [formImage, setFormImage] = useState(""); // Stores final URL path
  const [selectedFile, setSelectedFile] = useState(null); // Stores raw file object
  const [previewUrl, setPreviewUrl] = useState(""); // Local browser preview URL

  // Fetch gallery records
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/gallery");
      const result = await res.json();
      if (result.success) {
        setGallery(result.data);
      } else {
        throw new Error(result.message || "Failed to load media catalogue.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchesSport = selectedSport === "All" || item.sport === selectedSport;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.sport.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSport && matchesSearch;
    });
  }, [gallery, searchQuery, selectedSport]);

  const openAddModal = () => {
    setFormTitle("");
    setFormSport("Cricket");
    setFormCategory("Photos");
    setImportSource("local");
    setFormImage("");
    setSelectedFile(null);
    setPreviewUrl("");
    setIsFormOpen(true);
  };

  // Capture file and generate a temporary preview URL
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit to MongoDB
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      setUploading(true);
      const token = localStorage.getItem("adminAuth");
      let uploadedImagePath = formImage;

      // 1. If import source is local and file is selected, upload to server first
      if (importSource === "local" && selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: formData
        });

        const uploadResult = await responseJson(uploadResponse);
        if (uploadResponse.ok && uploadResult.success) {
          // Store the saved permanent path (e.g., "/uploads/filename.jpg")
          uploadedImagePath = uploadResult.imageUrl;
        } else {
          throw new Error(uploadResult.message || "File upload failed.");
        }
      }

      // 2. Save final metadata payload to MongoDB
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };

      const payload = {
        title: formTitle,
        sport: formSport,
        category: formCategory,
        image: uploadedImagePath || "/logo.jpg"
      };

      const response = await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        fetchGallery(); // Sync view
        setIsFormOpen(false);
      } else {
        throw new Error(result.message || "Failed to save gallery item.");
      }
    } catch (err) {
      alert(`Error saving media: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const responseJson = async (res) => {
    try {
      return await res.json();
    } catch (err) {
      throw new Error("Invalid response format from server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const token = localStorage.getItem("adminAuth");
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });

      const result = await response.json();
      if (response.ok) {
        fetchGallery(); // Sync view
      } else {
        throw new Error(result.message || "Failed to remove image.");
      }
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-grow p-4 lg:p-8 pt-20 lg:pt-8 lg:ml-64 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Manage Gallery</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-semibold">Upload action photographs, achievements, and events.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            ➕ Upload Media
          </button>
        </div>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Search Images</label>
            <input
              type="text"
              placeholder="Search photo titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sport Filter</label>
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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-sm text-slate-400 italic py-6 col-span-3 text-center">Querying media records...</p>
          ) : filteredGallery.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-6 col-span-3 text-center">No images found in catalog.</p>
          ) : (
            filteredGallery.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-md transition-shadow relative">
                <div className="h-48 bg-[#EAF2FA] relative">
                  <img 
                    // Fallback to locally hosted upload URL prefix
                    src={item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.jpg";
                    }}
                  />
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-red-50 text-red-600 rounded-lg shadow-sm transition-all z-10 font-bold text-xs"
                    title="Delete Image"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="p-4 bg-white">
                  <span className="text-[10px] font-extrabold text-[#7A1E2D] uppercase tracking-wider block mb-1">
                    {item.sport} • {item.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 truncate">{item.title}</h4>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-xs md:text-sm">
            <div className="bg-[#7A1E2D] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#F2B84B]">
              <h3 className="font-extrabold text-sm md:text-base">Upload Gallery Photo</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Photo Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Cricket Team Victory Celebration"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Associated Sport</label>
                  <select
                    value={formSport}
                    onChange={(e) => setFormSport(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
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
              </div>

              {/* Import Source */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Import From</label>
                <div className="flex gap-4">
                  <label className="flex items-center font-bold text-slate-600 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="importSource"
                      value="local"
                      checked={importSource === "local"}
                      onChange={() => { setImportSource("local"); setFormImage(""); }}
                      className="mr-2 text-[#7A1E2D] accent-[#7A1E2D]"
                    />
                    Local Device
                  </label>
                  <label className="flex items-center font-bold text-slate-600 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="importSource"
                      value="url"
                      checked={importSource === "url"}
                      onChange={() => { setImportSource("url"); setFormImage(""); }}
                      className="mr-2 text-[#7A1E2D] accent-[#7A1E2D]"
                    />
                    Web URL
                  </label>
                </div>
              </div>

              {/* Conditional File Selection Inputs */}
              {importSource === "local" ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Select Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalFileChange}
                    className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#7A1E2D] hover:file:bg-red-100"
                  />
                  {previewUrl && (
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Image Upload Preview</p>
                      <img src={previewUrl} alt="Preview" className="h-32 w-auto object-contain rounded border border-slate-100 p-1" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Image Web URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              )}

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
                  disabled={uploading}
                  className="px-5 py-2 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {uploading ? "Uploading Image..." : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}