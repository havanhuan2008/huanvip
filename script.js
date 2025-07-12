class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.connectionDistance = 120;

        this.init();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.init());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.3,
                color: Math.random() > 0.7 ? '#00bcd4' : (Math.random() > 0.5 ? '#4dd0e1' : '#26c6da'),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < -10) particle.x = this.canvas.width + 10;
            if (particle.x > this.canvas.width + 10) particle.x = -10;
            if (particle.y < -10) particle.y = this.canvas.height + 10;
            if (particle.y > this.canvas.height + 10) particle.y = -10;

            particle.opacity = Math.sin(Date.now() * 0.002 + particle.pulsePhase) * 0.3 + 0.5;

            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.connectionDistance) {
                        const opacity = (this.connectionDistance - distance) / this.connectionDistance * 0.15;
                        this.ctx.globalAlpha = opacity;
                        this.ctx.strokeStyle = particle.color;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                    }
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}
class ToggleSwitch {
    constructor(element) {
        this.element = element;
        this.isActive = false;
        this.featureItem = element.closest('.feature-item');
        this.init();
    }

    init() {
        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        this.element.addEventListener('mousedown', (e) => {
            this.createClickRipple(e);
        });
    }

    toggle() {
        this.isActive = !this.isActive;
        this.element.classList.toggle('active', this.isActive);
        if (this.featureItem) {
            this.featureItem.classList.toggle('active', this.isActive);
        }
        this.createToggleEffects();
        this.playToggleSound();
    }

    createToggleEffects() {
        this.createSparkleEffect();
        this.createGlowPulse();
        if (this.isActive) {
            this.createActivationFlash();
        }
    }

    createSparkleEffect() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = centerX + 'px';
            sparkle.style.top = centerY + 'px';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = i % 3 === 0 ? '#00bcd4' : (i % 3 === 1 ? '#4dd0e1' : '#26c6da');
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.boxShadow = `0 0 12px ${sparkle.style.background}`;

            document.body.appendChild(sparkle);

