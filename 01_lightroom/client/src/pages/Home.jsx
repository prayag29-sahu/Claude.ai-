import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Play, ArrowRight } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import ServicesGrid from '../components/sections/ServicesGrid'
import GalleryPreview from '../components/sections/GalleryPreview'
import StatsCounter from '../components/sections/StatsCounter'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1208] to-[#0a0a0a]">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#c6a55c" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px] animate-float" style={{animationDelay:'-3s'}} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}
            className="inline-block border border-gold/20 text-gold text-[0.65rem] tracking-[0.3em] uppercase px-5 py-2 mb-8">
            Premium Photography Studio
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-6">
            Capturing Moments<br />That Last <em className="text-gold">Forever</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
            className="text-grey-light text-sm tracking-widest mb-10 max-w-xl mx-auto">
            Premium Wedding, Events & Portrait Photography Studio
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}
            className="flex gap-4 justify-center flex-wrap">
            <Link to="/portfolio" className="btn-primary">View Portfolio</Link>
            <Link to="/booking" className="btn-outline">Book Now</Link>
          </motion.div>
        </div>

        {/* Stats on right */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6 }}
          className="absolute right-[5%] bottom-20 hidden xl:flex flex-col gap-6 text-right">
          {[{ num: '10+', label: 'Years Experience' }, { num: '1K+', label: 'Events Covered' }, { num: '500+', label: 'Happy Clients' }].map(s => (
            <div key={s.label}>
              <span className="font-serif text-3xl text-gold block leading-none">{s.num}</span>
              <span className="text-grey text-[0.62rem] tracking-[0.15em] uppercase">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <span className="text-grey text-[0.62rem] tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown size={16} className="text-gold animate-bounce" />
        </motion.div>
      </section>

      {/* About */}
      <section className="py-24 px-[5%] bg-dark" id="about">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <RevealOnScroll direction="left">
            <div className="relative">
              <div className="w-full h-[550px] overflow-hidden bg-gradient-to-br from-[#1c1408] to-[#2a1c08] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(198,165,92,0.1)_20px,rgba(198,165,92,0.1)_40px)]" />

                <img src="/photoshoot/2.jpg" alt="" />
              </div>
              <div className="absolute inset-[-12px] border border-gold/15 pointer-events-none" />
              <div className="absolute bottom-[-1.5rem] right-[-1.5rem] w-24 h-24 rounded-full bg-gold flex flex-col items-center justify-center">
                <span className="font-serif text-2xl text-black leading-none">10</span>
                <span className="text-[0.5rem] text-black uppercase tracking-wide text-center leading-tight">Years of<br/>Excellence</span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right">
            <span className="section-label">About Studio</span>
            <h2 className="section-title mb-4">
              We Don't Just Take Photographs.<br />We <em className="text-gold italic">Preserve</em> Emotions.
            </h2>
            <div className="divider" />
            <p className="text-grey-light leading-relaxed mb-4 text-sm">
              Founded with a passion for storytelling through light and shadow, The Lightroom Photography has been crafting visual narratives for over a decade. Our team brings artistry and technical excellence to every frame.
            </p>
            <p className="text-grey-light leading-relaxed mb-8 text-sm">
              From intimate bridal portraits to grand wedding celebrations, corporate events to fashion editorials — we approach every assignment with meticulous attention to detail and deep commitment to authenticity.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
              {[{ n: '1,247', l: 'Events Captured' }, { n: '98%', l: 'Client Satisfaction' }, { n: '47', l: 'Awards Won' }].map(s => (
                <div key={s.l}>
                  <span className="font-serif text-3xl text-gold block leading-none mb-1">{s.n}</span>
                  <span className="text-grey text-[0.65rem] uppercase tracking-wider">{s.l}</span>
                </div>
              ))}
            </div>
            <Link to="/portfolio" className="btn-gold-outline mt-8 inline-flex items-center gap-2">
              Explore Our Work <ArrowRight size={14} />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-[5%]">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="text-center mb-14">
            <span className="section-label">What We Offer</span>
            <h2 className="section-title">Our <em className="text-gold italic">Services</em></h2>
          </RevealOnScroll>
          <ServicesGrid />
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 px-[5%] bg-dark">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="flex justify-between items-end mb-10 flex-wrap gap-4">
            <div>
              <span className="section-label">Our Work</span>
              <h2 className="section-title">Featured <em className="text-gold italic">Portfolio</em></h2>
            </div>
            <Link to="/portfolio" className="btn-gold-outline text-xs">View All</Link>
          </RevealOnScroll>
          <GalleryPreview />
        </div>
      </section>

      {/* Stats */}
      <StatsCounter />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-24 px-[5%] relative overflow-hidden bg-gradient-to-b from-dark to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
        </div>
        <RevealOnScroll className="relative z-10 text-center max-w-3xl mx-auto">
          <span className="section-label">Start Your Journey</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4">
            Every Frame Tells a <em className="text-gold italic">Story.</em><br />Let's Tell Yours.
          </h2>
          <p className="text-grey-light text-sm mb-10">Where Light Meets Emotion · Premium Photography Studio</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/booking" className="btn-primary">Book a Consultation</Link>
            <a href="tel:+919876543210" className="btn-outline">Call Us Now</a>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  )
}
