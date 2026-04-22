import React, { useEffect, useState } from 'react';
import API from '../api';
import { motion } from "framer-motion";

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get('/projects');
        setProjects(data);
      } catch (err) {
        console.error("Backend se data nahi aaya!", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] pt-32 px-10">
      <h1 className="text-5xl font-black mb-10 text-center italic uppercase tracking-tighter">
        Active <span className="text-blue-500">Projects</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((proj) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={proj._id} 
            className="p-8 bg-white/[0.03] border border-white/10 rounded-[30px] hover:border-blue-500/50 transition-all"
          >
            <h2 className="text-2xl font-black text-blue-400 mb-3 uppercase italic">{proj.title}</h2>
            <p className="text-gray-400 mb-5 font-medium leading-relaxed">{proj.description}</p>
            <div className="flex flex-wrap gap-2">
              {proj.techStack?.map((tech, i) => (
                <span key={i} className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreProjects;