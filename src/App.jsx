import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Clock, MapPin, Phone, Instagram, Facebook, 
  Menu, X as CloseIcon, Check, Plus, Calendar as CalendarIcon
} from 'lucide-react';

/* --- Fonts & Global Styles --- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: #FFFFFF;
      color: #000000;
      overflow-x: hidden;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Montserrat', sans-serif;
    }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    ::selection {
      background: #000;
      color: #fff;
    }
  `}</style>
);

/* --- Data --- */
const HERO_TREATMENTS = [
  { 
    title: "Lip Sculpting", 
    desc: "Subtle volume & definition.", 
    // Image 1: Lip Sculpting
    image: "https://i.ibb.co/zTWv5M6y/Gemini-Generated-Image-2.png" 
  },
  { 
    title: "Botox", 
    desc: "Full face balancing.", 
    // Image 2: Botox - UPDATED with the new URL
    image: "https://i.ibb.co/3yYtswBZ/Gemini-Generated-Image-1.png" 
  },
  { 
    title: "Glass Skin Facial", 
    desc: "Deep hydration glow.", 
    // Image 3: Glass Skin Facial (Updated to the new file)
    image: "https://i.ibb.co/v4Zc2C1f/Gemini-Generated-Image.png" 
  }
];

const STATS = [
  { label: "Years of Experience", value: "15+" },
  { label: "Happy Patients", value: "5k+" },
  { label: "Procedures Performed", value: "12k" },
  { label: "Return Rate", value: "98%" },
];

const SERVICE_CATEGORIES = [
  {
    id: "consult",
    name: "Consultation",
    items: [
      { name: "General Consultation", price: "$30", desc: "Full facial analysis & treatment plan." },
      { name: "Skin Analysis", price: "$40", desc: "In-depth diagnostic of skin health." },
      { name: "Injectables Planning", price: "$30", desc: "Mapping for volume & contour." }
    ]
  },
  {
    id: "contour",
    name: "Contour & Volume",
    items: [
      { name: "Lip Augmentation", price: "$150+", desc: "Subtle volume using premium hyaluronic acid." },
      { name: "Cheekbone Definition", price: "$150+", desc: "Lift and define the mid-face." },
      { name: "Chin Correction", price: "$150+", desc: "Profile balancing and projection." },
      { name: "Nasolabial Folds", price: "$150+", desc: "Softening deep lines." },
      { name: "Juvederm Smile (0.55ml)", price: "$150", desc: "Natural lip enhancement." },
      { name: "Stylage L (1ml)", price: "$220", desc: "Volumizing filler for deep folds." }
    ]
  },
  {
    id: "tox",
    name: "Botulinum Therapy",
    items: [
      { name: "Upper Face (3 Zones)", price: "$170", desc: "Forehead, frown, and crow's feet." },
      { name: "Forehead + Frown", price: "$115", desc: "Targeted wrinkle reduction." },
      { name: "Brow Lift", price: "$50", desc: "Subtle lift to open the eyes." },
      { name: "Hyperhidrosis", price: "$220", desc: "Treatment for excessive sweating." }
    ]
  },
  {
    id: "bio",
    name: "Biorevitalization",
    items: [
      { name: "Biogel (1ml)", price: "$65", desc: "Deep hydration and skin quality." },
      { name: "Jalupro (2.5ml)", price: "$225", desc: "Amino acid replacement therapy." },
      { name: "Novacutan (2ml)", price: "$190", desc: "Advanced skin protection." },
      { name: "Plinest Fast (2ml)", price: "$215", desc: "Polynucleotides for regeneration." }
    ]
  },
  {
    id: "facials",
    name: "Clinical Facials",
    items: [
      { name: "Glass Skin Facial", price: "$120", desc: "Deep cleansing & hydration." },
      { name: "BioRePeel", price: "$60", desc: "Biphasic peel, no downtime." },
      { name: "PRX-T33", price: "$60", desc: "Needle-free biorevitalization." },
      { name: "Retinol Yellow Peel", price: "$50", desc: "Intensive resurfacing." }
    ]
  },
  {
    id: "laser",
    name: "Laser Hair Removal",
    items: [
      { name: "Full Face", price: "$25", desc: "Gentle removal for face." },
      { name: "Underarms", price: "$20", desc: "Quick & effective." },
      { name: "Bikini (Total)", price: "$50", desc: "Complete clearance." },
      { name: "Full Legs", price: "$55", desc: "Silky smooth results." }
    ]
  }
];

