import { enqueueGesture } from '../wordGestureUtils';

export const I = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandIndex2", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandIndex3", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 14, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 16, "+"],
        ],
        [
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandRing1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandPinky1", "rotation", "z", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};