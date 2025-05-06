// pixomato project!

/* What an animation project should contain:

file extension: .pxmt

*/

class layer {
    constructor(name, fps) {
        this.name = name;

        this.settings = {
            frames_per_second: 24,
        }
    }
}

class pixomato_project {
    constructor(name) {
        this.name = name;
        this.time_created = new Date().getTime();
        this.layers = [];

        this.project_settings = {
            frames_per_second: 24, // default fps that applies to all layers
        }
    }
}