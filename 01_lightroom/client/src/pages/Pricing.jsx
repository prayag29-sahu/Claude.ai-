import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const packages = [
  { tier:'Essential', price:'29,999', period:'Starting price', color:'border-border', features:['8 Hours Coverage','1 Photographer','200 Edited Photos','Online Private Gallery','HD Resolution Files','15-Day Delivery','Email Support'] },
  { tier:'Premium', price:'59,999', period:'Starting price', featured:true, color:'border-gold', features:['Full Day Coverage','2 Photographers','500+ Edited Photos','Cinematic Highlight Film','Drone Coverage','Printed Album','Client Portal Access','10-Day Delivery','Dedicated Support'] },
  { tier:'Luxury', price:'99,999', period:'Starting price', color:'border-border', features:['Multi-Day Coverage','3 Photographers + Crew','Unlimited Edited Photos','Full Cinematic Film','Drone + Gimbal Coverage','Luxury Photo Album','Pre-Wedding Shoot','7-Day Delivery','Priority Support','Instagram-Sized Previews'] },
]

export default function Pricing() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Investment</span>
        <h1 className="section-title">Choose Your <em className="text-gold italic">Package</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-xl mx-auto">Every package includes pre-shoot consultation, post-production editing, and an online gallery. Custom packages available on request.</p>
      </RevealOnScroll>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {packages.map((pkg, i) => (
          <RevealOnScroll key={pkg.tier} delay={i * 0.1}>
            <div className={`border p-7 relative ${pkg.featured ? 'bg-[#1a1508] border-gold scale-[1.02]' : 'bg-card border-border'}`}>
              {pkg.featured && <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gold text-black text-[0.6rem] uppercase tracking-widest px-4 py-1 whitespace-nowrap">Most Popular</div>}
              <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-3">{pkg.tier}</p>
              <div className="font-serif font-light mb-1"><span className="text-xl">₹</span><span className="text-4xl">{pkg.price}</span></div>
              <p className="text-grey text-xs mb-4">{pkg.period}</p>
              <div className="h-px bg-border mb-4" />
              <ul className="space-y-2.5 mb-6">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-grey-light text-sm">
                    <CheckCircle size={12} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/booking" className={`block w-full text-center py-3 text-[0.72rem] tracking-widest uppercase transition-all duration-300 border ${
                pkg.featured ? 'bg-gold border-gold text-black hover:opacity-90' : 'border-border text-grey-light hover:border-gold hover:text-gold'
              }`}>Book Now</Link>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll className="text-center mt-12">
        <p className="text-grey-light text-sm">Need a custom package? <Link to="/contact" className="text-gold hover:underline">Get in touch</Link> and we'll create the perfect plan for you.</p>
      </RevealOnScroll>
    </div>
  )
}
