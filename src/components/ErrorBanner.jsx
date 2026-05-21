const ErrorBanner = ({ message = 'Something went wrong', onClose }) => {
  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <div className="error-content">
        <strong>Error:</strong>
        <span>{message}</span>
      </div>
      {onClose && (
        <button className="btn-link" type="button" onClick={onClose} aria-label="Dismiss error">
          Dismiss
        </button>
      )}
    </div>
  )
}

export default ErrorBanner
