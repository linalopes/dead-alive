# Dead or Alive
An interactive attention game that challenges players to follow commands and react quickly, determining whether they stay "Alive" or fall "Dead."

---

## Overview
"Dead or Alive" is a browser-based interactive game that combines creative coding and machine learning. Using a webcam and the ml5.js library, the game detects participants' body poses and evaluates their reactions to commands like "Dead!" or "Alive!".

---

## Features
- Real-time body pose detection using ml5.js.
- Interactive commands with visual and audio feedback.
- Dynamic rendering of poses and skeletons.
- Fun and engaging gameplay for multiple participants.

---

## Technologies Used
- HTML5, CSS3, JavaScript: Core web technologies.
- p5.js: Creative coding framework for rendering graphics.
- ml5.js: Machine learning library for pose detection.
- Web Speech API: For issuing spoken commands.

---

## Setup Instructions
1. Clone the Repository
```bash
git clone https://github.com/linalopes/dead-alive.git
cd dead-or-alive
```

2. Install Dependencies
This project relies on CDN-hosted libraries (no local installation required). Ensure your internet connection is active.

3. Run the Project
To ensure the project runs smoothly, it's recommended to serve the files using a local development server. You can use http-server, a lightweight tool for this purpose or the one of your preference.

```bash
http-server --cors
```
Open the provided URL (usually http://localhost:8080) in your web browser.
Allow camera permissions when prompted.

---

## How to Play
1. Players stand in front of the webcam.
2. The game randomly issues commands:
    "Alive!": Players must stand upright.
    "Dead!": Players must squat down.
3. The game evaluates the players' poses and displays their status on the screen.

