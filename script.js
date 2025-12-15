// Tik Tak Top Course - Optimized Script
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 1. MOBILE MENU ====================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // Close menu on link click (mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }
    
    // ==================== 2. NOTIFICATION ====================
    const courseNotification = document.getElementById('courseNotification');
    const closeNotification = document.getElementById('closeNotification');
    
    if (courseNotification && closeNotification) {
        // Show notification after 3 seconds
        setTimeout(() => {
            courseNotification.style.display = 'block';
        }, 3000);
        
        closeNotification.addEventListener('click', () => {
            courseNotification.style.display = 'none';
        });
    }
    
    // ==================== 3. COURSE TAGS ====================
    document.querySelectorAll('.course-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.course-tag').forEach(t => {
                t.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Scroll to registration after delay
            setTimeout(() => {
                const registerSection = document.getElementById('register');
                if (registerSection) {
                    registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
    
    // ==================== 4. COURSE BUTTONS ====================
    document.querySelectorAll('.course-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseName = this.getAttribute('data-course-name');
            
            // Auto-fill program in form
            const programSelect = document.getElementById('anggotaProgram');
            if (programSelect) {
                for (let option of programSelect.options) {
                    if (option.text.includes(courseName)) {
                        option.selected = true;
                        break;
                    }
                }
            }
            
            // Show message
            showMessage(`🎉 Kelas "${courseName}" telah dipilih! Silakan lanjutkan pendaftaran.`, 'success');
            
            // Scroll to registration
            setTimeout(() => {
                const registerSection = document.getElementById('register');
                if (registerSection) {
                    registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        });
    });
    
    // ==================== 5. FORM VALIDATION ====================
    const registrationForm = document.getElementById('registrationForm');
    
    function showMessage(message, type) {
        const responseMessage = document.getElementById('responseMessage');
        if (responseMessage) {
            responseMessage.innerHTML = `<strong>${message}</strong>`;
            responseMessage.className = `response-message ${type}`;
            responseMessage.style.display = 'block';
            
            // Auto hide
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = {
                nama: formData.get('anggotaNama'),
                program: formData.get('anggotaProgram'),
                nik: formData.get('anggotaNIK'),
                alamat: formData.get('anggotaAlamat'),
                whatsapp: formData.get('anggotaWhatsApp'),
                terms: document.getElementById('anggotaTerms')?.checked || false
            };
            
            // Validate
            const errors = [];
            
            if (!data.nama?.trim() || data.nama.length < 3) {
                errors.push('Nama lengkap minimal 3 karakter');
                document.getElementById('anggotaNama').classList.add('error');
            }
            
            if (!data.program) {
                errors.push('Pilih program kelas');
                document.getElementById('anggotaProgram').classList.add('error');
            }
            
            if (!data.nik?.trim() || data.nik.length < 5) {
                errors.push('NIK/NIS minimal 5 digit');
                document.getElementById('anggotaNIK').classList.add('error');
            }
            
            if (!data.alamat?.trim() || data.alamat.length < 10) {
                errors.push('Alamat terlalu pendek');
                document.getElementById('anggotaAlamat').classList.add('error');
            }
            
            if (!data.whatsapp?.trim() || data.whatsapp.length < 10) {
                errors.push('Nomor WhatsApp tidak valid');
                document.getElementById('anggotaWhatsApp').classList.add('error');
            }
            
            if (!data.terms) {
                errors.push('Setujui syarat dan ketentuan');
            }
            
            if (errors.length > 0) {
                showMessage(`Perbaiki: ${errors.join(', ')}`, 'error');
                return;
            }
            
            // Show loading
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate submission (demo)
            setTimeout(() => {
                // Success
                showMessage('✅ Pendaftaran berhasil! Data telah dikirim.', 'success');
                
                // Generate member ID
                const memberId = 'TTTC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                
                // Show success details
                setTimeout(() => {
                    showMessage(`✅ Pendaftaran berhasil!<br>ID Anggota: <strong>${memberId}</strong><br>Konfirmasi akan dikirim via WhatsApp.`, 'success');
                }, 100);
                
                // Reset form
                registrationForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            }, 2000);
        });
        
        // Remove error class on input
        registrationForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
    
    // ==================== 6. COUNTER ANIMATION ====================
    const statsContainer = document.getElementById('statsContainer');
    
    if (statsContainer) {
        // Simple counter animation
        const statItems = statsContainer.querySelectorAll('.stat-item h3');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statItems.forEach((stat, index) => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        let current = 0;
                        const increment = target / 50;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                stat.textContent = target.toLocaleString();
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(current).toLocaleString();
                            }
                        }, 30);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsContainer);
    }
    
    // ==================== 7. GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                const title = this.querySelector('h3').textContent;
                const description = this.querySelector('p').textContent;
                
                if (lightboxImage && lightboxTitle && lightboxDescription) {
                    lightboxImage.src = imgSrc;
                    lightboxTitle.textContent = title;
                    lightboxDescription.textContent = description;
                    
                    if (lightboxModal) {
                        lightboxModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        });
        
        if (lightboxClose && lightboxModal) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            lightboxModal.addEventListener('click', (e) => {
                if (e.target === lightboxModal) {
                    lightboxModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }
    
    // ==================== 8. SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== 9. NAVBAR SCROLL EFFECT ====================
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'var(--shadow)';
            }
            
            // Update active nav link
            updateActiveNav();
        });
    }
    
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ==================== 10. BACK TO TOP ====================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('show', window.scrollY > 300);
    });
    
    // ==================== 11. MOBILE DROPDOWN ====================
    document.querySelectorAll('.dropdown > .nav-link').forEach(dropdownLink => {
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.parentElement;
                dropdown.classList.toggle('active');
            }
        });
    });
    
    console.log('Tik Tak Top Course website loaded successfully! 🚀');
});