            const angle = (i / 12) * Math.PI * 2;
            const velocity = 40 + Math.random() * 30;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            sparkle.animate([{
                    transform: 'translate(0, 0) scale(1) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${vx}px, ${vy}px) scale(0) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: 600 + Math.random() * 200,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            };
        }
    }

    createGlowPulse() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const glowPulse = document.createElement('div');
        glowPulse.style.position = 'fixed';
        glowPulse.style.left = (centerX - 60) + 'px';
        glowPulse.style.top = (centerY - 60) + 'px';
        glowPulse.style.width = '120px';
        glowPulse.style.height = '120px';
        glowPulse.style.background = 'radial-gradient(circle, rgba(0, 188, 212, 0.6) 0%, transparent 70%)';
        glowPulse.style.borderRadius = '50%';
        glowPulse.style.pointerEvents = 'none';
        glowPulse.style.zIndex = '9998';

        document.body.appendChild(glowPulse);

        glowPulse.animate([
            { transform: 'scale(0)', opacity: 0.8 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            if (document.body.contains(glowPulse)) {
                document.body.removeChild(glowPulse);
            }
        };
    }

    createActivationFlash() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'radial-gradient(circle, rgba(0, 188, 212, 0.15) 0%, transparent 70%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9997';

        document.body.appendChild(flash);

        flash.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        }).onfinish = () => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        };
    }

    createClickRipple(e) {
        const rect = this.element.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height) * 1.5;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 188, 212, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = -size / 2 + 'px';
        ripple.style.marginTop = -size / 2 + 'px';
        ripple.style.pointerEvents = 'none';

        this.element.appendChild(ripple);

        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        };
    }

    playToggleSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(this.isActive ? 800 : 400, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
}
class Dropdown {
    constructor(element) {
        this.element = element;
        this.selected = element.querySelector('.dropdown-selected');
        this.type = element.getAttribute('data-dropdown');
        this.selectedValue = this.selected.querySelector('span').textContent;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.selected.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal();
        });
    }

    openModal() {
        this.createModal();
        this.playOpenSound();
    }

    createModal() {
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        const container = document.createElement('div');
        container.className = 'modal-container';
        const header = document.createElement('div');
        header.className = 'modal-header';

        const title = document.createElement('div');
        title.className = 'modal-title';
        title.textContent = this.type === 'mode' ? 'Chế Độ Gameplay' : 'Độ Phân Giải DPI';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => this.closeModal());

        header.appendChild(title);
        header.appendChild(closeBtn);
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'modal-options';

        const options = this.getOptions();
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'modal-option modal-option-enter';
            optionElement.setAttribute('data-value', option.value);
            optionElement.textContent = option.text;

            if (option.text === this.selectedValue) {
                optionElement.classList.add('selected');
            }

            optionElement.addEventListener('click', () => {
                this.selectOption(option.text, option.value);
            });
            setTimeout(() => {
                optionElement.classList.add('modal-option-enter-active');
                optionElement.classList.remove('modal-option-enter');
            }, index * 80);

            optionsContainer.appendChild(optionElement);
        });
        container.appendChild(header);
        container.appendChild(optionsContainer);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });
        document.addEventListener('keydown', this.handleModalKeyboard.bind(this));
    }

    getOptions() {
        if (this.type === 'mode') {
            return [
                { value: 'muot-ma', text: 'Mượt Mà' },
                { value: 'binh-thuong', text: 'Bình Thường' },
                { value: 'cao-cap', text: 'Cao Cấp' },
                { value: 'sieu-muot', text: 'Siêu Mượt' },
                { value: 'toi-uu', text: 'Tối Ưu' },
                { value: 'gaming-pro', text: 'Gaming Pro' }
            ];
        } else {
            return [
                { value: '0.5x', text: '0.5x - Thấp' },
                { value: '0.8x', text: '0.8x - Vừa Thấp' },
                { value: '1.0x', text: '1.0x - Tiêu Chuẩn' },
                { value: '1.2x', text: '1.2x - Cao' },
                { value: '1.5x', text: '1.5x - Rất Cao' },
                { value: '2.0x', text: '2.0x - Tối Đa' },
                { value: '2.5x', text: '2.5x - Siêu Cao' }
            ];
        }
    }

    selectOption(text, value) {
        this.selected.querySelector('span').textContent = text;
        this.selectedValue = text;
        this.createSelectionEffect();
        this.playSelectionSound();
        setTimeout(() => {
            this.closeModal();
        }, 300);
    }

    closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }, 400);
        }
        document.removeEventListener('keydown', this.handleModalKeyboard);
    }

    createSelectionEffect() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 70%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '10002';

        document.body.appendChild(flash);

        flash.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 300,
            easing: 'ease-in-out'
        }).onfinish = () => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        };
        this.selected.style.boxShadow = '0 0 25px rgba(0, 188, 212, 0.6)';
        setTimeout(() => {
            this.selected.style.boxShadow = '';
        }, 1000);
    }

    handleModalKeyboard(e) {
        const modal = document.querySelector('.modal-overlay.active');
        if (!modal) return;

        const options = modal.querySelectorAll('.modal-option');
        const selected = modal.querySelector('.modal-option.selected');
        let currentIndex = Array.from(options).indexOf(selected);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (selected) selected.classList.remove('selected');
                currentIndex = (currentIndex + 1) % options.length;
                options[currentIndex].classList.add('selected');
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (selected) selected.classList.remove('selected');
                currentIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                options[currentIndex].classList.add('selected');
                break;
            case 'Enter':
                e.preventDefault();
                if (selected) {
                    const text = selected.textContent;
                    const value = selected.getAttribute('data-value');
                    this.selectOption(text, value);
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.closeModal();
                break;
        }
    }

    playOpenSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    playSelectionSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();

            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator1.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(900, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.15);
            oscillator2.stop(audioContext.currentTime + 0.15);
        }
    }
}
class ActivateButton {
    constructor(element) {
        this.element = element;
        this.btnText = element.querySelector('.btn-text');
        this.btnGlow = element.querySelector('.btn-glow');
        this.btnRipple = element.querySelector('.btn-ripple');
        this.isActive = false;
        this.init();
    }

    init() {
        this.element.addEventListener('click', () => this.activate());
        this.element.addEventListener('mouseenter', () => this.handleHover());
        this.element.addEventListener('mouseleave', () => this.handleLeave());
    }

    activate() {
        this.isActive = !this.isActive;

        if (this.isActive) {
            this.btnText.textContent = 'LUX SENSI ĐANG HOẠT ĐỘNG';
            this.element.classList.add('activated');
            this.createActivationEffects();
        } else {
            this.btnText.textContent = 'LUX SENSI ACTIVE';
            this.element.classList.remove('activated');
        }

        this.createClickEffects();
        this.playActivationSound();
    }

