# Arcitecture Documentation

## File Structure:

```
src/
├── components/                                                    # includes global components such as the error boundary
│   └── ErrorBoundary/
│       ├── ErrorBoundary.jsx
│       └── ErrorBoundary.scss
├── features/                                                      # feature based architecture, includes every feature
│   ├── app/                                                       # app feature, it contains the parent App component which handles routing
│   │   └── components/
│   │       └── App/
│   │           ├── App.jsx
│   │           ├── App.scss
│   │           └── index.js
│   ├── gameSelection/                                             # Game Selection feature, lets the user select a game from the list
│   │   ├── components/                                            # component handling the game selection logic, will need subcomponents like GameCard
│   │   │   └── GameSelection/
│   │   │       ├── GameSelection.jsx
│   │   │       ├── GameSelection.scss
│   │   │       └── index.js
│   │   ├── pages/                                                 # page containing the game selection component
│   │   │   └── GameSelectionPage/
│   │   │       ├── GameSelectionPage.jsx
│   │   │       ├── GameSelectionPage.scss
│   │   │       └── index.js
│   │   ├── store/
│   │   │   └── gameSelectionSlice.js
│   ├── CharacterSelection/                                        # character selection feature, letting users select a character. Data depends on selected game.
│   │   ├── components/                                            # component handling the character selection logic, will need subcomponents like CharacterCard
│   │   │   └── CharacterSelection/
│   │   │       ├── CharacterSelection.jsx
│   │   │       ├── CharacterSelection.scss
│   │   │       └── index.js
│   │   ├── pages/                                                 # page containing the character selection component
│   │   │   └── CharacterSelectionPage/
│   │   │       ├── CharacterSelectionPage.jsx
│   │   │       ├── CharacterSelectionPage.scss
│   │   │       └── index.js
│   │   ├── store/
│   │   │   └── characterSelectionSlice.js
│   ├── ComboList/                                                 # combo List feature, will list all the available combos for the selected character.
│   │   ├── components/                                            # component handling the combo list logic, will need subcomponents
│   │   │   └── ComboList/
│   │   │       ├── ComboList.jsx
│   │   │       ├── ComboList.scss
│   │   │       └── index.js
│   │   ├── pages/                                                 # page containing the combo list component
│   │   │   └── ComboListPage/
│   │   │       ├── ComboListPage.jsx
│   │   │       ├── ComboListPage.scss
│   │   │       └── index.js
│   │   ├── store/
│   │   │   └── comboListSlice.js
│   ├── ComboBuilder/                                              # combo builder feature, will allow users to create combos for the selected character and submit them to the combo list.
│   │   ├── components/                                            # component handling the combo builder logic, will need subcomponents like ComboSequence and MoveCard
│   │   │   └── ComboBuilder/
│   │   │       ├── ComboBuilder.jsx
│   │   │       ├── ComboBuilder.scss
│   │   │       └── index.js
│   │   ├── pages/                                                 # page containing the combo builder component
│   │   │   └── ComboBuilderPage/
│   │   │       ├── ComboBuilderPage.jsx
│   │   │       ├── ComboBuilderPage.scss
│   │   │       └── index.js
│   │   ├── store/
│   │   │   └── comboBuilderSlice.js
│   ├── SideBar/                                                   # Feature for the permanent side bar containing global buttons like auth controls.
│   │   ├── components/                                            # Component handling the sidebar logic 
│   │   │   └── SideBar/
│   │   │       ├── SideBar.jsx
│   │   │       ├── SideBar.scss
│   │   │       └── index.js
│   │   ├── store/
│   │   │   └── sideBar.js
│   └── Auth/                                                      # user authentication feature, ideally with Auth0 or another auth service.
│       ├── components/                                            # Component handling the Auth logic 
│       │   └── Auth/
│       │       ├── Auth.jsx
│       │       ├── Auth.scss
│       │       └── index.js
│       └── store/
│           └── auth.js
├── hooks/                                                         # contains global hooks like for error handling
│   └── useErrorHandler.js
├── store/                                                         # contains global redux store configuration
│   ├── index.js
│   └── rootReducer.js
└── styles/                                                        # contains global styling rules for the entire application, would contain variables, mixins, functions, reset, etc.
    └── main.scss
App.jsx                                                            # root App file which contains error handling, global layout, redux provider, etc
main.jsx
```