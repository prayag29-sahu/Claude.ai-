import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

export default function BlogPost() {
  const { slug } = useParams()
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-[5%]">
        <RevealOnScroll>
          <Link to="/blog" className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span className="text-gold text-[0.65rem] uppercase tracking-widest">Wedding Tips</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mt-2 mb-4">10 Essential Tips for Perfect Wedding Photography Lighting</h1>
          <div className="flex items-center gap-4 text-grey text-xs mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1"><Calendar size={10}/> March 15, 2024</span>
            <span className="flex items-center gap-1"><Clock size={10}/> 5 min read</span>
            <span>By The Lightroom Team</span>
          </div>

          <div className="bg-gradient-to-br from-[#1c1610] to-[#2e2010] aspect-[16/7] mb-8 flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(198,165,92,0.15)" strokeWidth="0.5">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </div>

          <div className="prose prose-invert max-w-none space-y-4 text-grey-light text-sm leading-relaxed">
            <p>Lighting is the single most important technical element in photography. It shapes mood, defines texture, and reveals emotion. For wedding photographers, mastering both natural and artificial light is what separates good images from extraordinary ones.</p>
            <h2 className="font-serif text-2xl text-cream font-light mt-8 mb-3">1. Embrace Golden Hour</h2>
            <p>The hour after sunrise and before sunset casts warm, soft, directional light that is simply magical for outdoor portraits. Plan your couple session around this window whenever possible.</p>
            <h2 className="font-serif text-2xl text-cream font-light mt-8 mb-3">2. Scout Your Venue</h2>
            <p>Visit the venue at the same time of day as the wedding. Note where the windows are, which direction they face, and where shadows will fall during key moments like the ceremony and first dance.</p>
            <h2 className="font-serif text-2xl text-cream font-light mt-8 mb-3">3. Bounce, Don't Blast</h2>
            <p>When using flash, always bounce off walls or ceilings rather than pointing directly at subjects. This creates soft, wrap-around light that looks natural and flattering.</p>
            <p>The remaining tips cover using off-camera flash, dealing with mixed lighting, window light techniques, overcast conditions, and more. Each principle builds upon understanding how light shapes the story you are trying to tell.</p>
          </div>

          <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
            <Link to="/blog" className="btn-gold-outline text-xs">← More Articles</Link>
            <Link to="/booking" className="btn-primary text-xs">Book a Session</Link>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
