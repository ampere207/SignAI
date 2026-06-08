import { enqueueGesture } from '../wordGestureUtils';

export const PLEASE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHand", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigRightArm", "rotation", "x", -Math.PI / 8, "-"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 5, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 8, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "x", 0, "+"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};