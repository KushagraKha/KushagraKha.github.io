
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
    const editor = document.getElementById("editor");
    const output = document.getElementById("output");
    const runButton = document.getElementById("runButton");

    // Disable the editor and button initially
    editor.contentEditable = "false";
    editor.innerText = "Loading resources...";
    runButton.disabled = true;

    let pyodide;

    try {
        // Load Pyodide with a timeout
        const pyodidePromise = loadPyodide();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 30000)
        );

        pyodide = await Promise.race([pyodidePromise, timeoutPromise]);

        // Pyodide loaded successfully
        console.log("Pyodide loaded!");
        editor.innerText = "Resources loaded!";
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

        // Enable the editor and button
        editor.contentEditable = "true";
        editor.innerText = ""; // Clear the editor for user input
        runButton.disabled = false;

        // Redirect stdout and stderr to capture output
        let outputBuffer = "";
        function redirectOutput(text) {
            outputBuffer += text;
        }
        pyodide.globals.set("redirectOutput", redirectOutput);
        pyodide.runPython(`
            import sys
            class OutputRedirector:
                def __init__(self, write_func):
                    self.write_func = write_func

                def write(self, text):
                    self.write_func(text)

                def flush(self):
                    pass

            sys.stdout = OutputRedirector(redirectOutput)
            sys.stderr = OutputRedirector(redirectOutput)
        `);

        // Handle code execution
        runButton.addEventListener("click", async () => {
            const code = editor.innerText;
            output.innerText = ""; // Clear previous output
            outputBuffer = ""; // Clear the buffer

            try {
                await pyodide.runPythonAsync(code);
                output.innerText = outputBuffer || "Code executed successfully.";
            } catch (error) {
                output.innerText = `Error: ${error.message}`;
            }
        });
    } catch (error) {
        console.error("Failed to load Pyodide:", error);
        editor.innerText = "Resources cannot be loaded at the moment, please check back later ):";
        runButton.disabled = true;
    }
}

// Initialize the Python Playground
initializePythonPlayground();
