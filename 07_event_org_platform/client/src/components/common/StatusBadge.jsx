export const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'badge-yellow',  icon: '⏳', bgColor: 'bg-yellow-500/10' },
  confirmed:   { label: 'Confirmed',   color: 'badge-green',   icon: '✅', bgColor: 'bg-green-500/10'  },
  'in-progress': { label: 'In Progress', color: 'badge-blue',  icon: '🔄', bgColor: 'bg-blue-500/10'  },
  completed:   { label: 'Completed',   color: 'badge-green',   icon: '🎉', bgColor: 'bg-green-500/10'  },
  cancelled:   { label: 'Cancelled',   color: 'badge-red',     icon: '❌', bgColor: 'bg-red-500/10'    },
}

export const PAYMENT_CONFIG = {
  unpaid:  { label: 'Unpaid',   color: 'badge-red',    icon: '💳' },
  partial: { label: 'Partial',  color: 'badge-yellow', icon: '💰' },
  paid:    { label: 'Paid',     color: 'badge-green',  icon: '✅' },
}

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={`badge ${config.color}`}>
      {config.icon} {config.label}
    </span>
  )
}

export function PaymentBadge({ status }) {
  const config = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.unpaid
  return (
    <span className={`badge ${config.color}`}>
      {config.icon} {config.label}
    </span>
  )
}
