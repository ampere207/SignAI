import { playGestureSequence } from '../phraseGestureUtils';
import { GOOD } from '../Words/GOOD';
import { EVENING } from '../Words/EVENING';

export const GOOD_EVENING = (ref) => {
    playGestureSequence(ref, [GOOD, EVENING]);
};