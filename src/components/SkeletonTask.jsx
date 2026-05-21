const SkeletonTask = () => {
  return (
    <div className="task-card skeleton" aria-hidden>
      <div className="skeleton-header">
        <div className="skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-line" />
        <div className="skeleton-line medium" />
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-pill" />
        <div className="skeleton-pill small" />
      </div>
    </div>
  )
}

export default SkeletonTask