const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

/* --- Components --- */

// Reusable Section Layout (Label Left, Content Right)
const Section = ({ label, children, className = "", id = "" }) => (
  <section id={id} className={`py-12 md:py-24 ${className}`}>
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
      {label !== null && (
        <div className="md:col-span-3 lg:col-span-3">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-400 sticky top-32">
            {label}
          </span>
        </div>
      )}
      <div className={`${label !== null ? 'md:col-span-9 lg:col-span-8' : 'md:col-span-12'}`}>
        {children}
      </div>
    </div>
  </section>
);

const Navigation = ({ currentView, setView, onQuickBook }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view, sectionId) => {
    setView(view);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-b from-white via-white/80 to-transparent pb-8 transition-all">
      {/* Added 'items-center' to ensure vertical alignment of all flex children */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 flex justify-between items-center h-20 relative">
        
        {/* Left: Logo */}
        <div 
          className="text-sm font-semibold tracking-widest uppercase cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-2 z-10 h-full"
          onClick={() => handleNav('home')}
        >
          Face & Figure <span className="hidden sm:inline text-[10px] font-light tracking-normal normal-case text-gray-500">by Irina Votyakova</span>
        </div>
        
        {/* Center: Nav Links - ABSOLUTE CENTERED */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center h-full space-x-12 text-[11px] font-medium tracking-[0.15em] uppercase text-gray-500">
          <button 
            onClick={() => handleNav('home')} 
            className={`hover:text-black transition-colors ${currentView === 'home' ? 'text-black' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNav('services')} 
            className={`hover:text-black transition-colors ${currentView === 'services' ? 'text-black' : ''}`}
          >
            Treatments
          </button>
          <button 
            onClick={() => handleNav(currentView, 'contact')} 
            className="hover:text-black transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Right: Action & Mobile Toggle */}
        <div className="flex items-center gap-4 z-10 h-full">
          <button 
            onClick={onQuickBook}
            className="bg-black text-white px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Book Now
          </button>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-black flex items-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay - Full Screen Style */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full h-screen bg-white border-t border-gray-100 flex flex-col items-center pt-20 space-y-8 text-sm font-medium tracking-[0.2em] uppercase"
            >
              <button onClick={() => handleNav('home')}>Home</button>
              <button onClick={() => handleNav('services')}>Treatments</button>
              <button onClick={() => handleNav(currentView, 'contact')}>Contact</button>
              <button onClick={() => { setMobileMenuOpen(false); onQuickBook(); }} className="text-black font-bold border-b border-black pb-1">Book Appointment</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

/* --- VIEW: HOME --- */
const HomeView = ({ setView, onQuickBook }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-40"
    >
      {/* Hero - INTRO label and column removed */}
      <Section label={null}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight max-w-4xl text-black mb-8">
            The Art of Precision.
            <span className="text-gray-400 block mt-2">Medical Aesthetics • Saida, Lebanon</span>
          </h1>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => setView('services')}
              className="text-xs uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-50 transition-opacity"
            >
              Explore Treatments &rarr;
            </button>
            <button 
              onClick={onQuickBook}
              className="text-xs uppercase tracking-[0.2em] bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        </motion.div>
      </Section>

      {/* ABOUT (Merged with Director) */}
      <Section label="ABOUT">
        <div className="space-y-10 max-w-3xl text-base md:text-lg font-light leading-relaxed text-gray-800">
          <p>
            Face & Figure is a sanctuary for aesthetic refinement. Founded on the principles of medical precision and artistic integrity, we offer a curated approach to modern beauty. We believe in enhancing your natural architecture, not rewriting it.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm md:text-base text-gray-600">
              Under the direction of Dr. Irina Votyakova, we specialize in full-face harmonization and advanced injectable techniques. With over 15 years of experience in clinical dermatology, Dr. Votyakova is renowned for her "invisible touch," ensuring every patient leaves looking refreshed, not done.
            </p>
            
            <div className="pt-4 flex items-center gap-6">
               <div className="h-16 w-16 bg-gray-100 rounded-sm overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover grayscale" alt="Dr" />
               </div>
               <div>
                 <p className="text-black font-medium text-sm uppercase tracking-widest">Dr. Irina Votyakova</p>
                 <p className="text-gray-400 text-xs mt-1">Medical Director • Board Certified</p>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* HIGHLIGHTS */}
      <Section label="HIGHLIGHTS">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
          {HERO_TREATMENTS.map((item, i) => (
            <div 
              key={i} 
              className="group cursor-pointer flex flex-col items-start"
              onClick={() => setView('services')}
            >
              <div className="h-64 w-full overflow-hidden bg-gray-100 mb-5 relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600/f0f0f0/cccccc?text=Image+Loading..." }} // Fallback
                />
              </div>
              {/* Added min-h-[3.5rem] to align titles and subsequent descriptions */}
              <h3 className="text-lg font-normal text-black mb-2 min-h-[3.5rem]">{item.title}</h3>
              {/* UPDATED: Changed text-gray-500 to text-gray-600 for better contrast */}
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-xs text-left">
                {item.desc}
              </p>
            </div>
          ))}

          {/* 4th Block: See All Treatments CTA */}
          <div 
            className="group cursor-pointer flex flex-col items-start h-full"
            onClick={() => setView('services')}
          >
            <div className="h-64 w-full bg-gray-50 border border-gray-100 mb-5 flex flex-col items-start justify-center p-8 group-hover:bg-black transition-colors duration-500">
              <span className="text-gray-400 text-xs uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Discover</span>
              <div className="flex flex-col items-start text-black group-hover:text-white transition-colors">
                <span className="text-lg font-normal leading-none mb-1">View Full Menu</span>
                <ArrowRight size={18} />
              </div>
            </div>
            <h3 className="text-lg font-normal text-black mb-2 min-h-[3.5rem]">All Services</h3>
            {/* UPDATED: Changed text-gray-500 to text-gray-600 */}
            <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-xs text-left">
              Explore our comprehensive range of medical aesthetic procedures.
            </p>
          </div>
        </div>
      </Section>

      {/* REPUTATION / NUMBERS */}
      <Section label="REPUTATION">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-4xl md:text-5xl font-light text-black mb-2">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
};

/* --- VIEW: SERVICES & BOOKING --- */
const ServicesView = ({ preSelected }) => {
  const [activeTab, setActiveTab] = useState('all');
  // Set default treatment to General Consultation if no preselection is made
  const [selectedTreatment, setSelectedTreatment] = useState(
    preSelected || { name: "General Consultation", price: "$30", desc: "Full facial analysis & treatment plan." }
  );
  const [hoveredCase, setHoveredCase] = useState(null);
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (preSelected) {
      setSelectedTreatment(preSelected);
      // Removed scroll here to respect user feedback
    }
  }, [preSelected]);

  const getDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let i = 0;
    while(count < 30) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = d.getDay();
      if (day !== 0 && day !== 6) { 
        dates.push({
          day: d.toLocaleDateString('en-US', { weekday: 'short' }),
          date: d.getDate(),
          fullDate: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
        });
        count++;
      }
      i++;
    }
    return dates;
  };

  const dates = getDates();
  const canBook = selectedDate && selectedTime && clientName && clientPhone && selectedTreatment;

  const filteredCategories = activeTab === 'all' 
    ? SERVICE_CATEGORIES 
    : SERVICE_CATEGORIES.filter(c => c.id === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-32"
    >
      {/* MENU SECTION */}
      <Section label="MENU" className="!border-t-0" id="treatment-menu">
        <div className="mb-10">
          <h2 className="text-3xl font-light tracking-tight mb-8">Treatment Menu</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400">
            <button 
              onClick={() => setActiveTab('all')}
              className={`hover:text-black transition-colors ${activeTab === 'all' ? 'text-black underline underline-offset-4' : ''}`}
            >
              All
            </button>
            {SERVICE_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`hover:text-black transition-colors ${activeTab === cat.id ? 'text-black underline underline-offset-4' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">{category.name}</h3>
              <div>
                {category.items.map((service, index) => (
                  <div 
                    key={index}
                    onMouseEnter={() => setHoveredCase(`${category.id}-${index}`)}
                    onMouseLeave={() => setHoveredCase(null)}
                    onClick={() => {
                      setSelectedTreatment(service);
                      // Removed auto-scroll on click to respect user feedback
                    }}
                    className="group relative border-b border-gray-100 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="group-hover:pl-2 transition-all duration-300">
                        <h4 className="text-base font-normal text-gray-900">{service.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 font-light">{service.desc}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-black">
                          {service.price}
                        </span>
                        <ArrowRight 
                          size={14} 
                          className={`text-black transition-all duration-300 ${hoveredCase === `${category.id}-${index}` ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* RESERVATION FORM */}
      <Section label="RESERVATION" id="reservation">
        <div className="max-w-3xl bg-white relative z-10">
          <div className="mb-10">
             <h3 className="text-2xl font-light mb-2">Book Appointment</h3>
             <p className="text-sm text-gray-400 font-light">Follow the steps below to secure your session.</p>
          </div>

          {!booked ? (
            <div className="space-y-12">
              <div className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-2">01. Select Procedure</label>
                 {selectedTreatment ? (
                   <div className="flex items-center justify-between bg-gray-50 p-6 border border-gray-100">
                     <div>
                       <h4 className="text-lg font-normal text-black">{selectedTreatment.name}</h4>
                       <p className="text-sm text-gray-500 font-light mt-1">{selectedTreatment.desc}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{selectedTreatment.price}</span>
                        <button 
                          onClick={() => setSelectedTreatment(null)}
                          className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500"
                        >
                          Change
                        </button>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-gray-50 p-8 border border-gray-100 text-center space-y-4">
                     <p className="text-gray-500 text-sm font-light">Please select a treatment from the menu above.</p>
                     <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-gray-300"></div>
                        <span className="text-xs uppercase text-gray-400">OR</span>
                        <div className="h-px w-8 bg-gray-300"></div>
                     </div>
                     <button 
                       onClick={() => setSelectedTreatment({ name: "General Consultation", price: "$30", desc: "Full assessment & planning." })}
                       className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                     >
                       Book General Consultation ($30)
                     </button>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-2">02. Select Date</label>
                 <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                   {dates.map((d, i) => (
                     <button
                       key={i}
                       onClick={() => setSelectedDate(d)}
                       className={`flex-shrink-0 w-20 h-24 flex flex-col items-center justify-center border transition-all ${
                         selectedDate?.fullDate === d.fullDate 
                           ? 'border-black bg-black text-white' 
                           : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-black'
                       }`}
                     >
                       <span className="text-[10px] uppercase mb-1">{d.day}</span>
                       <span className="text-xl font-light">{d.date}</span>
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-2">03. Select Time</label>
                 <div className="flex flex-wrap gap-3">
                   {TIME_SLOTS.map((t, i) => (
                     <button
                       key={i}
                       onClick={() => setSelectedTime(t)}
                       disabled={!selectedDate}
                       className={`px-6 py-3 text-xs md:text-sm border transition-all ${
                         !selectedDate ? 'opacity-30 border-gray-100' :
                         selectedTime === t
                           ? 'border-black bg-black text-white' 
                           : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black'
                       }`}
                     >
                       {t}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-2">04. Your Details</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input 
                     type="text" 
                     placeholder="Full Name"
                     value={clientName}
                     onChange={(e) => setClientName(e.target.value)}
                     className="w-full border-b border-gray-200 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-gray-300"
                   />
                   <input 
                     type="tel" 
                     placeholder="Phone Number (+961...)"
                     value={clientPhone}
                     onChange={(e) => setClientPhone(e.target.value)}
                     className="w-full border-b border-gray-200 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-gray-300"
                   />
                 </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => setBooked(true)}
                  disabled={!canBook}
                  className={`text-sm uppercase tracking-widest py-4 w-full md:w-auto md:px-16 border transition-all flex items-center justify-center gap-2 ${
                    canBook 
                      ? 'border-black bg-black text-white hover:bg-gray-800' 
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Confirm Appointment <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-12 border border-gray-100 p-8 bg-gray-50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check size={16} />
                </div>
                <h3 className="text-xl">Request Received</h3>
              </div>
              <p className="text-gray-500 font-light max-w-md mb-8">
                Thank you, {clientName}. We have reserved your spot for {selectedTreatment?.name} on {selectedDate?.fullDate} at {selectedTime}. We will contact you at {clientPhone} to confirm.
              </p>
              <button 
                onClick={() => {
                   setBooked(false);
                   setSelectedTreatment({ name: "General Consultation", price: "$30", desc: "Full facial analysis & treatment plan." }); // Reset to consultation
                   setSelectedDate(null);
                   setSelectedTime(null);
                   setClientName("");
                   setClientPhone("");
                }} 
                className="text-xs uppercase tracking-widest border-b border-black pb-1"
              >
                Book Another
              </button>
            </motion.div>
          )}
        </div>
      </Section>
    </motion.div>
  );
};

/* --- SHARED FOOTER --- */
const Footer = ({ onQuickBook, hideBookingCTA }) => {
  return (
    <footer id="contact" className="py-24 border-t border-gray-100 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 block mb-8">
              Location
            </span>
            <div className="text-sm font-light text-gray-600 space-y-1">
              <p>City Medical Center, 3rd Floor</p>
              <p>East Blvd, Saida, Lebanon</p>
              <p className="mt-4 text-black">+961 767 33 55 8</p>
            </div>
          </div>
          
          <div className="md:col-span-9">
            {!hideBookingCTA && (
              <button 
                onClick={onQuickBook}
                className="group block text-left w-full"
              >
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none text-black group-hover:text-gray-500 transition-colors uppercase break-words"
                    style={{ lineHeight: '0.9' }} // Tighten line height for optical alignment
                >
                  BOOK APPOINTMENT <span className="text-2xl align-top text-black group-hover:text-gray-500 relative top-1 md:top-2">↗</span>
                </h2>
              </button>
            )}
            
            <div className="mt-12 md:mt-16 flex justify-between items-end">
              <div className="text-[10px] uppercase tracking-widest text-gray-400">
                <a href="#" className="hover:text-black mr-6">Instagram ↗</a>
                <a href="#" className="hover:text-black">Maps ↗</a>
              </div>
              <div className="text-[10px] text-gray-300">
                © 2025 FACE & FIGURE
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 h-64 w-full bg-gray-50 grayscale opacity-50 hover:opacity-100 transition-opacity duration-500">
          <iframe 
           src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1463.59875534544!2d35.38602081895211!3d33.57937154361176!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slb!4v1763846166044!5m2!1sen!2slb" 
           width="100%" 
           height="100%" 
           style={{ border: 0 }} 
           allowFullScreen="" 
           loading="lazy" 
           referrerPolicy="no-referrer-when-downgrade"
           title="Clinic Location"
         />
        </div>
      </div>
    </footer>
  );
};

/* --- Main App Component --- */
const App = () => {
  const [view, setView] = useState('home'); 
  const [preSelected, setPreSelected] = useState(null);

  const handleQuickBook = () => {
    setPreSelected({ name: "General Consultation", price: "$30", desc: "Full facial analysis & treatment plan." });
    setView('services');
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white antialiased">
      <GlobalStyles />
      <Navigation 
          currentView={view} 
          setView={setView} 
          onQuickBook={handleQuickBook} 
      />

      <main>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
             <HomeView key="home" setView={setView} onQuickBook={handleQuickBook} />
          ) : (
             <ServicesView key="services" preSelected={preSelected} />
          )}
        </AnimatePresence>
      </main>

      <Footer onQuickBook={handleQuickBook} hideBookingCTA={view === 'services'} />
    </div>
  );
};

export default App;