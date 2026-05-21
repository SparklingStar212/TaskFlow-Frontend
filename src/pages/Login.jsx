import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string().required('Password is required.'),
})

const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth()
  const [infoMessage, setInfoMessage] = useState('')
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, helpers) => {
      try {
        await login(values)
        helpers.resetForm()
        helpers.setStatus('')
        setInfoMessage('')
      } catch (error) {
        helpers.setStatus(error.message)
      }
    },
  })

  const handleForgotPassword = (event) => {
    event.preventDefault()
    formik.setStatus('')
    setInfoMessage('Password reset is not connected yet. Please contact support.')
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={formik.handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Sign in to continue managing your tasks.</p>

        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && <span className="field-error">{formik.errors.email}</span>}
        </div>

        <div className="form-field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && <span className="field-error">{formik.errors.password}</span>}
        </div>

        <a href="#" className="auth-link" onClick={handleForgotPassword}>
          Forgot password?
        </a>

        {formik.status && <p className="form-error">{formik.status}</p>}
        {infoMessage && <p className="form-info">{infoMessage}</p>}

        <button className="primary-btn" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="auth-switch-text">
          New to TaskFlow?{' '}
          <button className="link-btn" type="button" onClick={onSwitchToRegister}>
            Sign Up
          </button>
        </p>
      </form>
    </section>
  )
}

export default Login
