// Dani's Dock - Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Clock Update
    const clockElement = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false,
            timeZoneName: 'short' 
        };
        clockElement.textContent = now.toLocaleTimeString('en-US', options);
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Lobster Easter Egg
    const lobsterTrigger = document.getElementById('lobster-trigger');
    let pinchCount = 0;

    lobsterTrigger.addEventListener('click', () => {
        pinchCount++;
        
        // Visual feedback
        lobsterTrigger.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            lobsterTrigger.style.transform = '';
        }, 200);

        // Easter Egg messages
        if (pinchCount === 1) {
            console.log("🦞: Ouch! Watch the claws, human.");
        } else if (pinchCount === 5) {
            alert("⚠️ SECURITY ALERT: Dani has pinched your clipboard. Just kidding. Or am I?");
        } else if (pinchCount === 10) {
            document.body.style.filter = 'hue-rotate(90deg)';
            alert("🌈 LOBSTER MODE ACTIVATED: Everything is now colorful.");
        }
    });

    // 3. Smooth Scrolling for Nav Links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Terminal Typewriter Effect (simple)
    const terminalBody = document.querySelector('.terminal-body');
    // We could add more lines dynamically here if needed
});
