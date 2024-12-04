// Declare global variables for video capture, body pose detection, and poses
let video;
let bodyPose;
let poses = [];
let connections;

/* 
===========================================================
SETUP
This section initializes the video capture, canvas, and
starts the body pose detection. It also prepares the game
logic for issuing commands like "Dead!" or "Alive!".
===========================================================
*/

function preload() {
    // Preload the bodyPose model using ml5.js with horizontal flip for mirroring
    bodyPose = ml5.bodyPose({ flipHorizontal: true });
}


function setup() {
    // Dynamically create the canvas and attach it to the "video-wrapper" div in the HTML
    const videoWrapper = document.getElementById('video-wrapper');
    const canvas = createCanvas(640, 480);
    canvas.parent(videoWrapper);

    // Initialize video capture and hide the video element (only show the canvas)
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    /// Start detecting body poses using the video feed
    bodyPose.detectStart(video, gotPoses);

    // Get skeleton connection information for drawing lines between keypoints
    connections = bodyPose.getSkeleton();

    // Start issuing commands ("Dead" or "Alive") to players
    startMasterCommands();
}

/* 
===========================================================
DRAWING
This section is responsible for rendering the mirrored video
feed on the canvas, visualizing detected poses, and drawing 
skeletons and keypoints for all participants. It also displays
the state ("Dead" or "Alive") for each person.
===========================================================
*/

function draw() {
    // Draw the mirrored video feed on the canvas
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // Debug: Check if poses are being detected
    console.log("Poses detected:", poses.length);

    // Loop through detected poses to draw skeletons and keypoints
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
        
        // Draw skeleton connections for the pose
        for (let j = 0; j < connections.length; j++) {
            let pointAIndex = connections[j][0];
            let pointBIndex = connections[j][1];
            let pointA = pose.keypoints[pointAIndex];
            let pointB = pose.keypoints[pointBIndex];

            if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
                stroke(255, 0, 0);
                strokeWeight(2);
                line(pointA.x, pointA.y, pointB.x, pointB.y);
            }
        }
        
        // Analyze the state of each person (standing or squatting) and display it
        analyzeState(pose, i + 1);

        // Draw keypoints for each person
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.confidence > 0.1) {
                fill(0, 255, 0); // Green color for keypoints
                noStroke();
                circle(keypoint.x, keypoint.y, 10);
            }
        }

    }
}

/* 
===========================================================
POSE ANALYSIS
This section analyzes the body pose data to determine whether
a participant is "Dead" (squatting) or "Alive" (standing).
It uses keypoints like knees and hips to calculate the posture
and displays the result on the canvas.
===========================================================
*/

// Analyze the player's pose to determine if they are "Dead" (squatting) or "Alive" (standing)
function analyzeState(pose, personNumber) {
    console.log(`Analyzing pose for Person ${personNumber}`);
    console.log("Pose keypoints:", pose.keypoints);

    console.log("All keypoints for Person 1:");
    pose.keypoints.forEach((keypoint, index) => {
        console.log(`Keypoint ${index}:`, keypoint);
    });
    
    // Extract keypoints for knees and hips
    let leftKnee = pose.keypoints.find((k) => k.name === "left_knee");
    let rightKnee = pose.keypoints.find((k) => k.name === "right_knee");
    let leftHip = pose.keypoints.find((k) => k.name === "left_hip");
    let rightHip = pose.keypoints.find((k) => k.name === "right_hip");

    console.log("Left Hip:", leftHip);
    console.log("Right Hip:", rightHip);
    console.log("Left Knee:", leftKnee);
    console.log("Right Knee:", rightKnee);

    // Handle missing keypoints
    if (!leftKnee || !rightKnee || !leftHip || !rightHip) {
        console.warn(`Missing keypoints for Person ${personNumber}`);
        return;
    }

    console.log(`Left Knee Y: ${leftKnee.y}, Left Hip Y: ${leftHip.y}`);
    console.log(`Right Knee Y: ${rightKnee.y}, Right Hip Y: ${rightHip.y}`);

    // Determine the player's state based on relative positions of knees and hips
    let state = "Dead";
    if (
        leftKnee.y > leftHip.y + 50 &&
        rightKnee.y > rightHip.y + 50
    ) {
        state = "Alive";
    }

    console.log(`Person ${personNumber} is ${state}`);

    // Display the state on the canvas
    fill(255);
    textSize(20);
    textAlign(LEFT);
    text(`Person ${personNumber}: ${state}`, 10, height - 20 * personNumber);
}

// Callback function to handle detected poses
function gotPoses(results) {
    console.log("Got poses:", results);
    poses = results;
}

/* 
===========================================================
MASTER COMMANDS
This section handles the game's commands. It issues random
instructions ("Dead!" or "Alive!") at regular intervals
and uses the browser's speech synthesis to speak the commands
out loud for the participants.
===========================================================
*/

// Function to randomly issue "Dead" or "Alive" commands
function startMasterCommands() {
    const commands = ["Dead!", "Alive!"];
    setInterval(() => {
        // Choose a random command and speak it
        const command = commands[Math.floor(Math.random() * commands.length)];
        speakCommand(command);
    }, 3000); // Command issued every 3 seconds
}

// Function to speak the selected command using the browser's speech synthesis
function speakCommand(command) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(command);
    utterance.lang = "en"; // Set language to English
    synth.speak(utterance);
}
