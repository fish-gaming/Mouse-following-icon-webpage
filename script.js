// Followed this tutorial: https://www.youtube.com/watch?v=wG_5453Vq98
// also https://www.w3schools.com/ and https://www.geeksforgeeks.org/ were used to learn basic javascript

console.clear();

const circleElement = document.querySelector('.circle');

const mouse = { x: 0, y: 0 }; // track mouse position
const previousMouse = { x: 0, y: 0 } // track where the mouse was
const circle = { x: 0, y: 0 }; // track circle position

let currentScale = 0;
let currentAngle = 0;
let facingLeft = false; // going to be used to see if fish is facing left
let paused = false;
let animationFrameId = null;

// update the mousemove position
window.addEventListener('mousemove', (e) => 
{ 
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// how fast the circle gets to the mouse
let speed = 0.075; // lowered for the fish
// how much does the fish need to move before we flip it
const flipThreshold = 2; // pixels

const tick = () => 
{
    if (!paused) 
    {
        // move the fish towards the mouse
        circle.x += (mouse.x - circle.x) * speed; 
        circle.y += (mouse.y - circle.y) * speed;

        const fishSize = 200; // same as --circle-size
        const half = fishSize / 2;

        // screen bounds
        const minX = half;
        const maxX = window.innerWidth - half;
        const minY = half;
        const maxY = window.innerHeight - half;

        // clamp position to walls
        circle.x = Math.max(minX, Math.min(circle.x, maxX));
        circle.y = Math.max(minY, Math.min(circle.y, maxY));


        // string for circle translation
        const translateTransform = `translate(${circle.x}px, ${circle.y}px)`; 

        // calc change in mouse position
        const deltaMouseX = mouse.x - previousMouse.x; 
        const deltaMouseY = mouse.y - previousMouse.y;

        // update for next frame
        previousMouse.x = mouse.x; 
        previousMouse.y = mouse.y;

        if (deltaMouseX > flipThreshold)
        {
            facingLeft = false;
        }
        else if (deltaMouseX < -flipThreshold)
        {
            facingLeft = true;
        }

        // use a^2 + b^2 = c^2 to find the velocity of the mouse
        const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
        const scaleValue = (mouseVelocity / 150) * 1.0; // changed to make the fish stretch
        //const scaleValue = (mouseVelocity / 150) * 0.5; // convert the velocity to > 0.5

        // update current scale
        currentScale += (scaleValue - currentScale) * speed;
        // string for circle scaling
        const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`; 

        // calculate the angle to the mouse
        const angle = Math.atan2(deltaMouseY, Math.abs(deltaMouseX) + 0.0001) * 180 / Math.PI;
        
        if (mouseVelocity > 20) 
        {
            currentAngle = angle; // reduce shake
        }

        // string for circle rotation
        const rotateTransform = `rotate(${currentAngle}deg)`; 

        const flipTransform = facingLeft ? 'scaleX(-1)' : 'scaleX(1)';

        // apply stings to the circle
        circleElement.style.transform = `${translateTransform} ${flipTransform} ${rotateTransform} ${scaleTransform}`;

        animationFrameId = window.requestAnimationFrame(tick); // get the next frame 
    }
};

document.getElementById("pauseBtn").addEventListener("click", () => 
    {
    paused = !paused;

    if (paused) 
    {
        document.getElementById("pauseBtn").textContent = "Resume";
    } 
    else 
    {
        document.getElementById("pauseBtn").textContent = "Pause";
        tick(); // restart animation loop
    }
});

const speedSlider = document.getElementById("speedSlider");
speedSlider.addEventListener("input", () => 
{
    const raw = parseFloat(speedSlider.value);
    const normalized = (raw - 0.001) / (1.3 - 0.001);
    speed = normalized;
    const display = raw.toFixed(2);
    document.getElementById("speedValue").textContent = (raw * 10).toFixed(2);;
});

tick(); // start the animation