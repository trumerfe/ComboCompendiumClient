import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../../../../components/Layout/Layout";
import ErrorFallback from "../../../../components/ErrorBoundary/ErrorFallback";
import GameSelection from "../../../game-selection/components/GameSelection";
import ComboListPage from "../../../combo-builder/components/ComboListPage";
import ComboCreatorPage from "../../../combo-builder/components/ComboCreatorPage";
import CharacterSelectionPage from "../../../character-selection/components/CharacterSelectionPage";

const App = () => {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Fighting Game Combo Builder</h1>
      </header>
      <main className="app__main">
        <Router>
        <Routes>
          <Route path="/" element={<GameSelection />} />
          <Route path="/games/:gameId/characters" element={<CharacterSelectionPage />} />
          <Route path="/games/:gameId/characters/:characterId/combos" element={<ComboListPage />} />
          <Route path="/games/:gameId/characters/:characterId/combos/create" element={<ComboCreatorPage />} />
        </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;
