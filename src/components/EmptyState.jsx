const EmptyState = ({ title = 'No tasks yet', subtitle = 'Create your first task to get started' }) => {
  return (
    <div className="empty-state-card" role="status" aria-live="polite">
      <div className="empty-illustration" aria-hidden>
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <rect width="160" height="120" rx="8" fill="var(--bg-muted)" />
          <g transform="translate(24,20)" fill="none" stroke="var(--brand)" strokeWidth="2">
            <rect x="0" y="0" width="112" height="72" rx="6" strokeOpacity="0.12" />
            <path d="M8 18h96M8 36h64" strokeOpacity="0.18" />
            <circle cx="92" cy="56" r="6" fill="var(--accent)" stroke="none" />
          </g>
        </svg>
      </div>

      <div className="empty-copy">
        <h3>{title}</h3>
        <p className="muted">{subtitle}</p>
      </div>
    </div>
  )
}

export default EmptyState
