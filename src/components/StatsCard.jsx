const ICON_PATHS = {
  total: 'M5.5 8.75h13m-13 6.5h13M8 3.5h8a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z',
  pending: 'M12 7v5l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  completed:
    'M8 12.75l2.5 2.5 5.5-6.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
}

const StatsCard = ({ title, count, iconType, tone = 'brand' }) => {
  const iconPath = ICON_PATHS[iconType] ?? ICON_PATHS.total

  return (
    <article className={`stats-card ${tone}`} aria-label={`${title}: ${count}`}>
      <div className={`stats-icon ${tone}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={iconPath} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      <div className="stats-content">
        <p>{title}</p>
        <strong>{count}</strong>
      </div>
    </article>
  )
}

export default StatsCard
