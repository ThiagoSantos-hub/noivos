'use client'

/**
 * GuestCard — exibe informações de um convidado
 */

import { Phone, MessageSquare, CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { Guest, GuestStatus } from '@/types/guest.types'

interface IGuestCardProps {
  guest: Guest
  onClick: (guest: Guest) => void
}

const STATUS_CONFIG: Record<GuestStatus, { label: string; icon: any; color: string; bgColor: string }> = {
  confirmed: {
    label: 'Confirmado',
    icon: CheckCircle2,
    color: 'text-success-dark',
    bgColor: 'bg-success-light',
  },
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-warning-dark',
    bgColor: 'bg-warning-light',
  },
  declined: {
    label: 'Recusou',
    icon: XCircle,
    color: 'text-danger',
    bgColor: 'bg-red-50',
  },
}

export function GuestCard({ guest, onClick }: IGuestCardProps) {
  const status = STATUS_CONFIG[guest.status]
  const StatusIcon = status.icon

  return (
    <article
      onClick={() => onClick(guest)}
      className="
        bg-white rounded-lg shadow-sm border border-gray-100 p-3
        hover:shadow-md transition-shadow cursor-pointer
        active:scale-[0.98] transition-transform
        flex items-center justify-between gap-3
      "
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-base font-bold text-text-primary truncate">
            {guest.name}
          </h3>
          <span className={`
            text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight
            ${status.bgColor} ${status.color}
          `}>
            {status.label}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {guest.phone}
          </span>
          {guest.table_number && (
            <span className="font-medium text-primary-DEFAULT">
              Mesa {guest.table_number}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {guest.notes && (
          <div className="p-2 text-text-secondary" title={guest.notes}>
            <MessageSquare size={18} />
          </div>
        )}
        <div className={`p-2 ${status.color}`}>
          <StatusIcon size={20} />
        </div>
      </div>
    </article>
  )
}
