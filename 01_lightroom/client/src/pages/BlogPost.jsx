import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'
import { BLOG_POSTS } from './Blog'

export default function BlogPost() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-[5%]">
        <RevealOnScroll>
          {/* Back link */}
          <Link to="/blog" className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          {/* Category + title */}
          <span className="text-gold text-[0.65rem] uppercase tracking-widest">{post.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mt-2 mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-grey text-xs mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> {post.readTime} min read
            </span>
            <span>By The Lightroom Team</span>
          </div>

          {/* Hero cover image */}
          <div className="aspect-[16/7] overflow-hidden mb-10 bg-[#1c1610]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.src = 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80'
              }}
            />
          </div>

          {/* Article body */}
          <div className="space-y-4 text-grey-light text-sm leading-relaxed">
            {post.body.map((block, i) =>
              block.type === 'h2' ? (
                <h2 key={i} className="font-serif text-2xl text-cream font-light mt-8 mb-3">
                  {block.text}
                </h2>
              ) : (
                <p key={i}>{block.text}</p>
              )
            )}
          </div>

          {/* Divider + related image from studio */}
          <div className="mt-10 mb-6 overflow-hidden aspect-[16/6] bg-[#1c1610]">
            <img
              src="/wedding%20couples/cop.jpg"
              alt="The Lightroom Studio"
              className="w-full h-full object-cover opacity-60"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>

          {/* Footer nav */}
          <div className="pt-8 border-t border-border flex justify-between items-center">
            <Link to="/blog" className="btn-gold-outline text-xs">← More Articles</Link>
            <Link to="/booking" className="btn-primary text-xs">Book a Session</Link>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
