export const enqueueGesture = (ref, frames) => {
  if (!ref || !Array.isArray(frames) || frames.length === 0) {
    return;
  }

  for (const frame of frames) {
    ref.animations.push(frame);
  }

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }
};

export const addResetFrame = (targetJoints) => {
  return targetJoints.map(([boneName, action, axis]) => [boneName, action, axis, 0, action === "rotation" ? "+" : "+"]);
};