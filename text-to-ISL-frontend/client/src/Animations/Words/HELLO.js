import { enqueueGesture } from '../wordGestureUtils';

export const HELLO = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandMiddle2", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandMiddle3", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandRing2", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandRing3", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandPinky2", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandPinky3", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandThumb2", "rotation", "y", -Math.PI / 4, "-"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 3.5, "+"],
            ["mixamorigRightArm", "rotation", "y", -Math.PI / 10, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 10, "-"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "y", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb2", "rotation", "y", 0, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky3", "rotation", "z", 0, "-"],
        ],
    ]);
};