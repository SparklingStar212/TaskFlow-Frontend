import { useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import SkeletonTask from '../components/SkeletonTask'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import Modal from '../components/Modal'
import TaskToolbar from '../components/TaskToolbar'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'

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

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewFilter, setViewFilter] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const {
    tasks,
    loading,
    isMutating,
    error,
    clearError,
    stats,
    addTask,
    updateTask,
    removeTask,
  } = useTasks()

  const handleMenuSelect = (menuKey) => {
    if (menuKey === 'logout') {
      logout()
      return
    }

    setActiveMenuItem(menuKey)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)')

    const updateViewport = () => {
      setIsMobileView(mediaQuery.matches)
    }

    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)

    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  const handleSubmitTask = async (taskData) => {
    if (editingTask) {
      try {
        await updateTask(editingTask.id, taskData)
        setEditingTask(null)
        return true
      } catch {
        return false
      }
    }

    try {
      await addTask(taskData)
      return true
    } catch {
      return false
    }
  }

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return tasks.filter((task) => {
      if (!task || typeof task !== 'object') {
        return false
      }

      // view filter (all, pending, completed)
      const taskStatus = normalizeTaskStatus(task.status ?? (task.completed ? TASK_STATUS.DONE : undefined))

      if (viewFilter !== 'all' && taskStatus !== viewFilter) return false

      // search by title only (case-insensitive)
      if (normalizedSearch) {
        return task.title.toLowerCase().includes(normalizedSearch)
      }

      return true
    })
  }, [tasks, viewFilter, searchTerm])

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(isMobileView)
    setActiveMenuItem('dashboard')
    setIsSidebarOpen(false)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setIsTaskModalOpen(false)
  }

  const handleOpenTaskModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status })
    } catch {
      return false
    }
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="app-shell">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleMenu={() => setIsSidebarOpen((prevState) => !prevState)}
      />

      <div className="layout-grid">
        <Sidebar
          activeItem={activeMenuItem}
          onItemSelect={handleMenuSelect}
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="dashboard-main">
          {activeMenuItem === 'profile' && (
            <section className="profile-card">
              <h2>Profile</h2>
              <p>Name: {user?.name}</p>
              <p>Email: {user?.email}</p>
            </section>
          )}

          <section className="stats-grid">
            <StatsCard title="Total Tasks" count={stats.total} iconType="total" tone="brand" />
            <StatsCard
              title="To Do"
              count={stats.todo}
              iconType="pending"
              tone="pending"
            />
            <StatsCard
              title="In Progress"
              count={stats.inProgress}
              iconType="total"
              tone="brand"
            />
            <StatsCard
              title="Done"
              count={stats.done}
              iconType="completed"
              tone="success"
            />
          </section>

          <section className="control-grid">
            <button
              type="button"
              className="primary-btn mobile-add-task-btn"
              onClick={handleOpenTaskModal}
              aria-haspopup="dialog"
              aria-expanded={isTaskModalOpen}
            >
              Add Task
            </button>

            <div className="desktop-task-form">
              <TaskForm
                onSubmitTask={handleSubmitTask}
                editingTask={editingTask}
                onCancelEdit={handleCancelEdit}
                isSubmitting={isMutating}
              />
            </div>

            <div className="task-list-panel">
              <TaskToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewFilter={viewFilter}
                onFilterChange={setViewFilter}
              />

              {error && <ErrorBanner message={error} onClose={clearError} />}

              {loading ? (
                <div className="stack">
                  <SkeletonTask />
                  <SkeletonTask />
                  <SkeletonTask />
                  <SkeletonTask />
                </div>
              ) : // show a friendly empty screen when there are absolutely no tasks
                tasks.length === 0 ? (
                  <EmptyState />
                ) : filteredTasks.length ? (
                  <div className="task-list" aria-live="polite">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onToggle={handleTaskStatusChange}
                        onDelete={removeTask}
                        isActionDisabled={isMutating}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="empty-state" role="status">No tasks found for this view.</p>
                )}
            </div>
          </section>

          <Modal
            isOpen={isTaskModalOpen}
            onClose={handleCloseTaskModal}
            title={editingTask ? 'Edit Task' : 'Create Task'}
            description={editingTask ? 'Update the task details and save your changes.' : 'Add a new task and set its current status.'}
          >
            <TaskForm
              onSubmitTask={async (taskData) => {
                const wasSaved = await handleSubmitTask(taskData)
                if (wasSaved) {
                  handleCloseTaskModal()
                }
              }}
              editingTask={editingTask}
              onCancelEdit={handleCloseTaskModal}
              isSubmitting={isMutating}
            />
          </Modal>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
