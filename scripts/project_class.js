// pixomato project!

/* What an animation project should contain:

file extension: .pxmt

*/

function frame() {
    this.list = [
        
    ]
}

function layer(name, fps) {
    this.name = name;

    this.settings = {
        frames_per_second: 24,
    }

    this.frames
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