// --- Particles System for Hero Background ---
class ParticleSystem {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.numParticles = window.innerWidth < 768 ? 40 : 80;
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      this.init();
      this.animate();
    }
    
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    
    init() {
      this.particles = [];
      for (let i = 0; i < this.numParticles; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    }
    
    animate() {
      requestAnimationFrame(() => this.animate());
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.numParticles; i++) {
        let p = this.particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > this.canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > this.canvas.height) p.vy = -p.vy;
        
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 194, 255, 0.5)';
        this.ctx.fill();
        
        for (let j = i + 1; j < this.numParticles; j++) {
          let p2 = this.particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          
          if (dist < 120) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(0, 194, 255, ${0.15 - dist/120 * 0.15})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
    }
  }
  
  // --- Initialize App ---
  document.addEventListener('DOMContentLoaded', () => {
    
    // Init Particles
    new ParticleSystem('particle-canvas');
  
    // Scroll Effects (Navbar & Reveal Elements)
    const navbar = document.getElementById('navbar');
    const revealElements = document.querySelectorAll('.reveal');
    
    const handleScroll = () => {
      // Navbar Glass Effect
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
  
      // Reveal Animations on Scroll
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const winHeight = window.innerHeight;
        if (rect.top < winHeight * 0.85) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      
      // Close menu on link click
      document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }
  
    // Form Path Selection
    const paths = document.querySelectorAll('.path-card');
    const whichWrap = document.getElementById('which-wrap');
    
    paths.forEach((path, index) => {
      path.addEventListener('click', () => {
        // Remove active from all
        paths.forEach(p => p.classList.remove('active'));
        // Add to clicked
        path.classList.add('active');
        
        // Show/hide specific app dropdown depending on path
        if (index === 0) { // Customize existing
          whichWrap.style.display = 'block';
          // Set radio button manually behind the scenes if needed
          document.getElementById('proj-custom').checked = true;
        } else { // From scratch
          whichWrap.style.display = 'none';
          document.getElementById('proj-scratch').checked = true;
        }
      });
    });
  
    // Radio button custom stylings inside form
    const bgGroup = document.querySelectorAll('input[name="ai_interest"]');
    bgGroup.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const allOpts = radio.closest('.radio-group').querySelectorAll('.radio-opt');
        allOpts.forEach(opt => opt.classList.remove('selected'));
        if(e.target.checked) {
          e.target.closest('.radio-opt').classList.add('selected');
        }
      });
    });
  
    // Fake Form Submission (for demo)
    const mainForm = document.getElementById('consulting-form');
    if (mainForm) {
      mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation styling
        let isValid = true;
        const requiredFields = mainForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('err');
          } else {
            field.classList.remove('err');
          }
        });
  
        if (isValid) {
          const btn = mainForm.querySelector('button[type="submit"]');
          const originalText = btn.innerHTML;
          btn.innerHTML = `<span class="app-icon" style="width:20px;height:20px;margin:0;font-size:1rem;display:inline-block;animation:pulse 1s infinite">⚙️</span> <span data-i18n="form.sending">${i18n[currentLang]?.['form.sending'] || 'Enviando...'}</span>`;
          btn.style.opacity = '0.7';
          btn.disabled = true;
          
          // Simulate network req
          setTimeout(() => {
            mainForm.style.display = 'none';
            document.getElementById('form-success-msg').style.display = 'block';
          }, 1500);
        }
      });
  
      // Remove error outline on input
      mainForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('err'));
      });
    }
  
    // Waitlist Form Submission
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
      waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = waitlistForm.querySelector('input[type="email"]');
        if (input.value) {
          const btn = waitlistForm.querySelector('button');
          btn.disabled = true;
          input.disabled = true;
          waitlistForm.style.display = 'none';
          document.getElementById('waitlist-success').style.display = 'flex';
        }
      });
    }
  
    // Setup i18n
    const savedLang = localStorage.getItem('ingenia_lang') || 'es';
    applyTranslations(savedLang);
    
    // Bind Lang Toggles
    window.setLang = function(l) {
        toggleLang(l);
    }
  });
