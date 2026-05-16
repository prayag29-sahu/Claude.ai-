import { Link } from 'react-router-dom'
import { Heart, Star, Sparkles, Camera, Users, Shirt, Baby, Circle, ArrowRight } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const services = [
  { icon: Heart, title:'Wedding Photography', slug:'wedding', desc:'Complete wedding coverage with cinematic films, traditional photography, drone shots, and intimate couple sessions.', includes:['Full day coverage','Cinematic wedding film','Traditional photography','Drone aerial shots','Couple session','Edited gallery'] },
  { icon: Star, title:'Birthday Photography', slug:'birthday', desc:'Vibrant, joyful birthday photography that captures every laugh, every candle, every precious milestone.', includes:['Event decoration shots','Candid moments','Cake cutting','Group photographs','Same-day preview','HD gallery'] },
  { icon: Sparkles, title:'Bridal Shoot', slug:'bridal', desc:'Elegantly styled pre-bridal and bridal photography sessions celebrating your grace and beauty.', includes:['Studio or outdoor shoot','Multiple outfit changes','Makeup coordination','Prop styling','Retouched gallery','Print-ready files'] },
  { icon: Camera, title:'Pre-Wedding Shoot', slug:'pre-wedding', desc:'Romantic and cinematic pre-wedding sessions at stunning locations across India and abroad.', includes:['Location scouting','Outfit planning','Cinematic couple film','50+ edited photos','Props & styling','Online gallery'] },
  { icon: Users, title:'Events & Corporate', slug:'events', desc:'Professional event documentation for corporate gatherings, conferences, product launches, and social events.', includes:['Full event coverage','Stage & speaker shots','Crowd & venue shots','Fast turnaround','Print-quality files','Event highlight film'] },
  { icon: Shirt, title:'Fashion & Model Shoot', slug:'fashion', desc:'High-fashion editorial photography for aspiring and professional models, brands, and creative projects.', includes:['Studio/outdoor shoot','Multiple looks','Creative direction','Retouched selects','Print & digital formats','Portfolio layout guide'] },
  { icon: Baby, title:'Baby Shoot', slug:'baby', desc:'Adorable and safe newborn and baby photography that treasures the tiniest precious moments of life.', includes:['Safe baby posing','Props & wraps','Sibling shots','Family portraits','Soft lighting setup','Quick delivery'] },
  { icon: Circle, title:'Engagement', slug:'engagement', desc:'Beautiful engagement session photography that marks the beginning of your forever love story together.', includes:['2-3 hour session','Multiple locations','Engagement rings focus','Candid & posed shots','Quick preview','Full edited gallery'] },
]

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">What We Offer</span>
        <h1 className="section-title">Our <em className="text-gold italic">Services</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">Professional photography and cinematography for every precious moment of your life.</p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <RevealOnScroll key={s.slug} delay={i * 0.06}>
            <div className="bg-card border border-border p-6 group hover:border-gold/30 transition-all duration-300 h-full flex flex-col">
              <div className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold mb-4 group-hover:border-gold/50 transition-colors">
                <s.icon size={18} strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-xl font-light mb-2">{s.title}</h3>
              <p className="text-grey-light text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
              <ul className="space-y-1 mb-5">
                {s.includes.slice(0,4).map(inc => (
                  <li key={inc} className="text-grey-light text-xs flex items-center gap-2">
                    <span className="text-gold">—</span> {inc}
                  </li>
                ))}
              </ul>
              <Link to={`/services/${s.slug}`} className="text-gold text-[0.68rem] tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all duration-300 group-hover:text-gold-light">
                View Details <ArrowRight size={12} />
              </Link>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  )
}
