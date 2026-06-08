import { enqueueGesture } from '../wordGestureUtils';

export const CARE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHand", "rotation", "z", Math.PI / 16, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 18, "-"],
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
};import { enqueueGesture } from '../wordGestureUtils';

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