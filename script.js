// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Hover Effects for Cursor
const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursorOutline) {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursorOutline) {
            cursorOutline.style.width = '20px';
            cursorOutline.style.height = '20px';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
});

// Typewriter Effect
const roles = ["AI Engineer", "ML Developer", "Data Analyst", "Python Coder"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeTarget = document.querySelector('.typewriter');

function type() {
    if(!typeTarget) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typeTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);

// GSAP Animations

// Hero Fade In
const tl = gsap.timeline();
tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" })
  .from(".hero-title", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
  .from(".typewriter", { opacity: 0, duration: 0.5 }, "-=0.5")
  .from(".hero-text", { y: 20, opacity: 0, duration: 0.8 }, "-=0.3")
  .from(".hero-btns", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");

// General Section Reveals
gsap.utils.toArray('.reveal-up').forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

gsap.utils.toArray('.reveal-left').forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

gsap.utils.toArray('.reveal-right').forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// ROBUST SKILL CARD ANIMATION
// Set initial state
gsap.set(".skill-card", {y: 50, opacity: 0});

// Batch animation for cards
ScrollTrigger.batch(".skill-card", {
    start: "top 85%",
    onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"}),
});

// Neural Network Background (Canvas)
const canvas = document.getElementById('neural-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');

    let w, h, particles;
    const particleCount = 60;
    const connectionDistance = 150;
    const mouseDistance = 200;

    let mouse = { x: null, y: null };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.5)'; // Violet dots
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        
        particles.forEach(p => {
            p.update();
            p.draw();
            
            // Connect to other particles
            particles.forEach(p2 => {
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist / connectionDistance * 0.8})`; // Fade out
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });

            // Connect to mouse
            if (mouse.x) {
                let dx = p.x - mouse.x;
                let dy = p.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouseDistance) {
                     ctx.strokeStyle = `rgba(34, 211, 238, ${1 - dist / mouseDistance})`; // Cyan line to mouse
                     ctx.beginPath();
                     ctx.moveTo(p.x, p.y);
                     ctx.lineTo(mouse.x, mouse.y);
                     ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    init();
    animate();
}