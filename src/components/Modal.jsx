const Modal = ({ title, description, isOpen, onClose, children }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && (
              <p id="modal-description" className="modal-description">
                {description}
              </p>
            )}
          </div>

          <button type="button" className="btn-link modal-close" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