    createActivationEffects() {
        this.createScreenFlash();

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createParticleBurst();
            }, i * 200);
        }
        this.createGlowWave();
    }

    createScreenFlash() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'radial-gradient(circle at center, rgba(0, 188, 212, 0.3) 0%, transparent 70%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9999';

        document.body.appendChild(flash);

        flash.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-in-out'
        }).onfinish = () => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        };
    }

    createParticleBurst() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';

            const colors = ['#00bcd4', '#4dd0e1', '#26c6da', '#80deea'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            particle.style.boxShadow = `0 0 15px ${particle.style.background}`;

            document.body.appendChild(particle);

            const angle = (i / 20) * Math.PI * 2;
            const velocity = 60 + Math.random() * 40;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            particle.animate([{
                    transform: 'translate(0, 0) scale(1) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${vx}px, ${vy}px) scale(0) rotate(720deg)`,
                    opacity: 0
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            };
        }
    }

    createGlowWave() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.style.position = 'fixed';
            wave.style.left = (centerX - 100) + 'px';
            wave.style.top = (centerY - 100) + 'px';
            wave.style.width = '200px';
            wave.style.height = '200px';
            wave.style.border = '2px solid rgba(0, 188, 212, 0.6)';
            wave.style.borderRadius = '50%';
            wave.style.pointerEvents = 'none';
            wave.style.zIndex = '9999';

            document.body.appendChild(wave);

            setTimeout(() => {
                wave.animate([
                    { transform: 'scale(0)', opacity: 0.8 },
                    { transform: 'scale(2)', opacity: 0 }
                ], {
                    duration: 1500,
                    easing: 'ease-out'
                }).onfinish = () => {
                    if (document.body.contains(wave)) {
                        document.body.removeChild(wave);
                    }
                };
            }, i * 300);
        }
    }

    createClickEffects() {
        this.btnRipple.style.left = '-100%';
        this.btnRipple.style.transition = 'none';

        setTimeout(() => {
            this.btnRipple.style.transition = 'left 0.8s ease';
            this.btnRipple.style.left = '100%';
        }, 50);
        this.element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.element.style.transform = '';
        }, 100);
    }

    handleHover() {
        if (!this.isActive) {
            this.createHoverEffect();
        }
    }

    createHoverEffect() {
        const rect = this.element.getBoundingClientRect();

        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            sparkle.style.width = '3px';
            sparkle.style.height = '3px';
            sparkle.style.background = '#00bcd4';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10000';
            sparkle.style.boxShadow = '0 0 8px #00bcd4';

            document.body.appendChild(sparkle);

            sparkle.animate([
                { opacity: 0, transform: 'scale(0)' },
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0)' }
            ], {
                duration: 1000,
                easing: 'ease-in-out'
            }).onfinish = () => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            };
        }
    }

    handleLeave() {

    }

    playActivationSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (this.isActive) {
                oscillator1.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator1.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator2.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
            } else {
                oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator1.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
                oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
                oscillator2.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
            }

            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.3);
            oscillator2.stop(audioContext.currentTime + 0.3);
        }
    }
}

class LuxuryConfigApp {
    constructor() {
        this.init();
    }

    init() {

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {

        this.initializeClock();
        this.particleSystem = new ParticleSystem();
        this.toggleSwitches = [];
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            this.toggleSwitches.push(new ToggleSwitch(toggle));
        });
        this.dropdowns = [];
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            this.dropdowns.push(new Dropdown(dropdown));
        });

        const activateBtn = document.getElementById('activateBtn');
        if (activateBtn) {
            this.activateButton = new ActivateButton(activateBtn);
        }

        this.addEntranceAnimations();

        this.addCursorEffects();
        this.startAmbientEffects();
    }

    initializeClock() {
        const timeElement = document.querySelector('.time');

        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        };
        updateTime();
        setInterval(updateTime, 60000);

        setInterval(() => {
            updateTime();
            timeElement.style.textShadow = '0 0 15px rgba(0, 188, 212, 0.8)';
            setTimeout(() => {
                timeElement.style.textShadow = '0 0 8px rgba(0, 188, 212, 0.5)';
            }, 300);
        }, 60000);
    }

    addEntranceAnimations() {
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(40px) scale(0.95)';

            setTimeout(() => {
                item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, index * 150 + 300);
        });
        const title = document.querySelector('.app-title');
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'scale(0.8) translateY(-20px)';

            setTimeout(() => {
                title.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.opacity = '1';
                title.style.transform = 'scale(1) translateY(0)';
            }, 100);
        }
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';

            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    }

    addCursorEffects() {
        let cursorTrail = [];
        const maxTrailLength = 10;

        document.addEventListener('mousemove', (e) => {
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.width = '3px';
            trail.style.height = '3px';
            trail.style.background = 'rgba(0, 188, 212, 0.6)';
            trail.style.borderRadius = '50%';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '10001';
            trail.style.boxShadow = '0 0 8px rgba(0, 188, 212, 0.4)';

            document.body.appendChild(trail);
            cursorTrail.push(trail);
            if (cursorTrail.length > maxTrailLength) {
                const oldTrail = cursorTrail.shift();
                if (document.body.contains(oldTrail)) {
                    document.body.removeChild(oldTrail);
                }
            }

            trail.animate([
                { opacity: 0.6, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0)' }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => {
                if (document.body.contains(trail)) {
                    document.body.removeChild(trail);
                }
            };
        });
    }

    startAmbientEffects() {
        setInterval(() => {
            const sectionIcons = document.querySelectorAll('.section-icon');
            sectionIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.style.boxShadow = '0 0 25px rgba(0, 188, 212, 0.8)';
                    setTimeout(() => {
                        icon.style.boxShadow = '0 0 15px rgba(0, 188, 212, 0.6)';
                    }, 500);
                }, index * 200);
            });
        }, 5000);

        const title = document.querySelector('.app-title');
        if (title) {
            setInterval(() => {
                title.style.textShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
                setTimeout(() => {
                    title.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.4)';
                }, 1000);
            }, 3000);
        }
    }
}

new LuxuryConfigApp();