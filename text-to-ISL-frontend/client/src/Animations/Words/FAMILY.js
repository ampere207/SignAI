import { enqueueGesture } from '../wordGestureUtils';

export const FAMILY = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigLeftHand", "rotation", "z", Math.PI / 16, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 8, "-"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 4, "+"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 16, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 18, "-"],
        ],
        [
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftHand", "rotation", "z", 0, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigHead", "rotation", "x", 0, "+"],
        ],
    ]);
};