import { playGestureSequence } from '../phraseGestureUtils';
import { HOW } from '../Words/HOW';
import { ARE } from '../Words/ARE';
import { YOU } from '../Words/YOU';

export const HOW_ARE_YOU = (ref) => {
    playGestureSequence(ref, [HOW, ARE, YOU]);
};