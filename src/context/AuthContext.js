import axios from 'axios'
import { createContext, createElement, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'taskflow_user'
const TOKEN_KEY = 'taskflow_token'
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

const getInitialToken = () => {
  const storedToken = localStorage.getItem(TOKEN_KEY)
  return storedToken || ''
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser)
  const [token, setToken] = useState(getInitialToken)

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    try {
      const response = await authApi.post('/login', { email, password })
      const responseToken = response.data.token
      const loggedUser = response.data.user

      if (!responseToken) {
        throw new Error('Authentication token was not returned by the server.')
      }

      if (!loggedUser) {
        throw new Error('User data was not returned by the server.')
      }

      localStorage.setItem(TOKEN_KEY, responseToken)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      setToken(responseToken)
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
      await authApi.post('/register', { name, email, password })
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Authentication request failed.'))
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setToken('')
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user],
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
