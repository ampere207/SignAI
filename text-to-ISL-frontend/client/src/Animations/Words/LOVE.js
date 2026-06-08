import { enqueueGesture } from '../wordGestureUtils';

export const LOVE = (ref) => {
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
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 2.5, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2.5, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 8, "+"],
        ],
        [
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
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};