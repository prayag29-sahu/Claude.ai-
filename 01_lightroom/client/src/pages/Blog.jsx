import { Link } from 'react-router-dom'
import { Calendar, Clock, Tag } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

// ─── Static blog posts with real cover images ─────────────────────────────
// Using Unsplash for photography/wedding themed images + local studio shots
export const BLOG_POSTS = [
  {
    _id: '1',
    slug: 'wedding-lighting-tips',
    title: '10 Essential Tips for Perfect Wedding Photography Lighting',
    excerpt: 'Mastering natural and artificial light is the cornerstone of beautiful wedding photography. Here\'s what our photographers have learned from 1,000+ weddings.',
    category: 'Wedding Tips',
    readTime: 5,
    createdAt: '2024-03-15',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
    body: [
      { type: 'p', text: 'Lighting is the single most important technical element in photography. It shapes mood, defines texture, and reveals emotion. For wedding photographers, mastering both natural and artificial light is what separates good images from extraordinary ones.' },
      { type: 'h2', text: '1. Embrace the Golden Hour' },
      { type: 'p', text: 'The hour after sunrise and before sunset casts warm, soft, directional light that is simply magical for outdoor portraits. Plan your couple session around this window whenever possible.' },
      { type: 'h2', text: '2. Scout Your Venue in Advance' },
      { type: 'p', text: 'Visit the venue at the same time of day as the wedding. Note where the windows are, which direction they face, and where shadows will fall during key moments.' },
      { type: 'h2', text: '3. Bounce, Don\'t Blast' },
      { type: 'p', text: 'When using flash, always bounce off walls or ceilings rather than pointing directly at subjects. This creates soft, wrap-around light that looks natural and flattering.' },
      { type: 'h2', text: '4. Use Off-Camera Flash' },
      { type: 'p', text: 'A single off-camera flash changes everything. Even moved just a few feet to the side, it creates dimension and separates your subject from the background beautifully.' },
    ]
  },
  {
    _id: '2',
    slug: 'pre-wedding-locations',
    title: 'Best Pre-Wedding Shoot Locations in India for 2024',
    excerpt: 'From snow-capped peaks of Himachal to golden dunes of Rajasthan — India\'s most photogenic destinations for your pre-wedding story.',
    category: 'Locations',
    readTime: 7,
    createdAt: '2024-02-28',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    body: [
      { type: 'p', text: 'India is a continent of landscapes. In a single country, you can shoot against snow, desert, jungle, coastline, and ancient architecture — often within the same state. Here are our favourite pre-wedding destinations.' },
      { type: 'h2', text: 'Udaipur — The City of Lakes' },
      { type: 'p', text: 'With its palace backdrops and tranquil lakes, Udaipur offers unmatched regal aesthetics for pre-wedding shoots. The Lake Palace hotel makes for an iconic backdrop.' },
      { type: 'h2', text: 'Coorg — Scotland of India' },
      { type: 'p', text: 'Coffee plantations, rolling mist, and lush greenery make Coorg perfect for intimate, romantic shoots that feel worlds away from the city.' },
      { type: 'h2', text: 'Jaisalmer — The Golden City' },
      { type: 'p', text: 'Sand dunes at sunset, golden fort walls, and camel silhouettes against an orange sky — Jaisalmer is tailor-made for dramatic pre-wedding films.' },
    ]
  },
  {
    _id: '3',
    slug: 'bridal-poses',
    title: '20 Bridal Photography Poses Every Bride Should Know',
    excerpt: 'Whether camera-shy or photogenic, these timeless poses will help you look and feel your absolute best on your special day.',
    category: 'Bridal Tips',
    readTime: 6,
    createdAt: '2024-01-10',
    coverImage: '/dulhanPhotos/1.jpg',
    body: [
      { type: 'p', text: 'The camera can be intimidating, especially on a day when every emotion is running high. But with the right poses and a photographer you trust, your photographs will feel effortless and authentic.' },
      { type: 'h2', text: 'The Classic Bridal Look' },
      { type: 'p', text: 'Standing tall, chin slightly down, eyes looking directly into the lens. Simple, powerful, timeless. This is the foundation from which every other pose builds.' },
      { type: 'h2', text: 'The Over-the-Shoulder' },
      { type: 'p', text: 'Turn your body away from the camera, then glance back over your shoulder with a soft smile. This pose works beautifully for showcasing the back of a blouse or saree draping.' },
      { type: 'h2', text: 'Hands Tell the Story' },
      { type: 'p', text: 'Focus your jewellery in frame — show mehndi details, bangles, and the ring. Close-up hand photographs are some of the most treasured images from a wedding day.' },
    ]
  },
  {
    _id: '4',
    slug: 'birthday-shoot-ideas',
    title: 'Creative Birthday Photography Ideas That Go Beyond Clichés',
    excerpt: 'Move beyond the typical birthday shots with these creative, memorable photography concepts for every age and personality.',
    category: 'Birthday Ideas',
    readTime: 4,
    createdAt: '2023-12-20',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    body: [
      { type: 'p', text: 'Birthday photography has evolved far beyond the "blow out the candles" shot. Today\'s milestone portraits are editorial, emotional, and deeply personal.' },
      { type: 'h2', text: 'Milestone Birthday Portraits' },
      { type: 'p', text: '18th, 25th, 30th, 50th — every decade deserves a proper portrait session. Think of it as a time capsule: how you looked, how you felt, who you were at this precise moment in life.' },
      { type: 'h2', text: 'First Birthday Magic' },
      { type: 'p', text: 'The cake smash is iconic for a reason — pure, uninhibited joy captured in a single frame. But also consider quieter moments: tiny hands, that first-year growth montage, family portraits.' },
      { type: 'h2', text: 'Outdoor Adventure Sessions' },
      { type: 'p', text: 'Take the session outside — to a field, a rooftop, a forest. Natural environments create photographs that feel free, alive, and full of personality.' },
    ]
  },
  {
    _id: '5',
    slug: 'behind-the-scenes',
    title: 'Behind the Lens: A Day in the Life at The Lightroom Studio',
    excerpt: 'What really goes into creating those stunning photographs? Our photographers take you behind the scenes of a typical wedding day.',
    category: 'Behind the Scenes',
    readTime: 8,
    createdAt: '2023-11-30',
    coverImage: '/photoshoot/2.jpg',
    body: [
      { type: 'p', text: 'A wedding photographer\'s day starts long before the first shutter click and ends well after the last guest leaves. Here\'s an honest, behind-the-scenes look.' },
      { type: 'h2', text: '5:30 AM — Equipment Check' },
      { type: 'p', text: 'Every camera body is checked, every battery charged, every memory card formatted. Backup equipment is packed. There are no second chances at a wedding.' },
      { type: 'h2', text: '7:00 AM — Bridal Prep' },
      { type: 'p', text: 'The morning starts with the bride getting ready. This is where some of the most intimate and emotional photographs happen — the quiet moments before the celebration begins.' },
      { type: 'h2', text: 'The Details Matter' },
      { type: 'p', text: 'While the bride is in the makeup chair, we photograph the details: the lehenga laid out, the jewellery arranged, the invitation card, the wedding shoes. These images frame the story.' },
    ]
  },
  {
    _id: '6',
    slug: 'drone-photography',
    title: 'Why Drone Photography Is Transforming Modern Weddings',
    excerpt: 'Aerial perspective adds a cinematic dimension to wedding coverage that ground-level cameras simply cannot achieve.',
    category: 'Technology',
    readTime: 5,
    createdAt: '2023-11-01',
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
    body: [
      { type: 'p', text: 'The addition of aerial photography to wedding coverage has been one of the most transformative changes in the industry over the last five years. A drone reveals the scale and grandeur of a celebration in ways no ground camera can.' },
      { type: 'h2', text: 'The Venue from Above' },
      { type: 'p', text: 'A bird\'s-eye view of a mandap, a baraat procession, or a sprawling venue puts everything in context. Suddenly the viewer understands the full scope of the event.' },
      { type: 'h2', text: 'Cinematic Reveal Shots' },
      { type: 'p', text: 'Drone footage rising from behind the couple to reveal a stunning landscape has become one of the most-loved shots in modern wedding films. When done right, it\'s genuinely breathtaking.' },
      { type: 'h2', text: 'Legal and Safety Considerations' },
      { type: 'p', text: 'Always ensure your photographer has a DGCA-approved drone licence and proper insurance. Not all venues permit drone flights — check in advance and have contingency plans ready.' },
    ]
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Insights</span>
        <h1 className="section-title">From The <em className="text-gold italic">Studio</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">
          Tips, stories, and behind-the-scenes from The Lightroom Photography.
        </p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post, i) => (
          <RevealOnScroll key={post._id} delay={i * 0.07}>
            <Link
              to={`/blog/${post.slug}`}
              className="bg-card border border-border overflow-hidden group block hover:border-gold/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Cover image */}
              <div className="aspect-[3/2] overflow-hidden bg-[#1c1610]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => {
                    e.target.src = `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80`
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1 text-gold text-[0.62rem] uppercase tracking-wider mb-3">
                  <Tag size={10} /> {post.category}
                </div>
                <h3 className="font-serif text-lg font-light leading-snug mb-2 group-hover:text-gold transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-grey-light text-xs leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-grey text-[0.65rem]">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {post.readTime} min read
                  </span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  )
}
