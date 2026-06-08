import { playGestureSequence } from '../phraseGestureUtils';
import { NEED } from '../Words/NEED';
import { CARE } from '../Words/CARE';

export const TAKE_CARE = (ref) => {
    playGestureSequence(ref, [NEED, CARE]);
};