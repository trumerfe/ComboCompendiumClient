import React, { useState } from 'react';
import './NotationElement.scss';

/**
 * A reusable component for rendering notation elements with consistent fallback hierarchy
 * Handles various potential data structures
 */
const NotationElement = ({ 
  element, 
  className = '',
  showTooltip = true,
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
        />
      );
    }
    
    // Fallback to symbol, then name, then elementId
    const displayValue = 
      element.symbol || 
      element.name || 
      element.elementId || 
      '?';
    
    return (
      <span className="notation-element__symbol">
        {displayValue}
      </span>
    );
  };
  
  // Get tooltip text with multiple fallback strategies
  const getTooltipText = () => {
    // Construct a descriptive tooltip
    const categoryName = element.categoryName || 'Notation';
    const name = element.name || element.elementId || '';
    const description = element.description || '';
    
    // Combine available information
    return description 
      ? `${categoryName}: ${name} - ${description}`
      : `${categoryName}: ${name}`;
  };
  
  return (
    <div
      className={`notation-element-container ${isHovered ? 'notation-element-container--show-tooltip' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span 
        className={`notation-element ${imageError ? 'notation-element--image-error' : ''} ${className}`}
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