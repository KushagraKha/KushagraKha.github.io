
document.getElementById("editor").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default Enter behavior (new div creation)
        const editor = event.target;

        // Get the current caret position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Insert a newline at the caret position
        const newlineNode = document.createTextNode("\n");
        range.insertNode(newlineNode);

        // Move the caret to the end of the newline
        range.setStartAfter(newlineNode);
        range.setEndAfter(newlineNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});


async function initializePythonPlayground() {
    // Load Pyodide
    const pyodide = await loadPyodide();
    console.log("Pyodide loaded!");

    // Reference to DOM elements
    const editor = document.getElementById("editor");
    const runButton = document.getElementById("runButton");
    const output = document.getElementById("output");

    // Run Python code on button click
    runButton.addEventListener("click", async () => {
        const code = editor.innerText;
        output.innerText = ""; // Clear previous output

        try {
            // Execute Python code
            const result = await pyodide.runPythonAsync(code);
            output.innerText = result || "Code executed successfully.";
        } catch (error) {
            output.innerText = `Error: ${error.message}`;
        }
    });
}

// Initialize the Python Playground
initializePythonPlayground();
