import { playGestureSequence } from '../phraseGestureUtils';
import { THANK } from '../Words/THANK';
import { YOU } from '../Words/YOU';

export const THANK_YOU = (ref) => {
    playGestureSequence(ref, [THANK, YOU]);
};