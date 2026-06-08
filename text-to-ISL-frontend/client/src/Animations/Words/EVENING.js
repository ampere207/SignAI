import { enqueueGesture } from '../wordGestureUtils';

export const EVENING = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 12, "+"],
            ["mixamorigRightHand", "rotation", "y", Math.PI / 16, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 24, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 8, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigHead", "rotation", "x", 0, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
        ],
    ]);
};