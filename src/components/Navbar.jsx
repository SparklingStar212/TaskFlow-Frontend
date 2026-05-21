import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import SearchBar from './SearchBar'

const Navbar = ({ searchTerm, onSearchChange, onToggleMenu }) => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const avatarInitial = user?.name?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="navbar">
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={onToggleMenu}
        aria-label="Open menu"
      >
        Menu
      </button>

      <div className="brand-wrap">
        <p className="eyebrow">Task Management</p>
        <h1>TaskFlow</h1>
      </div>

      <div className="navbar-search">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          showLabel={false}
          placeholder="Search tasks"
        />
      </div>

      <div className="navbar-actions">
        <span className="welcome">{user?.name}</span>
        <button
          className="ghost-btn"
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <div className="avatar" aria-label="User profile avatar" title={user?.name}>
          {avatarInitial}
        </div>
      </div>
    </header>
  )
}

export default Navbar
