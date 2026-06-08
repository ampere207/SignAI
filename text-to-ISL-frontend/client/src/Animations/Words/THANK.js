import { enqueueGesture } from '../wordGestureUtils';

export const THANK = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 12, "-"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 18, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 4, "+"],
            ["mixamorigRightArm", "rotation", "x", -Math.PI / 10, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 4, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 4, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 4, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 4, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightHand", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "x", 0, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky1", "rotation", "z", 0, "-"],
        ],
    ]);
};