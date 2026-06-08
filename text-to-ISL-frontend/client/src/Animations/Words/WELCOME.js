import { enqueueGesture } from '../wordGestureUtils';

export const WELCOME = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 12, "-"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigHead", "rotation", "y", Math.PI / 18, "+"],
        ],
        [
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigHead", "rotation", "y", 0, "-"],
        ],
    ]);
};