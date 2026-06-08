import { playGestureSequence } from '../phraseGestureUtils';
import { ARE } from '../Words/ARE';
import { YOU } from '../Words/YOU';

export const ARE_YOU = (ref) => {
    playGestureSequence(ref, [ARE, YOU]);
};