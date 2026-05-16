import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, Tag } from 'lucide-react'
import api from '../services/api'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const placeholderPosts = [
  { _id:'1', slug:'wedding-lighting-tips', title:'10 Essential Tips for Perfect Wedding Photography Lighting', excerpt:'Mastering natural and artificial light is the cornerstone of beautiful wedding photography.', category:'Wedding Tips', readTime:5, createdAt:'2024-03-15', coverColor:'from-[#1c1610] to-[#2e2010]' },
  { _id:'2', slug:'pre-wedding-locations', title:'Best Pre-Wedding Shoot Locations in India for 2024', excerpt:'From snow-capped peaks of Himachal to golden dunes of Rajasthan — India\'s most photogenic destinations.', category:'Locations', readTime:7, createdAt:'2024-02-28', coverColor:'from-[#101c10] to-[#182a18]' },
  { _id:'3', slug:'bridal-poses', title:'20 Bridal Photography Poses Every Bride Should Know', excerpt:'Whether camera-shy or photogenic, these timeless poses will help you shine on your special day.', category:'Bridal Tips', readTime:6, createdAt:'2024-01-10', coverColor:'from-[#180f18] to-[#281828]' },
  { _id:'4', slug:'birthday-shoot-ideas', title:'Creative Birthday Photography Ideas That Go Beyond Clichés', excerpt:'Move beyond the typical birthday shots with these creative, memorable photography concepts.', category:'Birthday Ideas', readTime:4, createdAt:'2023-12-20', coverColor:'from-[#1a1208] to-[#2c1e08]' },
  { _id:'5', slug:'behind-the-scenes', title:'Behind the Lens: A Day in the Life at The Lightroom Studio', excerpt:'What really goes into creating those stunning photographs? Our photographers take you behind the scenes.', category:'Behind the Scenes', readTime:8, createdAt:'2023-11-30', coverColor:'from-[#0f0f18] to-[#181820]' },
  { _id:'6', slug:'drone-photography', title:'Why Drone Photography Is Transforming Modern Weddings', excerpt:'Aerial perspective adds a cinematic dimension to wedding coverage. Here\'s everything you need to know.', category:'Technology', readTime:5, createdAt:'2023-11-01', coverColor:'from-[#0f1518] to-[#141e22]' },
]

export default function Blog() {
  const { data: posts = placeholderPosts } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => api.get('/blog').then(r => r.data.posts),
    placeholderData: placeholderPosts
  })

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Insights</span>
        <h1 className="section-title">From The <em className="text-gold italic">Studio</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">Tips, stories, and behind-the-scenes from The Lightroom Photography.</p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <RevealOnScroll key={post._id} delay={i * 0.07}>
            <Link to={`/blog/${post.slug}`} className="bg-card border border-border overflow-hidden group block hover:border-gold/30 transition-all duration-300">
              <div className={`aspect-[3/2] bg-gradient-to-br ${post.coverColor || 'from-[#1c1610] to-[#2e2010]'} overflow-hidden flex items-center justify-center`}>
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(198,165,92,0.15)" strokeWidth="0.7" className="group-hover:scale-110 transition-transform duration-500">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-gold text-[0.62rem] uppercase tracking-wider mb-3">
                  <Tag size={10} /> {post.category}
                </div>
                <h3 className="font-serif text-lg font-light leading-snug mb-2 group-hover:text-gold transition-colors duration-300">{post.title}</h3>
                <p className="text-grey-light text-xs leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-grey text-[0.65rem]">
                  <span className="flex items-center gap-1"><Calendar size={10}/> {new Date(post.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                  <span className="flex items-center gap-1"><Clock size={10}/> {post.readTime} min read</span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  )
}
