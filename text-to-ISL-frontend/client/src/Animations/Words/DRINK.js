import { enqueueGesture } from '../wordGestureUtils';

export const DRINK = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 10, "-"],
            ["mixamorigRightHand", "rotation", "z", Math.PI / 20, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 3, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 4, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 4, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightHand", "rotation", "z", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};