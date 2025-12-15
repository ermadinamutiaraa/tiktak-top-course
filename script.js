document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== GOOGLE SHEETS CONFIG ====================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwM77ruQ0maSviqCaffOiWqSje7105u67JOuDotYMQHu7rKHm5GviVafUErTFHfxMaA/exec";
    
    // ==================== MOBILE MENU TOGGLE ====================
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
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim ke Google Sheets...';
                submitBtn.disabled = true;
                
                // Prepare data for Google Sheets
                const programText = document.getElementById('anggotaProgram').options[document.getElementById('anggotaProgram').selectedIndex].text;
                const submissionData = {
                    nama: data.nama.trim(),
                    program: programText,
                    nik: nikValidation.nik,
                    alamat: data.alamat.trim(),
                    whatsapp: formatPhoneNumber(phoneValidation.phone)
                };
                
                console.log('📤 Sending to Google Sheets:', submissionData);
                
                try {
                    // Send to Google Sheets via Apps Script
                 const payload = new URLSearchParams();
payload.append("nama", submissionData.nama);
payload.append("program", submissionData.program);
payload.append("nik", submissionData.nik);
payload.append("alamat", submissionData.alamat);
payload.append("whatsapp", submissionData.whatsapp);

const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: payload.toString()
});


                    
                    console.log('📥 Response status:', response.status);
                    
                    let result;
                    try {
                        result = await response.json();
                    } catch {
                        result = { success: true }; // Jika response bukan JSON
                    }
                    
                    if (result && (result.success || result.status === "success")) {
                        // SUCCESS
                        const memberId = 'TTTC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                        
                        showResponseMessage(
                            `✅ <strong>Pendaftaran Berhasil!</strong><br>
                            Selamat <strong>${data.nama}</strong>, Anda telah terdaftar sebagai anggota Tik Tak Top Course.<br>
                            <strong>ID Anggota:</strong> ${memberId}<br>
                            <strong>Kelas:</strong> ${programText}<br><br>
                            Data telah disimpan ke Google Sheets. Konfirmasi akan dikirim ke WhatsApp ${data.whatsapp} dalam 1x24 jam.`,
                            'success'
                        );
                        
                        // Log to console
                        console.log('✅ Data saved to Google Sheets:', {
                            memberId: memberId,
                            ...submissionData,
                            timestamp: new Date().toISOString()
                        });
                        
                    } else {
                        // ERROR from server
                        showResponseMessage(
                            `❌ <strong>Gagal menyimpan data.</strong><br>
                            Error: ${result.error || 'Unknown error'}<br>
                            Silakan coba lagi atau hubungi admin.`,
                            'error'
                        );
                    }
                    
                } catch (error) {
                    // Network error
                    console.error('🌐 Network error:', error);
                    
                    // Fallback: Save to localStorage
                    const memberId = 'TTTC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                    const backupData = {
                        memberId: memberId,
                        nama: data.nama.trim(),
                        program: programText,
                        nik: nikValidation.nik,
                        alamat: data.alamat.trim(),
                        whatsapp: formatPhoneNumber(phoneValidation.phone),
                        timestamp: new Date().toISOString(),
                        error: error.message
                    };
                    
                    // Save to localStorage
                    try {
                        const existing = JSON.parse(localStorage.getItem('tiktaktop_backup') || '[]');
                        existing.push(backupData);
                        localStorage.setItem('tiktaktop_backup', JSON.stringify(existing));
                    } catch (e) {
                        console.log('LocalStorage error:', e);
                    }
                    
                    showResponseMessage(
                        `⚠️ <strong>Data disimpan sementara.</strong><br>
                        Koneksi bermasalah, tetapi data sudah disimpan lokal.<br>
                        <strong>ID Anggota:</strong> ${memberId}<br>
                        Hubungi admin dengan ID tersebut untuk konfirmasi.`,
                        'warning'
                    );
                    
                    console.log('💾 Backup saved to localStorage:', backupData);
                }
                
                // Reset form setelah 3 detik
                setTimeout(() => {
                    registrationForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
        
        // Form input validation styling
        const formInputs = registrationForm.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                if (this.value.trim() !== '') {
                    this.classList.add('valid');
                } else {
                    this.classList.remove('valid');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.required && this.value.trim() === '') {
                    this.classList.add('error');
                }
            });
        });
        
        // Form reset handler
        registrationForm.addEventListener('reset', function() {
            showResponseMessage('Form telah direset. Silakan isi kembali data Anda.', 'info');
            formInputs.forEach(input => {
                input.classList.remove('error', 'valid');
            });
        });
    }
    
    // ==================== ANIMATED COUNTER FOR STATS ====================
    function animateCounter(element, target) {
        if (!element) return;
        
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / (target / increment)), 30);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
                const scale = 0.9 + (current / target) * 0.1;
                element.style.transform = `scale(${scale})`;
            }
        }, stepTime);
    }
    
    // Initialize counter animation when stats section is in view
    const statsContainer = document.getElementById('statsContainer');
    
    if (statsContainer) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statItems = statsContainer.querySelectorAll('.stat-item h3');
                    statItems.forEach((stat, index) => {
                        stat.style.opacity = '0.5';
                        stat.style.transform = 'scale(0.8)';
                        const target = parseInt(stat.getAttribute('data-count'));
                        setTimeout(() => {
                            animateCounter(stat, target);
                        }, index * 200);
                    });
                    statsObserver.disconnect();
                }
            });
        }, observerOptions);
        
        statsObserver.observe(statsContainer);
    }
    
    // ==================== GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.getElementById('lightboxClose');
    
    let currentGalleryIndex = 0;
    const galleryImages = Array.from(galleryItems);
    
    function openLightbox(item, index) {
        if (!lightboxModal || !lightboxImage || !lightboxTitle || !lightboxDescription) return;
        
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        lightboxImage.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxImage.alt = title;
        
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        currentGalleryIndex = index;
        
        setTimeout(() => {
            lightboxClose?.focus();
        }, 100);
    }
    
    function closeLightbox() {
        if (!lightboxModal) return;
        
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        // Return focus to the gallery item that was clicked
        if (galleryItems[currentGalleryIndex]) {
            galleryItems[currentGalleryIndex].focus();
        }
    }
    
    // Initialize gallery
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentGalleryIndex = index;
            openLightbox(this, index);
        });
        
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentGalleryIndex = index;
                openLightbox(this, index);
            }
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightboxModal?.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            if (e.key === 'ArrowRight') {
                currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
                openLightbox(galleryImages[currentGalleryIndex], currentGalleryIndex);
            }
            if (e.key === 'ArrowLeft') {
                currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
                openLightbox(galleryImages[currentGalleryIndex], currentGalleryIndex);
            }
        }
    });
    
    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const yOffset = -80;
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== NAVBAR BACKGROUND ON SCROLL ====================
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background based on scroll
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'var(--shadow)';
            }
            
            // Hide/show navbar on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Update active nav link
            updateActiveNavLink();
        });
    }
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Untuk dropdown Kelas
            if (href === '#kelas' && (
                current === 'kelas' || 
                current === 'kelas-web' || 
                current === 'kelas-programming' || 
                current === 'kelas-office' || 
                current === 'kelas-desain' || 
                current === 'kelas-jaringan'
            )) {
                link.classList.add('active');
            }
            // Untuk dropdown Layanan
            else if (href === '#layanan' && (current === 'register' || current === 'layanan')) {
                link.classList.add('active');
            }
            // Untuk link langsung
            else if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ==================== BACK TO TOP BUTTON ====================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // ==================== MOBILE DROPDOWN TOGGLE ====================
    document.querySelectorAll('.dropdown > .nav-link').forEach(dropdownLink => {
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.parentElement;
                const dropdownContent = this.nextElementSibling;
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                dropdownContent.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
            }
        });
    });
    
    // ==================== INITIALIZE ANIMATIONS ====================
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements to animate
    document.querySelectorAll('.course-card, .achievement-card, .gallery-item, .service-card, .category-card').forEach(el => {
        animateOnScroll.observe(el);
    });
    
    // ==================== FORM CHAR COUNTER ====================
    const alamatTextarea = document.getElementById('anggotaAlamat');
    if (alamatTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.textContent = '0/500 karakter';
        alamatTextarea.parentNode.appendChild(charCounter);
        
        alamatTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length}/500 karakter`;
            
            if (length > 450) {
                charCounter.classList.add('warning');
            } else {
                charCounter.classList.remove('warning');
            }
            
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCounter.textContent = '500/500 karakter (maksimum)';
            }
        });
    }
    
    console.log('All scripts initialized successfully');
});