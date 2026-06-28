// -------------------------------------------------------------
// Alex Carter Portfolio Interactive Logic
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCustomCursor();
    initTypewriter();
    initScrollAnimations();
    initContactSection();
});
/* 1. Navbar Scroll State & Mobile Hamburger Toggle */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    // Scrolled header background blur
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    // Mobile navigation toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}
/* 2. Custom Hovering Pointer Cursor Trail */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (!cursor || !follower) return;
    let posX = 0,
        posY = 0;
    let mouseX = 0,
        mouseY = 0;
    // Follower smooth interpolation
    setInterval(() => {
        posX += (mouseX - posX) / 6;
        posY += (mouseY - posY) / 6;

        follower.style.left = posX + 'px';
        follower.style.top = posY + 'px';
    }, 10);
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    // Add scale/glow triggers on interactive elements
    const hoverables = document.querySelectorAll('a, button, .tag-card, .education-card, .certificate-card, .project-card, input, textarea');

    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hovering');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hovering');
        });
    });
}
/* 3. Text Typewriter Effect for Role */
function initTypewriter() {
    const targetElement = document.getElementById('typewriter');
    if (!targetElement) return;
    const roles = ["Frontend Developer.", "Creative Designer.", "Technology Innovator.", "Problem Solver."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            targetElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            targetElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Types at normal speed
        }
        // Handle word completion state transitions
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 1800; // Pause at end of completed word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Small delay before starting next word
        }
        setTimeout(type, typingSpeed);
    }
    type();
}
/* 4. Intersection Observer for Scroll Reveals & Active Nav State */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const skillsBars = document.querySelectorAll('.circle-bar, .gauge-fill');
    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    reveals.forEach(element => revealObserver.observe(element));
    // Active navigation highlighter & skill progress triggering observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');

                // Highlight navbar
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                // If skills section is entered, animate circular gauges
                if (sectionId === 'skills') {
                    skillsBars.forEach(bar => {
                        if (bar.classList.contains('circle-bar')) {
                            bar.classList.add('active');
                        } else if (bar.classList.contains('gauge-fill')) {
                            // Read inline custom width property
                            const fillWidth = bar.getAttribute('style');
                            bar.style.width = fillWidth.match(/\d+%/)[0];
                        }
                    });
                }
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "-10% 0px -40% 0px"
    });
    sections.forEach(sec => sectionObserver.observe(sec));
}
/* 5. Certificate Viewer Lightbox Modal */
function openCertModal(imagePath, title, subtitle) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    if (!modal || !modalImg) return;
    modalImg.src = imagePath;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Restore scroll
}
/* 6. Creative Contact Clipboard Email & Form Validator */
function initContactSection() {
    const btnCopy = document.getElementById('btnCopyEmail');
    const emailText = document.getElementById('devEmail');
    const tooltip = document.getElementById('copyTooltip');
    if (btnCopy && emailText && tooltip) {
        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(emailText.textContent)
                .then(() => {
                    tooltip.textContent = 'Copied!';
                    tooltip.style.color = '#ff007f';
                    tooltip.style.borderColor = '#ff007f';

                    // Reset copy status back to default
                    setTimeout(() => {
                        tooltip.textContent = 'Copy';
                        tooltip.style.color = '';
                        tooltip.style.borderColor = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy email: ', err);
                });
        });
    }
}
// Contact form submissions
function handleFormSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('btnSubmitForm');
    const successOverlay = document.getElementById('successOverlay');

    // Simulate sending animation
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Transmitting...';
    setTimeout(() => {
        // Show interactive successful state screen
        successOverlay.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
    }, 1500);
}

function resetForm() {
    const contactForm = document.getElementById('contactForm');
    const successOverlay = document.getElementById('successOverlay');

    if (contactForm && successOverlay) {
        contactForm.reset();
        successOverlay.classList.remove('active');
    }
}
