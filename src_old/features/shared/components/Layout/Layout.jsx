// features/shared/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Sun, Moon, X } from 'lucide-react';
import { toggleTheme, selectTheme } from '../../../app/store/themeSlice';
import './Layout.scss';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Set theme on both HTML and body
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    
    // Debug CSS variables
    const styles = getComputedStyle(document.documentElement);
    console.log('Theme updated:', currentTheme);
    console.log('CSS Variables:', {
      '--color-bg-primary': styles.getPropertyValue('--color-bg-primary').trim(),
      '--color-text-primary': styles.getPropertyValue('--color-text-primary').trim(),
    });
  }, [currentTheme]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__logo">FG</div>

        <button
          className="layout__button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Open games menu"
        >
          <Menu size={24} />
        </button>

        <button
          className="layout__button"
          onClick={handleThemeToggle}
          aria-label={
            currentTheme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {currentTheme === "dark" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </aside>

      {isModalOpen && (
        <div
          className="layout__modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="layout__modal" onClick={(e) => e.stopPropagation()}>
            <div className="layout__modal-header">
              <h2>Select Game</h2>
              <button
                className="layout__modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="layout__modal-content">
              {/* Game selection content will go here */}
            </div>
          </div>
        </div>
      )}

      <main className="layout__content">{children}</main>
    </div>
  );
};

export default Layout;
