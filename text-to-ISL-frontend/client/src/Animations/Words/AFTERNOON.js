import { enqueueGesture } from '../wordGestureUtils';

export const AFTERNOON = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 12, "+"],
            ["mixamorigRightHand", "rotation", "z", Math.PI / 18, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 30, "-"],
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 10, "+"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigHead", "rotation", "x", 0, "+"],
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
        ],
    ]);
};