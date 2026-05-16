import { Link } from 'react-router-dom'
import { Heart, Star, Sparkles, Camera, Users, Shirt } from 'lucide-react'
import RevealOnScroll from '../ui/RevealOnScroll'

const services = [
  { icon: Heart, num:'01', title:'Wedding Photography', slug:'wedding', desc:'Cinematic wedding films, traditional coverage, drone shots, and intimate couple sessions that tell your love story.' },
  { icon: Star, num:'02', title:'Birthday Photography', slug:'birthday', desc:'Capturing the joy, laughter, and milestones of your special day with creative compositions.' },
  { icon: Sparkles, num:'03', title:'Bridal Shoot', slug:'bridal', desc:'Elegantly styled bridal portraits celebrating your beauty and the emotion of this extraordinary moment.' },
  { icon: Camera, num:'04', title:'Pre-Wedding Shoot', slug:'pre-wedding', desc:'Romantic sessions at breathtaking locations that set the tone for your wedding narrative.' },
  { icon: Users, num:'05', title:'Events & Corporate', slug:'events', desc:'Professional coverage of corporate events, conferences, and product launches with editorial precision.' },
  { icon: Shirt, num:'06', title:'Fashion & Model Shoot', slug:'fashion', desc:'High-fashion editorial photography for models, brands, and creatives seeking magazine-quality content.' },
]

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
      {services.map((s, i) => (
        <RevealOnScroll key={s.slug} delay={i * 0.08}>
          <div className="bg-card p-8 relative overflow-hidden group hover:bg-[#191919] transition-colors duration-300 h-full">
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <div className="font-serif text-[5rem] font-light text-gold/5 absolute top-4 right-4 leading-none select-none">{s.num}</div>
            <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold mb-5">
              <s.icon size={20} strokeWidth={1.2} />
            </div>
            <h3 className="font-serif text-xl font-light mb-3">{s.title}</h3>
            <p className="text-grey-light text-sm leading-relaxed mb-5">{s.desc}</p>
            <Link to={`/services/${s.slug}`} className="text-gold text-[0.68rem] tracking-[0.15em] uppercase flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
              Explore Service <span>→</span>
            </Link>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  )
}
