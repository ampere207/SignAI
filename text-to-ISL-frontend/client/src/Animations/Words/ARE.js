import { enqueueGesture } from '../wordGestureUtils';

export const ARE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightHand", "rotation", "y", Math.PI / 18, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 14, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 14, "+"],
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 14, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 14, "-"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
        ],
    ]);
};import { enqueueGesture } from '../wordGestureUtils';

export const ARE = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 12, "-"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigHead", "rotation", "x", -Math.PI / 18, "-"],
        ],
        [
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigHead", "rotation", "x", 0, "+"],
        ],
    ]);
};