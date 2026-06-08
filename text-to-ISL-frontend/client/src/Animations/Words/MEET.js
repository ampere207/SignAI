import { enqueueGesture } from '../wordGestureUtils';

export const MEET = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigRightHand", "rotation", "z", -Math.PI / 16, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 8, "+"],
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 5, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 8, "-"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "z", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
        ],
    ]);
};import { enqueueGesture } from '../wordGestureUtils';

export const MEET = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigRightHand", "rotation", "y", -Math.PI / 12, "-"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"],
            ["mixamorigLeftHand", "rotation", "x", Math.PI / 10, "+"],
            ["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 12, "-"],
            ["mixamorigLeftArm", "rotation", "z", -Math.PI / 10, "-"],
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigLeftHandIndex1", "rotation", "y", -Math.PI / 3, "-"],
        ],
        [
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightHand", "rotation", "y", 0, "+"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
            ["mixamorigLeftHand", "rotation", "x", 0, "-"],
            ["mixamorigLeftForeArm", "rotation", "z", 0, "+"],
            ["mixamorigLeftArm", "rotation", "z", 0, "+"],
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigLeftHandIndex1", "rotation", "y", 0, "+"],
        ],
    ]);
};