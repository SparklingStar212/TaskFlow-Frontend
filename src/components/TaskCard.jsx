const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

const getTaskStatusKey = (status) => {
  if (status === TASK_STATUS.DONE) {
    return 'done'
  }

  if (status === TASK_STATUS.IN_PROGRESS) {
    return 'in-progress'
  }

  return 'todo'
}

const normalizeTaskStatus = (status) => {
  if (typeof status !== 'string') {
    return TASK_STATUS.TODO
  }

  const trimmedStatus = status.trim().toLowerCase()

  if (trimmedStatus === 'pending' || trimmedStatus === 'to do' || trimmedStatus === 'todo') {
    return TASK_STATUS.TODO
  }

  if (trimmedStatus === 'in progress' || trimmedStatus === 'inprogress' || trimmedStatus === 'in-progress' || trimmedStatus === 'in_progress') {
    return TASK_STATUS.IN_PROGRESS
  }

  if (trimmedStatus === 'done' || trimmedStatus === 'completed') {
    return TASK_STATUS.DONE
  }

  return status.trim()
}

const TaskCard = ({ task, onEdit, onDelete, onToggle, isActionDisabled = false }) => {
  const taskStatus = normalizeTaskStatus(task.status ?? (task.completed ? TASK_STATUS.DONE : undefined))
  const isCompleted = taskStatus === TASK_STATUS.DONE || task.completed
  const statusKey = getTaskStatusKey(taskStatus)
  const statusActionLabel = taskStatus === TASK_STATUS.TODO ? 'Start' : taskStatus === TASK_STATUS.IN_PROGRESS ? 'Mark Done' : TASK_STATUS.DONE
  const statusActionTarget = taskStatus === TASK_STATUS.TODO ? TASK_STATUS.IN_PROGRESS : TASK_STATUS.DONE
  const statusActionAriaLabel =
    taskStatus === TASK_STATUS.TODO
      ? `Move task to in progress: ${task.title}`
      : `Mark task done: ${task.title}`

  return (
    <article className={`task-card ${statusKey}`} aria-labelledby={`task-${task.id}-title`}>
      <div className="task-card-header">
        <div className="task-card-copy">
          <h3 id={`task-${task.id}-title`}>{task.title}</h3>
          <p>{task.description || 'No description provided.'}</p>
        </div>

        <span className={`status-badge ${statusKey}`} aria-label={`Task status: ${taskStatus}`}>
          {taskStatus}
        </span>
      </div>

      <div className="task-card-meta">
        <small>Created {formatDate(task.createdAt)}</small>
      </div>

      <div className="task-card-actions">
        <button
          className="ghost-btn task-btn"
          type="button"
          onClick={() => onEdit?.(task)}
          disabled={isActionDisabled}
          aria-label={`Edit task: ${task.title}`}
        >
          Edit
        </button>

        <button
          className="danger-btn task-btn"
          type="button"
          onClick={() => onDelete(task.id)}
          disabled={isActionDisabled}
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>

        <button
          className={`primary-btn task-btn ${isCompleted ? 'completed-state' : ''}`}
          type="button"
          onClick={() => onToggle?.(task.id, statusActionTarget)}
          disabled={isCompleted || isActionDisabled}
          aria-label={isCompleted ? `Task already done: ${task.title}` : statusActionAriaLabel}
        >
          {statusActionLabel}
        </button>
      </div>
    </article>
  )
}

export default TaskCard
