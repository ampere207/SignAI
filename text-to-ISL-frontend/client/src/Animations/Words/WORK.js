import { enqueueGesture } from '../wordGestureUtils';

export const WORK = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigLeftHand", "rotation", "z", Math.PI / 18, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 8, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 6, "-"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 18, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 6, "+"],
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
        ],
    ]);
};