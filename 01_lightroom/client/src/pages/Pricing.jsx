import { useNavigate } from 'react-router-dom'
import { CheckCircle, Camera, Star } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const packages = [
  {
    tier: 'Silver',
    subtitle: 'Wedding Shoot – 2 Day',
    price: '35,000',
    featured: false,
    tag: null,
    inclusions: [
      '01 Traditional Video (Pen Drive)',
      '01 Traditional Photo',
      'Haldi + Wedding Coverage',
      'Photo + Video Shoot',
    ],
    deliverables: [
      '200 Photos Selected Album',
      '30 Sheets with Album NTR 12×18',
      '01 Photo Frame',
      'Reels on Social Media (Wedding Day)',
      'All Photo + Cinematic Side Work',
    ],
    payment: ['25% Advance', '50% On Wedding Day', '25% On Work Completion'],
  },
  {
    tier: 'Gold',
    subtitle: 'Wedding Shoot – 3 Day',
    price: '90,000',
    featured: true,
    tag: 'Most Popular',
    inclusions: [
      '01 Traditional Video (Pen Drive)',
      '01 Traditional Photo',
      '01 Candid Photography',
      '01 Cinematography',
      '01 Reels Maker',
      'Haldi, Mehndi, Sangeet & Wedding',
      'Photo + Video Shoot',
    ],
    deliverables: [
      '200 Photos Selected Album',
      '30 Sheets with Box Album NTR 12×18',
      '30–50 Second Teaser',
      '4–7 Minute Highlight Film',
      '01 Photo Frame',
      'Reels on Social Media',
      'All Photo + Cinematic Side Work',
    ],
    payment: ['25% Advance', '50% On Wedding Day', '25% On Work Completion'],
  },
  {
    tier: 'Platinum',
    subtitle: 'Pre-Wedding + 3 Day Wedding',
    price: '1,80,000',
    featured: false,
    tag: 'Premium',
    inclusions: [
      '01 Candid Photography',
      '01 Cinematography',
      '01 Reels Maker',
      '01 Drone Coverage',
      '100 Pre-Wedding Photos (Edited)',
      'Pre-Wedding Highlight Film',
      '01 Traditional Video (Pen Drive)',
      '01 Traditional Photo',
      'Haldi, Mehndi, Sangeet & Wedding',
      'Photo + Video Shoot',
    ],
    deliverables: [
      '220 Photos Selected Album',
      '40 Sheets with Box Album NTR 16×24',
      '02 Albums NTR 16×24',
      '30–50 Second Teaser',
      '4–7 Minute Highlight Film',
      '01 Photo Frame',
      'Reels on Social Media',
      'All Photo + Cinematic Side Work',
    ],
    payment: ['25% Advance', '50% On Wedding Day', '25% On Work Completion'],
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  const handleBook = (pkg) => {
    navigate('/contact', {
      state: {
        packageName: `${pkg.tier} Package – ${pkg.subtitle}`,
        packagePrice: `₹${pkg.price}`,
        packageDetails: [
          `Inclusions: ${pkg.inclusions.join(', ')}`,
          `Deliverables: ${pkg.deliverables.join(', ')}`,
          `Payment: ${pkg.payment.join(' | ')}`,
        ].join('\n'),
      },
    })
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Investment</span>
        <h1 className="section-title">Wedding <em className="text-gold italic">Packages</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-xl mx-auto">
          Every package is crafted to capture your special moments beautifully. Custom packages available on request.
          <br />
          <span className="text-gold text-xs tracking-widest uppercase mt-2 inline-block">@photoking324</span>
        </p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {packages.map((pkg, i) => (
          <RevealOnScroll key={pkg.tier} delay={i * 0.1}>
            <div className={`border relative flex flex-col ${pkg.featured ? 'bg-[#1a1508] border-gold scale-[1.02]' : 'bg-card border-border'}`}>
              {/* Tag */}
              {pkg.tag && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gold text-black text-[0.6rem] uppercase tracking-widest px-4 py-1 whitespace-nowrap">
                  {pkg.tag}
                </div>
              )}

              {/* Header */}
              <div className="p-6 pb-4 border-b border-border/50">
                <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-1">{pkg.tier}</p>
                <p className="text-grey text-xs mb-3">{pkg.subtitle}</p>
                <div className="font-serif font-light">
                  <span className="text-lg">₹</span>
                  <span className="text-4xl">{pkg.price}</span>
                  <span className="text-grey text-xs ml-1">/-</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="p-6 pb-3 flex-1">
                <p className="text-[0.6rem] tracking-widest uppercase text-gold/70 mb-3">What's Included</p>
                <ul className="space-y-2 mb-5">
                  {pkg.inclusions.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-grey-light text-xs">
                      <Camera size={10} className="text-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="text-[0.6rem] tracking-widest uppercase text-gold/70 mb-3">Deliverables</p>
                <ul className="space-y-2 mb-5">
                  {pkg.deliverables.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-grey-light text-xs">
                      <CheckCircle size={10} className="text-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Payment schedule */}
                <div className="bg-black/30 border border-border/30 p-3 mb-5">
                  <p className="text-[0.6rem] tracking-widest uppercase text-gold/70 mb-2">Payment Schedule</p>
                  <div className="flex flex-col gap-1">
                    {pkg.payment.map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <Star size={8} className="text-gold shrink-0" />
                        <span className="text-grey text-xs">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleBook(pkg)}
                  className={`w-full py-3 text-[0.72rem] tracking-widest uppercase transition-all duration-300 border ${
                    pkg.featured
                      ? 'bg-gold border-gold text-black hover:opacity-90'
                      : 'border-border text-grey-light hover:border-gold hover:text-gold'
                  }`}
                >
                  Book This Package
                </button>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll className="text-center mt-12">
        <p className="text-grey-light text-sm">
          Need a custom package?{' '}
          <a href="/contact" className="text-gold hover:underline">
            Contact us
          </a>{' '}
          and we'll create the perfect plan for you.
        </p>
        <p className="text-grey text-xs mt-2 tracking-widest">Contact: +91 91094 22772 | +91 77718 50846</p>
      </RevealOnScroll>
    </div>
  )
}
