import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Mail, Phone } from 'lucide-react'

const services = [
  'Wedding Photography',
  'Pre-Wedding Shoot',
  'Candid Photography',
  'Cinematography',
  'Drone Coverage',
  'Reels & Highlights',
]

const quickLinks = [
  { to: '/portfolio',  label: 'Portfolio' },
  { to: '/services',   label: 'Services' },
  { to: '/pricing',    label: 'Pricing' },
  { to: '/videos',     label: 'Film Gallery' },
  { to: '/contact',    label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border pt-16 pb-8 px-[5%]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <h3 className="font-serif text-2xl font-light mb-4">The <span className="text-gold italic">Lightroom</span></h3>
          <p className="text-grey-light text-sm leading-relaxed mb-2">
            We don't just take photographs. We preserve emotions.
          </p>
          <p className="text-grey text-xs mb-4 tracking-widest">@photoking324</p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/photoking324" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 border border-border flex items-center justify-center text-grey hover:border-gold hover:text-gold transition-all duration-300">
              <Instagram size={14} />
            </a>
            {[Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 border border-border flex items-center justify-center text-grey hover:border-gold hover:text-gold transition-all duration-300">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-5">Services</h4>
          <ul className="space-y-2.5">
            {services.map(s => (
              <li key={s}>
                <Link to="/services" className="text-grey-light text-sm hover:text-gold transition-colors duration-300">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-5">Quick Links</h4>
          <ul className="space-y-2.5">
            {quickLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-grey-light text-sm hover:text-gold transition-colors duration-300">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-5">Contact</h4>
          <div className="space-y-4">
            {[
              { Icon: Phone, text: '+91 91094 22772', href: 'tel:+919109422772' },
              { Icon: Phone, text: '+91 77718 50846', href: 'tel:+917771850846' },
              { Icon: Mail,  text: 'photoking324@gmail.com', href: 'mailto:photoking324@gmail.com' },
            ].map(({ Icon, text, href }, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon size={14} className="text-gold mt-0.5 shrink-0" />
                {href
                  ? <a href={href} className="text-grey-light text-sm hover:text-gold transition-colors">{text}</a>
                  : <p className="text-grey-light text-sm whitespace-pre-line">{text}</p>
                }
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-border/40">
            <p className="text-grey text-xs mb-2">Packages starting from</p>
            <p className="text-gold font-serif text-lg">₹35,000 /-</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-grey text-xs">© {new Date().getFullYear()} The Lightroom Photography. All rights reserved.</p>
        <p className="text-grey text-xs tracking-widest uppercase">Where Light Meets Emotion · @photoking324</p>
      </div>
    </footer>
  )
}
