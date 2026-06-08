import { playGestureSequence } from '../phraseGestureUtils';
import { LOVE } from '../Words/LOVE';
import { YOU } from '../Words/YOU';

export const I_LOVE_YOU = (ref) => {
    playGestureSequence(ref, [LOVE, YOU]);
};