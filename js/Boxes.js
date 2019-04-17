var boxes = [];
const NUM_OF_BOXES = 100;

for (var i = 0; i < NUM_OF_BOXES; i++) {
    var x = (Math.random() - 0.5) * 150;
    var y = Math.random() * 25 + 5;
    var z = (Math.random() - 0.5) * 150;

    var width = Math.random() * 5 + 0.5;
    var height = Math.random() * 5 + 0.5;
    var depth = Math.random() * 5 + 0.5;

    boxes.push({
        x: x,
        y: y,
        z: z,
        width: width,
        height: height,
        depth: depth
    });
}

exports.getBoxes = () => {
    return boxes;
};