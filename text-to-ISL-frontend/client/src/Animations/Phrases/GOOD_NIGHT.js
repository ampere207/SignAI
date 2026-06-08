import { playGestureSequence } from '../phraseGestureUtils';
import { GOOD } from '../Words/GOOD';
import { NIGHT } from '../Words/NIGHT';

export const GOOD_NIGHT = (ref) => {
    playGestureSequence(ref, [GOOD, NIGHT]);
};