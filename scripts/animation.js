// test animation

let FPS = 12;

const max = 5000;

const totalFrames = Math.floor(FPS * max / 1000);

let startTime
let runnin = false

let then, fpsInterval, timeStopped

console.log("fps")

const frame = () => {
    const now = performance.now();
    const totalTimeElapsed = performance.now() - startTime;
    const elapsed = now - then

    if (totalTimeElapsed < max && runnin) {
        requestAnimationFrame(frame);

        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            console.log(Math.floor((totalTimeElapsed / max) * totalFrames));
        }
    } else {
        console.log("stop");
        runnin = false;
    }
}

// function that will print out frames in 5 seconds
const testFrames = () => {
    console.log("start")

    runnin = true

    startTime = performance.now();
    fpsInterval = 1000 / FPS

    then = startTime;

    console.log(0);

    frame();
}

const pause = () => {
    timeStopped = performance.now();
    runnin = false;
}

const resume = () => {
    startTime += performance.now() - timeStopped;
    runnin = true;
    frame();
}