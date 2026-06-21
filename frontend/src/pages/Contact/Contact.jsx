import React, { useState } from 'react';

// Contact Directories Data
const CONTACT_CARDS = [
  {
    role: "Physical Director",
    name: "Dr. K. Srinivasa Rao",
    phone: "+91 94901 82345",
    email: "sports@khit.guntur.ac.in",
    office: "Physical Education Office, Ground Floor, Block-A"
  },
  {
    role: "Assistant Physical Director",
    name: "Sri. P. Rambabu",
    phone: "+91 99663 12456",
    email: "rambabu.p@khit.guntur.ac.in",
    office: "Sports Equipment Cabin, Ground Floor, Block-B"
  },
  {
    role: "Sports Desk (General Queries)",
    name: "KHIT Athletic Board",
    phone: "+91 86322 21357",
    email: "sportsdesk@khit.guntur.ac.in",
    office: "Indoor Complex Recreation Counter"
  }
];

export default function Contact() {
  // Enquiry Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    category: "General Enquiry", // General Enquiry / Trials / Facilities Booking / Feedback
    message: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Simple Form Validation checks
    if (!formData.name || !formData.email || !formData.message) {
      setFormError("Please fill out all mandatory fields (Name, Email, Message).");
      return;
    }

    // Safely simulate API submission success
    setFormSubmitted(true);
    setFormData({
      name: "",
      email: "",
      rollNo: "",
      category: "General Enquiry",
      message: ""
    });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] pb-16">
      
      {/* Section 1 — Hero */}
      <section className="khit-hero-gradient relative text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="khit-container relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="bg-[#F2B84B] text-[#7A1E2D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm inline-block mb-3">
            Sports Board Desk
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Contact <span className="text-[#F2B84B]">Sports Board</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Have questions regarding selection dates, sports facilities clearances, or tournament sponsorships? Get in touch with our physical education offices.
          </p>
        </div>
      </section>

      {/* Section 2 — Contact Directories Cards */}
      <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4" aria-label="Office Directories">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTACT_CARDS.map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl flex flex-col justify-between hover:transform hover:-translate-y-1 transition-transform">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-red-50 text-[#7A1E2D] px-2.5 py-1 rounded-md block w-fit mb-3">
                  {card.role}
                </span>
                <h3 className="text-lg font-extrabold text-[#0F172A] mb-1">{card.name}</h3>
                <p className="text-xs text-[#64748B] mb-4">{card.office}</p>
              </div>

              <div className="space-y-2 border-t border-gray-50 pt-4 text-xs font-semibold">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Phone:</span>
                  <a href={`tel:${card.phone.replace(/\s+/g, '')}`} className="text-[#7A1E2D] hover:underline">
                    {card.phone}
                  </a>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Email:</span>
                  <a href={`mailto:${card.email}`} className="text-[#7A1E2D] hover:underline">
                    {card.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Feedback / Enquiry Form */}
      <section className="khit-section max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl p-6 md:p-12 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Instructions Block */}
          <div>
            <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Get in Touch</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              Sports Enquiry & Feedback Form
            </h2>
            <p className="text-[#64748B] text-sm md:text-base leading-relaxed mb-6">
              Use the unified help desk form to request specific training programs info, lodge athletic facility requests, report damage to campus equipment, or coordinate inter-collegiate friendly slots.
            </p>

            <div className="space-y-4 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EAF2FA] text-[#7A1E2D] rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span>Fast response response: Typically resolves in 24-48 working hours.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EAF2FA] text-[#7A1E2D] rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>In-person hours: Monday - Saturday (03:30 PM - 05:30 PM).</span>
              </div>
            </div>
          </div>

          {/* Form Block */}
          <div>
            {formSubmitted ? (
              <div className="bg-[#EAF2FA] rounded-2xl p-8 border border-blue-100 text-center">
                <span className="text-4xl block mb-2">📨</span>
                <h3 className="text-lg font-bold text-[#7A1E2D] mb-1">Message Submitted</h3>
                <p className="text-xs text-[#64748B] mb-4">Your message was registered on the KHIT physical desk index successfully.</p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="btn-maroon px-4 py-2 rounded-lg text-xs font-bold"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-500 font-semibold p-3.5 rounded-xl text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name-input" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                      Student Name *
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Rahul Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email-input" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., name@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Roll No */}
                  <div>
                    <label htmlFor="roll-input" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                      Roll Number / ID (Optional)
                    </label>
                    <input
                      id="roll-input"
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleChange}
                      placeholder="e.g., 22KH1A0501"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category-select" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                      Topic Area
                    </label>
                    <select
                      id="category-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent bg-white text-[#0F172A]"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Selection Trials">Selection Trials</option>
                      <option value="Facilities Booking">Facilities Booking</option>
                      <option value="Grievances & Equipment">Grievances & Equipment</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message-input" className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    id="message-input"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details of your athletic enquiry or request here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="btn-maroon w-full py-3 rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Help Desk Message
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Section 4 — Maps & Physical Placement directions */}
      <section className="khit-section max-w-5xl mx-auto px-4 mt-8" aria-label="Campus Location map">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="max-w-md">
            <span className="text-xs font-bold text-[#7A1E2D] uppercase tracking-widest block mb-1">Campus Spot</span>
            <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">Physical Education Center</h3>
            <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
              Kallam Haranadhareddy Institute of Technology, NH-16, Guntur-Chennai Highway, Chowdavaram, Guntur, Andhra Pradesh - 522019.
            </p>
          </div>
          
          <div className="w-full md:w-64 h-32 bg-[#EAF2FA] rounded-2xl flex flex-col items-center justify-center border border-blue-50 text-center p-4">
            <svg className="w-10 h-10 text-[#7A1E2D] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-bold text-[#0F172A]">Chowdavaram Highway Spot</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">Adjacent to Main Playgrounds</span>
          </div>
        </div>
      </section>

    </div>
  );
}