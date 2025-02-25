/**
 * Available tags for combo categorization
 */
export const COMBO_TAGS = [
  'Anywhere',       // Combo works anywhere on screen
  'Counterhit',     // Requires counterhit to work
  'Punish',         // Useful as a punish
  'Corner',         // Works specifically in corner
  'Midscreen',      // Works specifically midscreen
  'BnB',            // Bread and butter combo
  'TOD',            // Touch of Death (100% combo)
  'Meterless',      // Requires no meter
  'Optimal',        // Most efficient damage/resource ratio
  'Beginner Friendly', // Easy to execute for beginners
  'Juggle',         // Juggle combo
  'Reset',          // Contains a reset
  'Launch',         // Launcher combo
  'Wall Carry',     // Carries opponent to the wall
  'Wall Splat',     // Requires wall splat
  'OTG',            // On The Ground (hits opponent on ground)
  'Anti-Air',       // Anti-air conversion
  'Low Starter',    // Starts from a low attack
  'Overhead Starter' // Starts from an overhead
];

/**
 * Difficulty levels for combos
 */
export const COMBO_DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    label: 'Easy',
    description: 'Simple execution, good for beginners'
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Moderate execution requirements'
  },
  {
    id: 'hard',
    label: 'Hard',
    description: 'Complex execution, requires practice'
  }
];

/**
 * Default values for new combos
 */
export const DEFAULT_COMBO_VALUES = {
  damage: 0,
  difficulty: 'medium',
  tags: [],
  likes: 0,
  dislikes: 0
};