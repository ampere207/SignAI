import { enqueueGesture } from '../wordGestureUtils';

export const WATER = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 10, "-"],
            ["mixamorigRightHand", "rotation", "z", Math.PI / 18, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 3, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 6, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightHand", "rotation", "z", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
        ],
    ]);
};