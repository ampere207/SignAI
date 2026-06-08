import { enqueueGesture } from '../wordGestureUtils';

export const SORRY = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 8, "-"],
            ["mixamorigRightForeArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 5, "+"],
            ["mixamorigRightArm", "rotation", "x", -Math.PI / 12, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 6, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 3, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "+"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "x", 0, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};