import React, { useState } from 'react';
import './NotationElement.scss';

/**
 * A reusable component for rendering notation elements with minimal spacing
 * Handles various potential data structures and includes numpad support
 */
const NotationElement = ({ 
  element, 
  className = '',
  showTooltip = true,
  showNumpad = false, // Prop to control numpad display
  ...otherProps 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // If element is invalid, render nothing
  if (!element) {
    return null;
  }
  
  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Render the element content with multiple fallback strategies
  const renderElementContent = () => {
    // Prioritize image if available and not errored
    if (element.imageUrl && !imageError) {
      return (
        <img 
          src={element.imageUrl} 
          alt={element.name || 'Notation Element'} 
          className="notation-element__image"
          onError={handleImageError}
          style={{ maxWidth: '18px', maxHeight: '18px' }} // Inline style to ensure size constraints
        />
      );
    }
    
    // Fallback to numpad if showNumpad is true and numpad exists
    if (showNumpad && element.numpad) {
      return (
        <span className="notation-element__numpad" style={{ padding: 0, margin: 0 }}>
          {element.numpad}
        </span>
      );
    }
    
    // Otherwise fallback to symbol, then name, then elementId
    const displayValue = 
      element.symbol || 
      element.name || 
      element.elementId || 
      element.id || 
      '?';
    
    return (
      <span className="notation-element__symbol" style={{ padding: 0, margin: 0 }}>
        {displayValue}
      </span>
    );
  };
  
  // Get tooltip text with multiple fallback strategies
  const getTooltipText = () => {
    // Construct a descriptive tooltip
    const categoryName = element.categoryName || '';
    const name = element.name || element.elementId || element.id || '';
    const description = element.description || '';
    const numpad = element.numpad ? ` (${element.numpad})` : '';
    
    // Build tooltip based on available information
    let tooltip = name;
    
    if (numpad) tooltip += numpad;
    if (categoryName) tooltip = `${categoryName}: ${tooltip}`;
    if (description) tooltip += ` - ${description}`;
    
    return tooltip;
  };
  
  return (
    <div
      className={`notation-element-container ${isHovered ? 'notation-element-container--show-tooltip' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ margin: 0, padding: 0 }} // Inline style to ensure zero spacing
    >
      <span 
        className={`notation-element ${imageError ? 'notation-element--image-error' : ''} ${className}`}
        style={{ padding: '1px', margin: 0, backgroundColor: 'transparent', border: 'none' }} // Inline style for immediate effect
        {...otherProps}
      >
        {renderElementContent()}
      </span>
      
      {showTooltip && isHovered && (
        <div className="notation-element__tooltip">
          {getTooltipText()}
        </div>
      )}
    </div>
  );
};

export default NotationElement;