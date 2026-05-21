import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_TASKS_API_URL
const tasksApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const STATUS_ALIASES = new Map([
  ['todo', TASK_STATUS.TODO],
  ['to do', TASK_STATUS.TODO],
  ['pending', TASK_STATUS.TODO],
  ['inprogress', TASK_STATUS.IN_PROGRESS],
  ['in progress', TASK_STATUS.IN_PROGRESS],
  ['in-progress', TASK_STATUS.IN_PROGRESS],
  ['in_progress', TASK_STATUS.IN_PROGRESS],
  ['done', TASK_STATUS.DONE],
  ['completed', TASK_STATUS.DONE],
])

const requestJson = async (path = '', options = {}) => {
  try {
    const { body, headers, ...restOptions } = options
    const response = await tasksApi.request({
      url: path,
      ...restOptions,
      headers: {
        ...headers,
      },
      data: body,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Request failed while communicating with the task API.',
      )
    }

    throw error instanceof Error ? error : new Error('Request failed while communicating with the task API.')
  }
}

const normalizeTaskStatus = (status) => {
  if (typeof status !== 'string') {
    return TASK_STATUS.TODO
  }

  const alias = STATUS_ALIASES.get(status.trim().toLowerCase())
  return alias ?? status.trim()
}

const normalizeTask = (task) => {
  if (!task || typeof task !== 'object') {
    return null
  }

  const id = task.id ?? task._id ?? task.taskId

  if (id == null) {
    return null
  }

  const status = normalizeTaskStatus(task.status ?? (task.completed ? TASK_STATUS.DONE : undefined))

  return {
    ...task,
    id,
    status,
    completed: status === TASK_STATUS.DONE || Boolean(task.completed),
    title: typeof task.title === 'string' ? task.title : '',
    description: typeof task.description === 'string' ? task.description : '',
  }
}

const normalizeTasks = (tasks) => (Array.isArray(tasks) ? tasks.map(normalizeTask).filter(Boolean) : [])

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadTasks = async () => {
      setLoading(true)
      setError(null)

      try {
        const initialTasks = await requestJson('')
        if (mounted) {
          setTasks(normalizeTasks(initialTasks))
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load tasks from the server.')
          setLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      mounted = false
    }
  }, [])

  const addTask = useCallback(async (newTask) => {
    setIsMutating(true)
    setError(null)

    const status = normalizeTaskStatus(newTask.status)
    const task = {
      title: newTask.title,
      description: newTask.description,
      status,
      completed: status === TASK_STATUS.DONE,
    }

    try {
      const createdTask = await requestJson('', {
        method: 'POST',
        body: JSON.stringify(task),
      })
      const normalizedCreatedTask = normalizeTask(createdTask)

      if (!normalizedCreatedTask) {
        throw new Error('The server returned an invalid task.')
      }

      setTasks((prevTasks) => [normalizedCreatedTask, ...prevTasks])
    } catch (err) {
      setError(err?.message || 'Failed to create task.')
      throw err
    } finally {
      setIsMutating(false)
    }
  }, [])

  const updateTask = useCallback(async (taskId, updatedFields) => {
    setIsMutating(true)
    setError(null)

    const nextStatus = normalizeTaskStatus(updatedFields.status)
    const currentTask = tasks.find((task) => task.id === taskId)

    if (!currentTask) {
      setError('Task not found.')
      setIsMutating(false)
      return
    }

    const updatedTask = {
      ...currentTask,
      ...updatedFields,
      status: nextStatus,
      completed: nextStatus === TASK_STATUS.DONE,
    }

    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)))

    try {
      await requestJson(`/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
      })
    } catch (err) {
      setError(err?.message || 'Failed to update task.')
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? currentTask : task)))
      throw err
    } finally {
      setIsMutating(false)
    }
  }, [tasks])

  const toggleTaskStatus = useCallback(async (taskId) => {
    setIsMutating(true)
    setError(null)

    const currentTask = tasks.find((task) => task.id === taskId)

    if (!currentTask) {
      setError('Task not found.')
      setIsMutating(false)
      return
    }

    const nextCompleted = !currentTask.completed
    const updatedTask = {
      ...currentTask,
      completed: nextCompleted,
      status: nextCompleted ? TASK_STATUS.DONE : TASK_STATUS.TODO,
    }

    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)))

    try {
      await requestJson(`/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
      })
    } catch (err) {
      setError(err?.message || 'Failed to update task status.')
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? currentTask : task)))
      throw err
    } finally {
      setIsMutating(false)
    }
  }, [tasks])

  const removeTask = useCallback(async (taskId) => {
    setIsMutating(true)
    setError(null)

    let snapshotTask = null
    let snapshotIndex = -1

    setTasks((prevTasks) => {
      snapshotIndex = prevTasks.findIndex((task) => task.id === taskId)
      snapshotTask = prevTasks[snapshotIndex] ?? null
      return prevTasks.filter((task) => task.id !== taskId)
    })

    try {
      await requestJson(`/${taskId}`, {
        method: 'DELETE',
      })
    } catch (err) {
      setError(err?.message || 'Failed to delete task.')
      if (snapshotTask) {
        setTasks((prevTasks) => {
          const nextTasks = [...prevTasks]
          nextTasks.splice(snapshotIndex >= 0 ? snapshotIndex : 0, 0, snapshotTask)
          return nextTasks
        })
      }
      throw err
    } finally {
      setIsMutating(false)
    }
  }, [tasks])

  const stats = useMemo(() => {
    const safeTasks = normalizeTasks(tasks)
    const total = safeTasks.length
    const done = safeTasks.filter((task) => task.status === TASK_STATUS.DONE || task.completed).length
    const inProgress = safeTasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS).length
    const todo = total - done - inProgress

    return { total, todo, inProgress, done }
  }, [tasks])

  return {
    tasks,
    loading,
    isMutating,
    error,
    stats,
    addTask,
    updateTask,
    toggleTaskStatus,
    removeTask,
    clearError: () => setError(null),
  }
}
