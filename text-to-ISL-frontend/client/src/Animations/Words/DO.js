import { enqueueGesture } from '../wordGestureUtils';

export const DO = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigRightHand", "rotation", "y", Math.PI / 16, "+"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 16, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 14, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
        ],
    ]);
};