import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-8">
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-black/50 border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-2xl">
        
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            <Zap size={18} className="text-white fill-current" />
          </motion.div>
          <span className="text-xl font-black text-white tracking-widest uppercase">
            HACK<span className="text-blue-500">MATCH</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-white transition">SIGN IN</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg">
            JOIN NOW
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;