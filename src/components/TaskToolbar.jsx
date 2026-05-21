import SearchBar from './SearchBar'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

const TaskToolbar = ({ searchTerm, onSearchChange, viewFilter, onFilterChange }) => {
  return (
    <div className="task-toolbar" role="search" aria-label="Task filters">
      <label className="task-toolbar-filter">
        <span>Filter</span>
        <select
          value={viewFilter}
          onChange={(event) => onFilterChange(event.target.value)}
          aria-label="Filter tasks by status"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="task-toolbar-search">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by task title"
          showLabel={false}
        />
      </div>
    </div>
  )
}

export default TaskToolbar
