import { playGestureSequence } from '../phraseGestureUtils';
import { GOOD } from '../Words/GOOD';
import { MORNING } from '../Words/MORNING';

export const GOOD_MORNING = (ref) => {
    playGestureSequence(ref, [GOOD, MORNING]);
};