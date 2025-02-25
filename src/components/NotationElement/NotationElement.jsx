// src/components/NotationElement/NotationElement.jsx
import React, { useState } from 'react';
import { normalizeNotationElement } from '../../features/comboCreation/services/NotationElementService';
import './NotationElement.scss';

/**
 * A reusable component for rendering notation elements with consistent fallback hierarchy
 * Fallback flow: image → display → symbol → id → name
 * Shows a tooltip with the element description or name on hover
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
  
  // Normalize the element to ensure consistent structure
  const normalizedElement = normalizeNotationElement(element);
  
  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Render the element content following the fallback flow:
  // First, handle the nested element structure from expandedNotation
  // Then: image → display → symbol → id → name
  const renderElementContent = () => {
    // First, check if there's an element property (from expandedNotation structure)
    if (normalizedElement.element) {
      // If the element has an imageUrl, try to use that first
      if (normalizedElement.element.imageUrl && !imageError) {
        return (
          <img 
            src={normalizedElement.element.imageUrl} 
            alt={normalizedElement.element.name} 
            className="notation-element__image"
            onError={handleImageError}
          />
        );
      }
      
      // Then try the symbol from element
      if (normalizedElement.element.symbol && normalizedElement.element.symbol.trim() !== '') {
        return normalizedElement.element.symbol;
      }
    }
    
    // Continue with regular fallback checks...
    if (normalizedElement.imageUrl && !imageError) {
      return (
        <img 
          src={normalizedElement.imageUrl} 
          alt={normalizedElement.name} 
          className="notation-element__image"
          onError={handleImageError}
        />
      );
    }
    
    // Check for display property
    if (normalizedElement.display && normalizedElement.display.trim() !== '') {
      return normalizedElement.display;
    }
    
    // If no display, check for symbol
    if (normalizedElement.symbol && normalizedElement.symbol.trim() !== '') {
      return normalizedElement.symbol;
    }
    
    // Try elementId
    if (normalizedElement.elementId && normalizedElement.elementId.trim() !== '') {
      return normalizedElement.elementId;
    }
    
    // Last resort, name
    return normalizedElement.name || '?';
  };
  
  // Get the tooltip text - prioritize description, then fall back to name
  const getTooltipText = () => {
    // First check for description in original element (for expanded notation)
    if (element.description) {
      return element.description;
    }
    
    // Then check in normalized element
    if (normalizedElement.description) {
      return normalizedElement.description;
    }
    
    // Then check in element.element (for nested structure)
    if (normalizedElement.element && normalizedElement.element.description) {
      return normalizedElement.element.description;
    }
    
    // Fall back to name with similar checks
    if (normalizedElement.element && normalizedElement.element.name) {
      return normalizedElement.element.name;
    }
    
    return normalizedElement.name || normalizedElement.elementId || 'Unknown Element';
  };
  
  // Get category-specific class for styling
  const categoryClass = normalizedElement.categoryId 
    ? `notation-element--${normalizedElement.categoryId}` 
    : '';
  
  return (
    <div
      className={`notation-element-container ${isHovered ? 'notation-element-container--show-tooltip' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span 
        className={`notation-element ${categoryClass} ${imageError ? 'notation-element--image-error' : ''} ${className}`}
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