import { enqueueGesture } from '../wordGestureUtils';

export const MORNING = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", -Math.PI / 5, "-"],
            ["mixamorigRightHand", "rotation", "y", Math.PI / 18, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightHandThumb1", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 18, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 10, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "+"],
            ["mixamorigRightHand", "rotation", "y", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "x", 0, "-"],
            ["mixamorigHead", "rotation", "x", 0, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"],
        ],
    ]);
};