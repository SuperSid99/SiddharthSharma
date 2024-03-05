// particles.js

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1"; // Set z-index to -1 to place it behind other elements

    let particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 15 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.1;
        }

        draw() {
            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size*2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    function createParticles(e) {
        const xPos = e.clientX;
        const yPos = e.clientY;

        for (let i = 0; i < 1; i++) {
            particles.push(new Particle(xPos, yPos));
        }
        // particles.push(new Particle(xPos, yPos));
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    }

    document.addEventListener("mousemove", createParticles);
    animateParticles();

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
