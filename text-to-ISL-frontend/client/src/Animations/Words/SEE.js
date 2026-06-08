import { enqueueGesture } from '../wordGestureUtils';

export const SEE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandIndex2", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandIndex3", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandMiddle2", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandMiddle3", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandRing2", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandRing3", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandPinky2", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandPinky3", "rotation", "z", Math.PI / 2.2, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};import { enqueueGesture } from '../wordGestureUtils';

export const SEE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 12, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};