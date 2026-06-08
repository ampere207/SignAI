import { enqueueGesture } from '../wordGestureUtils';

export const COME = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHand", "rotation", "y", Math.PI / 10, "+"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 6, "+"],
            ["mixamorigRightArm", "rotation", "x", -Math.PI / 10, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 4, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 4, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "x", 0, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};