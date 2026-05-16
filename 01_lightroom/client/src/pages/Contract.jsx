import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, RotateCcw } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const TERMS = `PHOTOGRAPHY SERVICES AGREEMENT

1. SERVICES: The Lightroom Photography agrees to provide photography and/or videography services for the event specified in the booking.

2. PAYMENT: A non-refundable retainer of 50% is due upon signing this agreement. The remaining balance is due 7 days before the event date.

3. COPYRIGHT: The Lightroom Photography retains copyright ownership of all photographs. Client receives a limited license for personal use only.

4. DELIVERY: Edited images will be delivered within the timeframe specified in the selected package, via the client online portal.

5. CANCELLATION: Cancellations made 30+ days before the event receive a 50% refund of the retainer. Cancellations within 30 days forfeit the retainer.

6. FORCE MAJEURE: Neither party shall be liable for failure to perform due to circumstances beyond reasonable control.

7. LIMITATION OF LIABILITY: In the unlikely event of equipment failure or other unforeseen circumstances, liability is limited to a full refund of amounts paid.

8. PRINT RELEASE: Client is granted a print release for personal use of delivered images. Commercial use requires separate agreement.

9. SOCIAL MEDIA: The Lightroom Photography reserves the right to use photographs for portfolio and marketing purposes unless otherwise agreed in writing.

10. GOVERNING LAW: This agreement is governed by the laws of India.`

export default function Contract() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const sigCanvas = useRef(null)
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const clear = () => { sigCanvas.current?.clear(); setSigned(false) }

  const submit = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      toast.error('Please provide your signature'); return
    }
    if (!agreed) { toast.error('Please agree to the terms'); return }
    setLoading(true)
    try {
      const signatureData = sigCanvas.current.toDataURL()
      await api.post('/contracts', { bookingId, signatureImage: signatureData, termsText: TERMS })
      setSigned(true)
      toast.success('Contract signed successfully!')
    } catch { toast.error('Failed to submit contract') }
    finally { setLoading(false) }
  }

  if (signed) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={56} className="text-gold mx-auto mb-4" />
        <h2 className="font-serif text-3xl font-light mb-2">Contract Signed!</h2>
        <p className="text-grey-light text-sm mb-6">Your signed contract has been submitted. We'll send you a copy via email.</p>
        <div className="flex gap-3 justify-center">
          <button className="btn-gold-outline text-xs flex items-center gap-2"><Download size={12}/>Download PDF</button>
          <button onClick={() => navigate('/client/dashboard')} className="btn-primary text-xs">Go to Dashboard</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black pt-10 pb-16 px-[5%]">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl font-light mb-2">Photography <em className="text-gold italic">Contract</em></h1>
        <p className="text-grey-light text-sm mb-8">Please read the terms carefully and sign below to confirm your booking.</p>

        <div className="bg-card border border-border p-6 mb-6 h-64 overflow-y-auto">
          <pre className="text-grey-light text-xs leading-relaxed font-sans whitespace-pre-wrap">{TERMS}</pre>
        </div>

        <div className="bg-card border border-border p-6 mb-6">
          <h3 className="text-sm uppercase tracking-widest text-gold mb-4">Digital Signature</h3>
          <div className="border border-border bg-dark mb-3">
            <SignatureCanvas ref={sigCanvas} penColor="#c6a55c"
              canvasProps={{ width: 600, height: 160, className: 'w-full' }}
              onEnd={() => setSigned(true)} />
          </div>
          <button onClick={clear} className="flex items-center gap-1 text-grey text-xs hover:text-gold transition-colors">
            <RotateCcw size={12} /> Clear signature
          </button>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-gold" />
          <span className="text-grey-light text-sm">I have read and agree to all terms and conditions of this Photography Services Agreement.</span>
        </label>

        <button onClick={submit} disabled={loading || !agreed}
          className="w-full bg-gold text-black py-4 text-xs tracking-widest uppercase hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
          {loading ? 'Submitting...' : 'Accept & Sign Contract'}
        </button>
      </div>
    </div>
  )
}
