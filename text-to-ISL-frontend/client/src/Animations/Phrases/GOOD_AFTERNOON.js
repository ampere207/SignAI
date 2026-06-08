import { playGestureSequence } from '../phraseGestureUtils';
import { GOOD } from '../Words/GOOD';
import { AFTERNOON } from '../Words/AFTERNOON';

export const GOOD_AFTERNOON = (ref) => {
    playGestureSequence(ref, [GOOD, AFTERNOON]);
};