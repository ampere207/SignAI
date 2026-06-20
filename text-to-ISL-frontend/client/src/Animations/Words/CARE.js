import { enqueueGesture } from '../wordGestureUtils';

export const CARE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigLeftHand", "rotation", "z", -Math.PI / 16, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 16, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 14, "+"],
        ],
        [
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftHand", "rotation", "z", 0, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};