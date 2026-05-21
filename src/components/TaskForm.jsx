import { useFormik } from 'formik'
import * as Yup from 'yup'

const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
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

const initialForm = {
  title: '',
  description: '',
  status: TASK_STATUS.TODO,
}

const TaskForm = ({ onSubmitTask, editingTask, onCancelEdit, isSubmitting = false }) => {
  const taskSchema = Yup.object({
    title: Yup.string().trim().required('Task title is required.'),
    description: Yup.string().trim().required('Task description is required.'),
    status: Yup.string()
      .oneOf(Object.values(TASK_STATUS), 'Please select a task status.')
      .required('Please select a task status.'),
  })

  const formik = useFormik({
    initialValues: editingTask
      ? {
        title: editingTask.title ?? '',
        description: editingTask.description ?? '',
        status: normalizeTaskStatus(editingTask.status ?? (editingTask.completed ? TASK_STATUS.DONE : undefined)),
      }
      : initialForm,
    enableReinitialize: true,
    validationSchema: taskSchema,
    onSubmit: async (values, helpers) => {
      try {
        const didSave = await onSubmitTask({
          ...values,
          title: values.title.trim(),
          description: values.description.trim(),
          status: values.status,
        })

        if (didSave === false) {
          helpers.setStatus('Unable to save the task right now.')
          return
        }

        helpers.resetForm()
        helpers.setStatus('')
      } catch {
        helpers.setStatus('Unable to save the task right now.')
      }
    },
  })

  return (
    <form className="task-form" onSubmit={formik.handleSubmit}>
      <div className="task-form-header">
        <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
        <p>{editingTask ? 'Update the task details and save your changes.' : 'Add a new task and set its current status.'}</p>
      </div>

      <div className="form-field">
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          name="title"
          placeholder="Enter task title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && <span className="field-error">{formik.errors.title}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">Task description</label>
        <textarea
          id="task-description"
          name="description"
          placeholder="Describe the task"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
        />
        {formik.touched.description && formik.errors.description && (
          <span className="field-error">{formik.errors.description}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-status">Status</label>
        <select id="task-status" name="status" value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          <option value={TASK_STATUS.TODO}>{TASK_STATUS.TODO}</option>
          <option value={TASK_STATUS.IN_PROGRESS}>{TASK_STATUS.IN_PROGRESS}</option>
          <option value={TASK_STATUS.DONE}>{TASK_STATUS.DONE}</option>
        </select>
        {formik.touched.status && formik.errors.status && <span className="field-error">{formik.errors.status}</span>}
      </div>

      <div className="task-form-actions">
        {editingTask && (
          <button className="ghost-btn" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}

        <button className="primary-btn" type="submit" disabled={isSubmitting || formik.isSubmitting}>
          {isSubmitting || formik.isSubmitting ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {formik.status && <p className="form-error">{formik.status}</p>}
    </form>
  )
}

export default TaskForm
