let video;
let bodyPose;
let poses = [];
let connections;

function preload() {
    // Load the bodyPose model
    bodyPose = ml5.bodyPose({ flipHorizontal: true });
}

function setup() {
    //createCanvas(640, 480);
    // Create the canvas dynamically and attach it to the video-wrapper div
    const videoWrapper = document.getElementById('video-wrapper');
    const canvas = createCanvas(640, 480);
    canvas.parent(videoWrapper);

    // Create the video and hide it
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Start detecting poses in the webcam video
    bodyPose.detectStart(video, gotPoses);
    // Get the skeleton connection information
    connections = bodyPose.getSkeleton();

    // Start the master giving commands
    startMasterCommands();
}

function draw() {
    // Mirror the video horizontally
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // Debug: Check if poses are being detected
    console.log("Poses detected:", poses.length);

    // Draw the skeleton connections
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
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
    }

    // Draw all the tracked landmark points and analyze state
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
        analyzeState(pose, i + 1);
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.confidence > 0.1) {
                fill(0, 255, 0);
                noStroke();
                circle(keypoint.x, keypoint.y, 10);
            }
        }
    }
}

// Analyze the state of the person based on their pose
function analyzeState(pose, personNumber) {
    console.log(`Analyzing pose for Person ${personNumber}`);
    console.log("Pose keypoints:", pose.keypoints);

    console.log("All keypoints for Person 1:");
    pose.keypoints.forEach((keypoint, index) => {
        console.log(`Keypoint ${index}:`, keypoint);
    });
    


    let leftKnee = pose.keypoints.find((k) => k.name === "left_knee");
    let rightKnee = pose.keypoints.find((k) => k.name === "right_knee");
    let leftHip = pose.keypoints.find((k) => k.name === "left_hip");
    let rightHip = pose.keypoints.find((k) => k.name === "right_hip");

    console.log("Left Hip:", leftHip);
    console.log("Right Hip:", rightHip);
    console.log("Left Knee:", leftKnee);
    console.log("Right Knee:", rightKnee);

    if (!leftKnee || !rightKnee || !leftHip || !rightHip) {
        console.warn(`Missing keypoints for Person ${personNumber}`);
        return;
    }

    console.log(`Left Knee Y: ${leftKnee.y}, Left Hip Y: ${leftHip.y}`);
    console.log(`Right Knee Y: ${rightKnee.y}, Right Hip Y: ${rightHip.y}`);

    // Determine if the person is "dead" (squatting) or "alive" (standing)
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

// Callback function for when bodyPose outputs data
function gotPoses(results) {
    console.log("Got poses:", results);
    poses = results;
}

// Function to start master commands
function startMasterCommands() {
    const commands = ["Dead!", "Alive!"];
    setInterval(() => {
        // Randomly select a command
        const command = commands[Math.floor(Math.random() * commands.length)];
        
        // Speak the command
        speakCommand(command);
    }, 3000); // Issue a command every 3 seconds
}

// Function to speak the command
function speakCommand(command) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(command);
    utterance.lang = "en"; // Set the language to English
    synth.speak(utterance);
}
