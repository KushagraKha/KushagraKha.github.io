
// Get canvas and context
const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Recalculate canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeNodes(); // Reinitialize nodes on resize
});

// Node settings
const nodeCount = 100;
const nodeRadius = 3;
const connectionDistance = 100;
let nodes = [];

// Create nodes
function initializeNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2, // Velocity in X
            vy: (Math.random() - 0.5) * 2, // Velocity in Y
        });
    }
}

// Draw a single node
function drawNode(node) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; // Node color
    ctx.fill();
}

// Draw connection lines between close nodes
function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = getDistance(nodes[i], nodes[j]);
            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`; // Fade line as distance increases
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Calculate distance between two points
function getDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Update node positions
function updateNodes() {
    nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
    });
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    nodes.forEach(drawNode); // Draw nodes
    drawConnections(); // Draw connections
    updateNodes(); // Update node positions
    requestAnimationFrame(animate); // Repeat animation
}

// Initialize and start animation
initializeNodes();
animate();

function initializePythonPlayground() {
    const editor = document.getElementById("editor");
    const output = document.getElementById("output");
    const runButton = document.getElementById("runButton");

    if (!editor || !output || !runButton) {
        console.log("Python Playground elements not found. Skipping initialization.");
        return;
    }

    // Initialize Web Worker
    const worker = new Worker("scripts/pyodideWorker.js");

    // Disable the editor and button initially
    editor.contentEditable = "false";
    editor.innerText = "Loading resources...(this may take a while)";
    runButton.disabled = true;

    worker.postMessage({ type: "loadPyodide" });

    // Handle worker messages
    worker.onmessage = (event) => {
        const { type, payload } = event.data;
    
        if (type === "loaded") {
            console.log(payload);
            editor.innerText = "Resources loaded!";
            setTimeout(() => {
                editor.contentEditable = "true";
                editor.innerText = ""; // Clear the editor for user input
                runButton.disabled = false;
            }, 1000);
        } else if (type === "result") {
            output.innerText = payload || "Code executed successfully.";
        } else if (type === "error") {
            output.innerText = `Error: ${payload}`;
            console.error(payload); // Log the error for debugging
        }
    };    

    // Handle code execution
    runButton.addEventListener("click", () => {
        const code = editor.innerText;
        output.innerText = "Executing...";
        worker.postMessage({ type: "runCode", payload: code });
    });
}

// Initialize the Python Playground
initializePythonPlayground();
