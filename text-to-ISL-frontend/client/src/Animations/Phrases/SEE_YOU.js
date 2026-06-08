import { playGestureSequence } from '../phraseGestureUtils';
import { SEE } from '../Words/SEE';
import { YOU } from '../Words/YOU';

export const SEE_YOU = (ref) => {
    playGestureSequence(ref, [SEE, YOU]);
};