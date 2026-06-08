import { enqueueGesture } from '../wordGestureUtils';

export const TO = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandIndex2", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandIndex3", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 16, "+"],
        ],
        [
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex3", "rotation", "z", 0, "-"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};