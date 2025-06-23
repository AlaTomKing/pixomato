// This script is responsible for storing project informations

// pixomato project!

/* What an animation project should contain:

file extension: .pxmt

*/

// the keyframe that contains an image
function keyframe() {
    this.list = [
        
    ]
}

// the layer that contains multiple keyframes
function layer(name, fps) {
    this.name = name;

    this.settings = {
        frames_per_second: 24,
    }

    this.keyframes = []
}

// represents project
function pixomato_project(name, fps) {
    this.name = name;
    this.time_created = new Date().getTime();
    this.layers = [];

    this.project_settings = {
        frames_per_second: 24, // default fps that applies to all layers
    }
}