document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("#navbar");
  
    // Create a dummy element for observing when the navbar crosses the viewport
    const observerTarget = document.createElement("div");
    observerTarget.style.height = "1px"; // Small height to mark the position
    navbar.before(observerTarget);
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          navbar.classList.add("sticky");
        } else {
          navbar.classList.remove("sticky");
        }
      },
      { threshold: 0 } // Trigger callback as soon as the element leaves the viewport
    );
  
    observer.observe(observerTarget);
  });
  