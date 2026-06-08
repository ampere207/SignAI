import { enqueueGesture } from '../wordGestureUtils';

export const FRIEND = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandIndex2", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandIndex3", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandMiddle2", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandMiddle3", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandRing2", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandRing3", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandPinky2", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandPinky3", "rotation", "z", Math.PI / 9, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
        ],
        [
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
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};