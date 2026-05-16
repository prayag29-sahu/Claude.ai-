import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const categories = ['Wedding', 'Corporate Events', 'Birthday Parties', 'Anniversary', 'Festivals']
  const services = [
    { label: 'Tent House', to: '/services?category=Tent' },
    { label: 'DJ & Sound', to: '/services?category=DJ' },
    { label: 'Catering', to: '/services?category=Catering' },
    { label: 'Decoration', to: '/services?category=Decoration' },
    { label: 'Full Event Management', to: '/services?category=Full+Event' },
  ]

  return (
    <footer className="bg-regal-950 border-t border-white/5 mt-auto">
      {/* Main Footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-regal-950 font-accent font-bold text-lg">V</span>
              </div>
              <span className="font-accent text-xl text-gradient-gold">VisionVivaah</span>
            </Link>
            <p className="font-body text-white/50 text-sm leading-relaxed mb-5">
              Creating unforgettable memories with luxury event management services across India.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'twitter', 'youtube'].map(social => (
                <a key={social} href={`https://${social}.com`} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:border-gold-500/50 hover:shadow-gold transition-all duration-200">
                  <span className="text-white/50 hover:text-gold-400 text-xs uppercase">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-accent text-gold-400 font-medium mb-5 text-sm tracking-widest uppercase">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s.label}>
                  <Link to={s.to} className="font-body text-white/50 text-sm hover:text-gold-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-500/50"></span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Types */}
          <div>
            <h4 className="font-accent text-gold-400 font-medium mb-5 text-sm tracking-widest uppercase">Events We Cover</h4>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat}>
                  <span className="font-body text-white/50 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-500/50"></span>
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-accent text-gold-400 font-medium mb-5 text-sm tracking-widest uppercase">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gold-500 mt-0.5">📍</span>
                <p className="font-body text-white/50 text-sm">123 Event Plaza, MG Road<br />Indore, MP 452001</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold-500">📞</span>
                <a href="tel:+919876543210" className="font-body text-white/50 text-sm hover:text-gold-400 transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold-500">✉️</span>
                <a href="mailto:hello@visionvivaah.com" className="font-body text-white/50 text-sm hover:text-gold-400 transition-colors">hello@visionvivaah.com</a>
              </div>
            </div>

            <div className="mt-6 p-4 glass-card rounded-xl">
              <p className="font-body text-gold-400 text-sm font-medium mb-1">Working Hours</p>
              <p className="font-body text-white/50 text-xs">Mon–Sat: 9:00 AM – 8:00 PM</p>
              <p className="font-body text-white/50 text-xs">Sunday: 10:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-white/30 text-xs">
            © {currentYear} VisionVivaah. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map(item => (
              <a key={item} href="#" className="font-body text-white/30 text-xs hover:text-gold-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
