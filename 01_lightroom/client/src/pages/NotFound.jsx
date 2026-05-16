import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-4">
      <div>
        <div className="font-serif text-[8rem] font-light text-gold/10 leading-none mb-2">404</div>
        <h1 className="font-serif text-3xl font-light mb-3">Page Not Found</h1>
        <p className="text-grey-light text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}
