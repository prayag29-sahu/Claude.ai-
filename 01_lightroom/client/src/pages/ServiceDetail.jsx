import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const serviceData = {
  wedding: {
    title: 'Wedding Photography',
    tagline: 'Cinematic Wedding Stories',
    desc: 'Your wedding day is the most important day of your life. Our wedding photography and cinematography team ensures every precious moment — from the morning preparations to the final dance — is captured with artistry, emotion, and technical excellence.',
    includes: ['Cinematic Wedding Film (5-8 min)','Full Day Coverage (Engagement to Reception)','Traditional & Candid Photography','Drone Aerial Coverage','Pre-Wedding Couple Session','Dedicated 2nd Photographer','Styled Detail Shots','Online Private Gallery (1 Year)','USB + Printed Album','30-Day Delivery'],
    faqs: [
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 6-12 months in advance for wedding coverage, especially for peak season (Oct-Feb).' },
      { q: 'What happens if there is bad weather?', a: 'We are fully equipped and experienced to shoot in all weather conditions. Rain can even add beautiful drama to your photos!' },
      { q: 'Do you travel for destination weddings?', a: 'Absolutely! We love destination weddings. Travel and accommodation costs are charged separately based on location.' },
      { q: 'Can we request specific shots?', a: 'Yes! We always have a detailed consultation before your wedding to understand your must-have shots and vision.' },
    ]
  }
}

const packages = [
  { name: 'Essential', price: '29,999', features: ['8 Hours Coverage','1 Photographer','200 Edited Photos','Online Gallery','15-Day Delivery'] },
  { name: 'Premium', price: '59,999', featured: true, features: ['Full Day Coverage','2 Photographers','500+ Edited Photos','Cinematic Film','Drone Shots','Printed Album','10-Day Delivery'] },
  { name: 'Luxury', price: '99,999', features: ['Multi-Day Coverage','3 Photographers + Team','Unlimited Photos','Full Cinema Film','Drone + Gimbal','Luxury Album','Pre-Wedding Shoot','7-Day Delivery'] },
]

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = serviceData[slug] || serviceData.wedding
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Banner */}
      <div className="px-[5%] bg-dark py-16 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <span className="section-label">{service.tagline}</span>
            <h1 className="section-title mb-4">{service.title}</h1>
            <div className="divider mx-auto" />
            <p className="text-grey-light text-sm leading-relaxed max-w-2xl mx-auto">{service.desc}</p>
            <Link to="/booking" className="btn-primary mt-8 inline-block">Book This Service</Link>
          </RevealOnScroll>
        </div>
      </div>

      <div className="px-[5%] max-w-6xl mx-auto">
        {/* What's Included */}
        <RevealOnScroll className="mb-16">
          <h2 className="font-serif text-3xl font-light mb-6">What's <em className="text-gold italic">Included</em></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.includes.map(inc => (
              <div key={inc} className="flex items-center gap-3 bg-card border border-border p-3">
                <CheckCircle size={14} className="text-gold shrink-0" />
                <span className="text-sm text-grey-light">{inc}</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Pricing */}
        <RevealOnScroll className="mb-16">
          <h2 className="font-serif text-3xl font-light mb-8">Choose Your <em className="text-gold italic">Package</em></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <div key={pkg.name} className={`p-6 border relative ${pkg.featured ? 'bg-[#1a1508] border-gold' : 'bg-card border-border'}`}>
                {pkg.featured && <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gold text-black text-[0.6rem] uppercase tracking-widest px-3 py-1">Most Popular</div>}
                <p className="text-[0.65rem] tracking-widest uppercase text-gold mb-2">{pkg.name}</p>
                <div className="font-serif text-4xl font-light mb-1"><span className="text-xl">₹</span>{pkg.price}</div>
                <p className="text-grey text-xs mb-4">Starting price</p>
                <div className="h-px bg-border mb-4" />
                <ul className="space-y-2 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className="text-grey-light text-xs flex items-center gap-2"><span className="text-gold">—</span>{f}</li>
                  ))}
                </ul>
                <Link to="/booking" className={`w-full block text-center py-2.5 text-[0.7rem] tracking-widest uppercase transition-all duration-300 border ${
                  pkg.featured ? 'bg-gold border-gold text-black hover:opacity-90' : 'border-border text-grey-light hover:border-gold hover:text-gold'
                }`}>Book Now</Link>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* FAQ */}
        <RevealOnScroll>
          <h2 className="font-serif text-3xl font-light mb-6">Frequently Asked <em className="text-gold italic">Questions</em></h2>
          <div className="space-y-2">
            {service.faqs.map((faq, i) => (
              <div key={i} className="border border-border">
                <button className="w-full flex justify-between items-center p-4 text-left hover:bg-card transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-medium">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-gold shrink-0" /> : <ChevronDown size={16} className="text-grey-light shrink-0" />}
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-grey-light text-sm leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
