self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js");

self.onmessage = async (event) => {
    const { type, payload } = event.data;

    if (type === "loadPyodide") {
        try {
            self.postMessage({ type: "status", payload: "Starting Pyodide load..." });

            // Timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Pyodide load timeout")), 30000);
            });

            // Load Pyodide
            const loadPromise = loadPyodide();
            const pyodide = await Promise.race([loadPromise, timeoutPromise]);

            self.pyodide = pyodide;

            // Redirect stdout and stderr to JavaScript
            self.pyodide.runPython(`
                import sys
                from js import console

                class OutputRedirector:
                    def __init__(self):
                        self.output = ""

                    def write(self, text):
                        self.output += text

                    def flush(self):
                        pass

                redirector = OutputRedirector()
                sys.stdout = redirector
                sys.stderr = redirector
            `);

            self.postMessage({ type: "loaded", payload: "Pyodide loaded successfully!" });
        } catch (error) {
            self.postMessage({ type: "error", payload: `Failed to load Pyodide: ${error.message}` });
        }
    } else if (type === "runCode") {
        try {
            if (!self.pyodide) {
                throw new Error("Pyodide is not loaded. Please load Pyodide first.");
            }

            // Execute Python code
            await self.pyodide.runPythonAsync(payload);

            // Retrieve and clear the output
            const output = self.pyodide.runPython(`sys.stdout.output`);
            self.pyodide.runPython(`sys.stdout.output = ""`);

            self.postMessage({ type: "result", payload: output });
        } catch (error) {
            self.postMessage({ type: "error", payload: error.message });
        }
    }
};
