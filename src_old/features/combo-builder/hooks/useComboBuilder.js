// features/combo-builder/hooks/useComboBuilder.js
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  setCombos, 
  addMove, 
  removeMove, 
  reorderMoves,
  setAvailableMoves,
  clearCurrentCombo,
  addComboToList,
  deleteCombo,
  setLoading,
  setError,
  selectCombos,
  selectCurrentCombo,
  selectAvailableMoves,
  selectIsLoading,
  selectError
} from '../store/comboBuilderSlice';

export const useComboBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameId, characterId } = useParams();
  
  // Select from store
  const combos = useSelector(selectCombos);
  const currentCombo = useSelector(selectCurrentCombo);
  const availableMoves = useSelector(selectAvailableMoves);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  // Fetch combos for a character
  const fetchCombos = async () => {
    try {
      dispatch(setLoading(true));
      
      // Mock API call - Replace with actual API when backend is ready
      // const response = await fetch(`/api/games/${gameId}/characters/${characterId}/combos`);
      // const data = await response.json();
      
      // For now, use mock data
      const data = []; // Mock empty data
      
      dispatch(setCombos(data));
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Error loading combos');
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Fetch available moves for a character
  const fetchAvailableMoves = async () => {
    try {
      dispatch(setLoading(true));
      
      // Mock API call - Replace with actual API when backend is ready
      // const response = await fetch(`/api/games/${gameId}/characters/${characterId}/moves`);
      // const data = await response.json();
      
      // For now, use mock data
      const data = [
        { id: 'move1', name: 'Punch', damage: 10, input: 'P' },
        { id: 'move2', name: 'Kick', damage: 15, input: 'K' },
        { id: 'move3', name: 'Special', damage: 25, input: 'QCF+P' }
      ];
      
      dispatch(setAvailableMoves(data));
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Error loading moves');
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Add a move to the current combo
  const handleAddMove = (move) => {
    dispatch(addMove(move));
  };
  
  // Remove a move from the current combo
  const handleRemoveMove = (moveId) => {
    dispatch(removeMove(moveId));
  };
  
  // Handle drag and drop reordering
  const handleReorderMoves = (startIndex, endIndex) => {
    dispatch(reorderMoves({ startIndex, endIndex }));
  };
  
  // Navigate to combo creator
  const navigateToComboCreator = () => {
    dispatch(clearCurrentCombo());
    navigate(`/games/${gameId}/characters/${characterId}/combos/create`);
  };
  
  // Navigate back to combo list
  const navigateToComboList = () => {
    dispatch(clearCurrentCombo());
    navigate(`/games/${gameId}/characters/${characterId}/combos`);
  };
  
  // Save a combo
  const saveCombo = async (comboName) => {
    if (currentCombo.length === 0) {
      toast.warning('Cannot save empty combo');
      return;
    }
    
    if (!comboName) {
      toast.warning('Please provide a name for the combo');
      return;
    }
    
    try {
      dispatch(setLoading(true));
      
      // Calculate total damage
      const totalDamage = currentCombo.reduce((total, move) => total + move.damage, 0);
      
      const newCombo = {
        id: Date.now().toString(),
        name: comboName,
        moves: currentCombo,
        damage: totalDamage,
        characterId,
        gameId
      };
      
      // Mock API call - Replace with actual API when backend is ready
      // await fetch(`/api/games/${gameId}/characters/${characterId}/combos`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newCombo)
      // });
      
      dispatch(addComboToList(newCombo));
      dispatch(clearCurrentCombo());
      toast.success('Combo saved successfully');
      navigateToComboList();
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Error saving combo');
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Delete a combo
  const handleDeleteCombo = async (comboId) => {
    try {
      dispatch(setLoading(true));
      
      // Mock API call - Replace with actual API when backend is ready
      // await fetch(`/api/games/${gameId}/characters/${characterId}/combos/${comboId}`, {
      //   method: 'DELETE'
      // });
      
      dispatch(deleteCombo(comboId));
      toast.success('Combo deleted successfully');
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Error deleting combo');
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    // State
    combos,
    currentCombo,
    availableMoves,
    isLoading,
    error,
    
    // Actions
    fetchCombos,
    fetchAvailableMoves,
    handleAddMove,
    handleRemoveMove,
    handleReorderMoves,
    navigateToComboCreator,
    navigateToComboList,
    saveCombo,
    handleDeleteCombo
  };
};