import { enqueueGesture } from '../wordGestureUtils';

export const READY = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 16, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 18, "-"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigHead", "rotation", "x", 0, "+"],
        ],
    ]);
};