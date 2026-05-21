import axios from 'axios'
import { createContext, createElement, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'taskflow_user'
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL
const AuthContext = createContext(null)
const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getErrorMessage = (error, fallbackMessage) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallbackMessage
    )
  }

  return error instanceof Error ? error.message : fallbackMessage
}

const getInitialUser = () => {
  const storedUser = localStorage.getItem(STORAGE_KEY)
  return storedUser ? JSON.parse(storedUser) : null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser)

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    try {
      const response = await authApi.post('/login', { email, password })
      const loggedUser = response.data?.user ?? response.data ?? {
        id: email.toLowerCase(),
        email,
        name: email.split('@')[0],
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      setUser(loggedUser)
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Authentication request failed.'))
    }
  }

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new Error('All fields are required.')
    }

    try {
      const response = await authApi.post('/register', { name, email, password })
      const registeredUser = response.data?.user ?? response.data ?? { id: email.toLowerCase(), name, email }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUser))
      setUser(registeredUser)
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Authentication request failed.'))
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
