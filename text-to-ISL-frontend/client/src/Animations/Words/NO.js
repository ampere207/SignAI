import { enqueueGesture } from '../wordGestureUtils';

export const NO = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigHead", "rotation", "y", -Math.PI / 10, "-"],
            ["mixamorigHead", "rotation", "y", Math.PI / 10, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 12, "+"],
            ["mixamorigRightHand", "rotation", "y", Math.PI / 10, "+"],
            ["mixamorigRightForeArm", "rotation", "z", -Math.PI / 12, "-"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 3, "+"],
        ],
        [
            ["mixamorigHead", "rotation", "y", 0, "-"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "+"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};