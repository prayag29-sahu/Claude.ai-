import React from "react";
import { motion } from "framer-motion";
export default function SectionHeader({ subtitle, title, description, center = true }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={center ? "text-center" : ""}>
      <p className="section-subtitle">{subtitle}</p>
      <h2 className="section-title">{title}</h2>
      <div className={`w-16 h-px bg-gold-500 my-5 ${center ? "mx-auto" : ""}`} />
      {description && <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">{description}</p>}
    </motion.div>
  );
}
