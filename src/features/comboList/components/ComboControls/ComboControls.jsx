import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSortAmountDown, FaSortAmountUp, FaTimes } from 'react-icons/fa';
import { 
  toggleSortDirection, 
  setDifficultyFilter,
  addTagFilter,
  removeTagFilter,
  clearAllFilters,
  selectSortDirection,
  selectFilters,
  selectCombos
} from '../../store/comboListSlice';
import { COMBO_DIFFICULTY_LEVELS, COMBO_TAGS } from '../../../../constants/comboConstants';
import './ComboControls.scss';

const ComboControls = () => {
  const dispatch = useDispatch();
  const sortDirection = useSelector(selectSortDirection);
  const filters = useSelector(selectFilters);
  const combos = useSelector(selectCombos);

  // Toggle sort direction handler
  const handleToggleSortDirection = () => {
    dispatch(toggleSortDirection());
  };

  // Handle difficulty change
  const handleDifficultyChange = (event) => {
    dispatch(setDifficultyFilter(event.target.value));
  };

  // Handle tag selection
  const handleTagSelect = (event) => {
    const tag = event.target.value;
    if (tag && tag !== '') {
      dispatch(addTagFilter(tag));
      // Reset the select to default option
      event.target.value = '';
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tag) => {
    dispatch(removeTagFilter(tag));
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
  };

  // Calculate if any filters are active
  const hasActiveFilters = filters.difficulty !== 'all' || filters.tags.length > 0;

  // Get available tags (excluding already selected ones)
  const availableTags = COMBO_TAGS.filter(tag => !filters.tags.includes(tag));

  return (
    <div className="combo-controls">
      <div className="combo-controls__results-info">
        <span className="combo-controls__results-count">
          {combos.length} {combos.length === 1 ? 'combo' : 'combos'} found
        </span>
      </div>

      <div className="combo-controls__filters">
        {/* Difficulty Filter */}
        <div className="combo-controls__filter-group">
          <label className="combo-controls__filter-label" htmlFor="difficulty-filter">
            Difficulty:
          </label>
          <select 
            id="difficulty-filter"
            className="combo-controls__select"
            value={filters.difficulty}
            onChange={handleDifficultyChange}
          >
            <option value="all">All</option>
            {COMBO_DIFFICULTY_LEVELS.map(level => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div className="combo-controls__filter-group">
          <label className="combo-controls__filter-label" htmlFor="tag-filter">
            Add Tag:
          </label>
          <select 
            id="tag-filter"
            className="combo-controls__select" 
            onChange={handleTagSelect}
            value=""
          >
            <option value="">Select a tag</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Direction */}
        <div className="combo-controls__filter-group">
          <label className="combo-controls__filter-label">Sort:</label>
          <button 
            className="combo-controls__sort-button"
            onClick={handleToggleSortDirection}
            title={sortDirection === 'asc' ? 'Showing least liked first' : 'Showing most liked first'}
          >
            <span className="combo-controls__sort-icon">
              {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </span>
            <span className="combo-controls__sort-text">
              {sortDirection === 'asc' ? 'Least Liked' : 'Most Liked'}
            </span>
          </button>
        </div>

        {/* Clear Filters Button (only shown when filters are active) */}
        {hasActiveFilters && (
          <div className="combo-controls__filter-group combo-controls__filter-group--clear">
            <button 
              className="combo-controls__clear-button"
              onClick={handleClearAllFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Tag Display */}
      {filters.tags.length > 0 && (
        <div className="combo-controls__active-tags">
          <span className="combo-controls__tags-label">Active Tags:</span>
          <div className="combo-controls__tags-list">
            {filters.tags.map(tag => (
              <div key={tag} className="combo-controls__tag">
                <span className="combo-controls__tag-text">{tag}</span>
                <button 
                  className="combo-controls__tag-remove"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove ${tag} tag`}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboControls;