import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ArrowRight, Code, Trophy, Boxes, Sparkles  } from "lucide-react";

function App() {
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
        
        {/* THE CRAZY GRID BACKGROUND */}
        <div className="fixed inset-0 z-[-1] opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }}>
        </div>
        <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-transparent via-[#020202] to-[#020202]"></div>

        <Navbar />

        <Routes>
          <Route path="/" element={
            <main className="relative pt-44 pb-20 px-6 text-center">
              <motion.div 
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.2 }}
                className="max-w-6xl mx-auto"
              >
                {/* Status Badge */}
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-10">
                  <Sparkles size={12} /> Hackathons 2025 are calling
                </motion.div>

                {/* Main Heading */}
                <motion.h1 variants={fadeUp} className="text-6xl md:text-[110px] font-black leading-[0.9] tracking-tighter mb-10">
                  BUILD THE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 uppercase">
                    IMPOSSIBLE.
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p variants={fadeUp} className="text-gray-500 text-lg md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                  Stop looking for "someone who can code". Find the <span className="text-blue-500 italic">missing piece</span> of your next winning hackathon squad.
                </motion.p>

                {/* Buttons */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link to="/signup" className="px-12 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3">
                    FIND SQUAD <ArrowRight size={22} />
                  </Link>
                  <button className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black text-xl rounded-2xl hover:bg-white/10 transition-all">
                    EXPLORE PROJECTS
                  </button>
                </motion.div>

                {/* FEATURE CARDS */}
                <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: "SKILL SYNC", desc: "Our AI matches you based on your tech stack & GitHub.", icon: Code },
                    { title: "SQUAD UP", desc: "One-click team formation for solo hackers.", icon: Boxes },
                    { title: "WIN BIG", desc: "Get access to exclusive global competitions.", icon: Trophy },
                  ].map((feature, i) => (
                    <motion.div 
                      key={i}
                      variants={fadeUp}
                      whileHover={{ y: -10 }}
                      className="p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left backdrop-blur-sm group hover:border-blue-500/50 transition-all"
                    >
                      <feature.icon className="text-blue-500 mb-6 group-hover:scale-125 transition-transform" size={35} />
                      <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{feature.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </main>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;