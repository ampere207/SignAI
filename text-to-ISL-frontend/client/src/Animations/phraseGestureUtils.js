export const playGestureSequence = (ref, gestures) => {
  if (!ref || !Array.isArray(gestures) || gestures.length === 0) {
    return;
  }

  for (const gesture of gestures) {
    if (typeof gesture === 'function') {
      gesture(ref);
    }
  }
};