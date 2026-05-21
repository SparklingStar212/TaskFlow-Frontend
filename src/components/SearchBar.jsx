const SearchBar = ({ value, onChange, placeholder = 'Find by title or description', showLabel = true }) => {
  return (
    <label className="search-bar">
      {showLabel && <span>Search tasks</span>}
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export default SearchBar
