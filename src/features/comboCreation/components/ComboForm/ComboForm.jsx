import React from "react";
import { FaTimes } from "react-icons/fa";
import { COMBO_DIFFICULTY_LEVELS } from "../../../../constants/comboConstants";
import useComboCreation from "../../hooks/useComboCreation";
import "./ComboForm.scss";

const ComboForm = () => {
  const {
    comboDetails,
    availableTags,
    handleNameChange,
    handleDamageChange,
    handleDifficultyChange,
    handleDescriptionChange,
    handleVideoChange,
    handleAddTag,
    handleRemoveTag,
  } = useComboCreation();

  // Handle adding a tag from the dropdown
  const handleTagSelect = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag && !comboDetails.tags.includes(selectedTag)) {
      handleAddTag(selectedTag);
      e.target.value = ""; // Reset select
    }
  };

  return (
    <div className="combo-form">
      <h2 className="combo-form__title">Combo Details</h2>

      <div className="combo-form__grid">
        {/* Combo Name */}
        <div className="combo-form__field combo-form__field--name">
          <label className="combo-form__label" htmlFor="combo-name">
            Combo Name *
          </label>
          <input
            id="combo-name"
            type="text"
            className="combo-form__input"
            placeholder="Enter a name for your combo"
            value={comboDetails.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        {/* Damage */}
        <div className="combo-form__field combo-form__field--damage">
          <label className="combo-form__label" htmlFor="combo-damage">
            Damage
          </label>
          <input
            id="combo-damage"
            type="number"
            className="combo-form__input"
            placeholder="Damage"
            value={comboDetails.damage}
            onChange={(e) => handleDamageChange(e.target.value)}
            min="0"
          />
        </div>

        {/* Difficulty */}
        <div className="combo-form__field combo-form__field--difficulty">
          <label className="combo-form__label" htmlFor="combo-difficulty">
            Difficulty
          </label>
          <select
            id="combo-difficulty"
            className="combo-form__select"
            value={comboDetails.difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
          >
            {COMBO_DIFFICULTY_LEVELS.map((level) => (
              <option key={level.id} value={level.id} title={level.description}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Tags Select */}
        <div className="combo-form__field combo-form__field--tags-select">
          <label className="combo-form__label" htmlFor="combo-tags">
            Add Tags
          </label>
          <select
            id="combo-tags"
            className="combo-form__select combo-form__tag-select"
            onChange={handleTagSelect}
            value=""
          >
            <option value="" disabled>
              Add a tag...
            </option>
            {availableTags
              .filter((tag) => !comboDetails.tags.includes(tag))
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
        </div>

        {/* Tags Container - shows selected tags */}
        <div className="combo-form__field combo-form__field--tags-container">
          <label className="combo-form__label">Selected Tags</label>
          <div className="combo-form__tag-container">
            {comboDetails.tags.length > 0 ? (
              <div className="combo-form__tags">
                {comboDetails.tags.map((tag) => (
                  <div key={tag} className="combo-form__tag">
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="combo-form__tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="combo-form__tag-placeholder">No tags selected</p>
            )}
          </div>
        </div>
      </div>

      {/* <div className="combo-form__required-notice">* Required fields</div> */}
    </div>
  );
};

export default ComboForm;