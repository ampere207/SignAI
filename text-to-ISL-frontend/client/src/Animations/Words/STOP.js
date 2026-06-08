import { enqueueGesture } from '../wordGestureUtils';

export const STOP = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 6, "+"],
            ["mixamorigRightHand", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 14, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 6, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
        ],
    ]);
};