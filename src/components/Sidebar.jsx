const MENU_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'all', label: 'All Tasks' },
  { key: 'pending', label: 'Pending Tasks' },
  { key: 'completed', label: 'Completed Tasks' },
  { key: 'profile', label: 'Profile' },
  { key: 'logout', label: 'Logout' },
]

const Sidebar = ({ activeItem, onItemSelect, isMobileOpen, onClose }) => {

  const handleSelect = (itemKey) => {
    onItemSelect(itemKey)
    onClose()
  }

  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop ${isMobileOpen ? 'open' : ''}`}
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <h2>Menu</h2>
        <nav>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-btn ${activeItem === item.key ? 'active' : ''}`}
              onClick={() => handleSelect(item.key)}
              aria-current={activeItem === item.key ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
