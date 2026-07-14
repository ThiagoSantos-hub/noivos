/**
 * ProgressBar - Barra de progresso fina verde no topo da tela
 * Segue DESIGN-SYSTEM.md com cor verde #22C55E
 */

interface ProgressBarProps {
  /**
   * Percentual de progresso (0-100)
   */
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  // Garantir que o progresso está entre 0 e 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${normalizedProgress}%`,
          backgroundColor: '#22C55E',
        }}
        role="progressbar"
        aria-valuenow={normalizedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
