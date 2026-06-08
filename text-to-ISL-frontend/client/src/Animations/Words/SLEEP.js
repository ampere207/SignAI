import { enqueueGesture } from '../wordGestureUtils';

export const SLEEP = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigHead", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigHead", "rotation", "z", Math.PI / 18, "+"],
            ["mixamorigRightHand", "rotation", "x", -Math.PI / 5, "-"],
            ["mixamorigRightForeArm", "rotation", "z", -Math.PI / 8, "-"],
            ["mixamorigRightArm", "rotation", "x", -Math.PI / 12, "-"],
            ["mixamorigLeftHand", "rotation", "x", -Math.PI / 5, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigLeftArm", "rotation", "x", -Math.PI / 12, "-"],
        ],
        [
            ["mixamorigHead", "rotation", "x", 0, "-"],
            ["mixamorigHead", "rotation", "z", 0, "-"],
            ["mixamorigRightHand", "rotation", "x", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "+"],
            ["mixamorigRightArm", "rotation", "x", 0, "+"],
            ["mixamorigLeftHand", "rotation", "x", 0, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "-"],
            ["mixamorigLeftArm", "rotation", "x", 0, "+"],
        ],
    ]);
};