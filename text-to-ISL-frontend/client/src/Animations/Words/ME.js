import { enqueueGesture } from '../wordGestureUtils';

export const ME = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 5, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 12, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
        ],
        [
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};