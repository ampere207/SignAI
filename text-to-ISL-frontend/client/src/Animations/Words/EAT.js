import { enqueueGesture } from '../wordGestureUtils';

export const EAT = (ref) => {
    enqueueGesture(ref, [
        [
            ["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandIndex2", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandIndex3", "rotation", "z", Math.PI / 3, "+"],
            ["mixamorigRightHandThumb1", "rotation", "y", -Math.PI / 4, "-"],
            ["mixamorigRightHandThumb2", "rotation", "y", -Math.PI / 8, "-"],
            ["mixamorigRightHandThumb3", "rotation", "y", -Math.PI / 8, "-"],
            ["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"],
            ["mixamorigRightForeArm", "rotation", "z", Math.PI / 12, "+"],
            ["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"],
        ],
        [
            ["mixamorigRightHandIndex1", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex2", "rotation", "z", 0, "-"],
            ["mixamorigRightHandIndex3", "rotation", "z", 0, "-"],
            ["mixamorigRightHandThumb1", "rotation", "y", 0, "+"],
            ["mixamorigRightHandThumb2", "rotation", "y", 0, "+"],
            ["mixamorigRightHandThumb3", "rotation", "y", 0, "+"],
            ["mixamorigRightHand", "rotation", "x", 0, "-"],
            ["mixamorigRightForeArm", "rotation", "z", 0, "-"],
            ["mixamorigRightArm", "rotation", "z", 0, "-"],
        ],
    ]);
};