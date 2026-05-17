import { Link } from 'react-router-dom'
import { Heart, Star, Camera, Users, Video, Aperture, Baby, Sparkles, ArrowRight } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const services = [
  {
    icon: Heart,
    title: 'Wedding Photography',
    slug: 'wedding',
    price: 'From ₹35,000',
    badge: 'Most Booked',
    desc: 'Complete wedding coverage — traditional photography, candid moments, cinematic films and drone coverage across all ceremonies.',
    includes: [
      'Traditional Video (Pen Drive)',
      'Candid Photography',
      'Cinematography & Reels',
      'Haldi / Mehndi / Sangeet / Wedding',
    ],
  },
  {
    icon: Sparkles,
    title: 'Pre-Wedding Shoot',
    slug: 'pre-wedding',
    price: 'Included in Platinum',
    badge: null,
    desc: 'Romantic and cinematic pre-wedding sessions with candid photography, cinematography, drone and reels — telling your love story before the big day.',
    includes: [
      '01 Candid Photography',
      '01 Cinematography',
      '01 Reels Maker',
      '01 Drone Coverage',
    ],
  },
  {
    icon: Video,
    title: 'Cinematic Films',
    slug: 'wedding',
    price: 'Included in all packages',
    badge: null,
    desc: 'Beautifully crafted highlight films, 30–50 second teasers and 4–7 minute features that relive your most precious moments.',
    includes: [
      '30–50 Second Teaser',
      '4–7 Minute Highlight Film',
      'Traditional Video (Pen Drive)',
      'Reels on Social Media',
    ],
  },
  {
    icon: Camera,
    title: 'Bridal Photography',
    slug: 'bridal',
    price: 'On request',
    badge: null,
    desc: 'Elegantly styled bridal sessions that celebrate your grace, jewellery and look — timeless portraits you will cherish forever.',
    includes: [
      'Studio / outdoor session',
      'Multiple outfit changes',
      'Retouched gallery',
      'Print-ready files',
    ],
  },
  {
    icon: Aperture,
    title: 'Haldi & Mehndi Coverage',
    slug: 'wedding',
    price: 'Included in Gold / Platinum',
    badge: null,
    desc: 'Vibrant, colourful coverage of your Haldi, Mehndi and Sangeet ceremonies — capturing all the fun and emotions of the pre-wedding rituals.',
    includes: [
      'Full ceremony coverage',
      'Candid & group moments',
      'Photo + Video Shoot',
      'Ceremony highlight reel',
    ],
  },
  {
    icon: Star,
    title: 'Engagement Shoot',
    slug: 'engagement',
    price: 'On request',
    badge: null,
    desc: 'Beautiful engagement session photography that marks the beginning of your forever love story — candid and posed across stunning locations.',
    includes: [
      '2–3 hour session',
      'Multiple locations',
      'Quick preview delivery',
      'Full edited gallery',
    ],
  },
  {
    icon: Users,
    title: 'Events & Corporate',
    slug: 'events',
    price: 'On request',
    badge: null,
    desc: 'Professional event documentation for corporate gatherings, product launches and social events — fast turnaround, print-quality files.',
    includes: [
      'Full event coverage',
      'Stage & speaker shots',
      'Event highlight film',
      'Fast delivery',
    ],
  },
  {
    icon: Baby,
    title: 'Baby & Kids Shoot',
    slug: 'baby',
    price: 'On request',
    badge: null,
    desc: 'Adorable and safe newborn and baby photography that treasures the tiniest precious moments — soft lighting, safe posing and quick delivery.',
    includes: [
      'Safe baby posing',
      'Props & theme setup',
      'Sibling & family shots',
      'Quick delivery',
    ],
  },
]

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">What We Offer</span>
        <h1 className="section-title">Our <em className="text-gold italic">Services</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">
          Premium photography &amp; cinematography for every precious moment of your life.
          <br />
          <span className="text-gold text-xs tracking-widest">@photoking324 · photoking324@gmail.com</span>
        </p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <RevealOnScroll key={s.slug + s.title} delay={i * 0.06}>
            <div className="bg-card border border-border p-6 group hover:border-gold/40 transition-all duration-300 h-full flex flex-col relative">
              {/* Badge */}
              {s.badge && (
                <div className="absolute -top-px right-4 bg-gold text-black text-[0.55rem] uppercase tracking-widest px-3 py-0.5">
                  {s.badge}
                </div>
              )}

              {/* Icon */}
              <div className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold mb-4 group-hover:border-gold/50 transition-colors">
                <s.icon size={18} strokeWidth={1.2} />
              </div>

              {/* Title & price */}
              <h3 className="font-serif text-xl font-light mb-1">{s.title}</h3>
              <p className="text-gold text-[0.65rem] tracking-widest uppercase mb-3">{s.price}</p>

              <p className="text-grey-light text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>

              {/* Includes */}
              <ul className="space-y-1.5 mb-5">
                {s.includes.map(inc => (
                  <li key={inc} className="text-grey-light text-xs flex items-start gap-2">
                    <span className="text-gold mt-0.5">—</span> {inc}
                  </li>
                ))}
              </ul>

              <Link
                to="/pricing"
                className="text-gold text-[0.68rem] tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all duration-300"
              >
                View Packages <ArrowRight size={12} />
              </Link>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Pricing CTA */}
      <RevealOnScroll className="text-center mt-16">
        <div className="inline-block border border-gold/20 p-8 max-w-xl">
          <p className="text-grey-light text-sm mb-4">
            All packages include photo + video shoot, traditional video on pen drive, album and social media reels.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/pricing" className="btn-primary">View All Packages</Link>
            <Link to="/contact" className="btn-gold-outline">Get a Quote</Link>
          </div>
          <p className="text-grey text-xs mt-4 tracking-widest">
            25% Advance · 50% Wedding Day · 25% On Completion
          </p>
        </div>
      </RevealOnScroll>
    </div>
  )
}
