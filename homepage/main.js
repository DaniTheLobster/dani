document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    setupTransitions();
    setupGlitchEffect();
});

function initCanvas() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.pulse = Math.random() * 0.1;
        }

        update() {
            this.y -= this.speed;
            this.opacity += Math.sin(Date.now() * 0.001) * 0.01;
            
            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
            ctx.fill();
            
            // Subtle glow
            if (this.size > 2) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(0, 242, 255, 0.5)';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Deep water gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#050a0f');
        grad.addColorStop(1, '#020508');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function setupTransitions() {
    const links = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function setupGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            el.style.animation = 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite';
        });
        
        el.addEventListener('mouseout', () => {
            el.style.animation = 'none';
        });
    });
}

// Simple page transition trigger
window.addEventListener('beforeunload', () => {
    document.body.classList.add('fade-out');
});
