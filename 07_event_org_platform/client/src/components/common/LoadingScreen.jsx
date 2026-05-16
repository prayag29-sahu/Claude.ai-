export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-regal-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-gold-500/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-gold-500 animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-t-2 border-gold-300/50 animate-spin" style={{animationDuration:'1.5s', animationDirection:'reverse'}}></div>
        </div>
        <p className="font-accent text-gold-400 tracking-widest text-sm uppercase">VisionVivaah</p>
        <p className="font-body text-white/40 text-xs mt-1">Loading Experience...</p>
      </div>
    </div>
  )
}
