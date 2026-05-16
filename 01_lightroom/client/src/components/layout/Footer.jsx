import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const services = ['Wedding Photography','Birthday Photography','Bridal Shoot','Pre-Wedding Shoot','Corporate Events','Fashion Shoot']
const links = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/videos', label: 'Video Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/booking', label: 'Book Now' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border pt-16 pb-8 px-[5%]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="font-serif text-2xl font-light mb-4">The <span className="text-gold italic">Lightroom</span></h3>
          <p className="text-grey-light text-sm leading-relaxed mb-6">We don't just take photographs. We preserve emotions. Premium studio serving clients across India since 2014.</p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 border border-border flex items-center justify-center text-grey hover:border-gold hover:text-gold transition-all duration-300">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-5">Services</h4>
          <ul className="space-y-2.5">
            {services.map(s => (
              <li key={s}><Link to="/services" className="text-grey-light text-sm hover:text-gold transition-colors duration-300">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-5">Quick Links</h4>
          <ul className="space-y-2.5">
            {links.map(l => (
              <li key={l.to}><Link to={l.to} className="text-grey-light text-sm hover:text-gold transition-colors duration-300">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-5">Contact</h4>
          <div className="space-y-4">
            {[
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: Mail, text: 'hello@thelightroom.com' },
              { Icon: MapPin, text: 'Studio 4B, Connaught Place\nNew Delhi – 110001' },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon size={14} className="text-gold mt-0.5 shrink-0" />
                <p className="text-grey-light text-sm whitespace-pre-line">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-grey text-xs">© {new Date().getFullYear()} The Lightroom Photography. All rights reserved.</p>
        <p className="text-grey text-xs tracking-widest uppercase">Where Light Meets Emotion</p>
      </div>
    </footer>
  )
}
