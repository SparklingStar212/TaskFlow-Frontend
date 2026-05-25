import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'

const registerSchema = Yup.object({
  name: Yup.string().trim().required('Full name is required.'),
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password and confirm password must match.')
    .required('Please confirm your password.'),
})

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth()
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, helpers) => {
      try {
        await register({
          name: values.name,
          email: values.email,
          password: values.password,
        })
        helpers.resetForm()
        helpers.setStatus('')
        onSwitchToLogin()
      } catch (error) {
        helpers.setStatus(error.message)
      }
    },
  })

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={formik.handleSubmit}>
        <h1>Create Account</h1>
        <p>Start organizing your day with TaskFlow.</p>

        <div className="form-field">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && <span className="field-error">{formik.errors.name}</span>}
        </div>

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

        <div className="form-field">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span className="field-error">{formik.errors.confirmPassword}</span>
          )}
        </div>

        {formik.status && <p className="form-error">{formik.status}</p>}

        <button className="primary-btn" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="auth-switch-text">
          Already have an account?{' '}
          <button className="link-btn" type="button" onClick={onSwitchToLogin}>
            Login
          </button>
        </p>
      </form>
    </section>
  )
}

export default Register
