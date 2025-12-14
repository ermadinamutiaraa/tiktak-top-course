document.addEventListener('DOMContentLoaded', function() {
    console.log('Tik Tak Top Course Script Loaded');
    
    // ==================== GOOGLE SHEETS CONFIGURATION ====================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUl2rOuIex_NcNdxicBid9BBKTxq3QWJCxDFUAp_tP1KVdXzdwgbXg932PJ8Qqj-Vq/exec";
    
    // ==================== MOBILE MENU TOGGLE ====================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // ==================== COURSE SELECTION NOTIFICATION ====================
    const courseNotification = document.getElementById('courseNotification');
    const closeNotification = document.getElementById('closeNotification');
    
    if (courseNotification && closeNotification) {
        let notificationShown = sessionStorage.getItem('notificationShown');
        
        if (!notificationShown) {
            setTimeout(() => {
                courseNotification.style.display = 'block';
                courseNotification.setAttribute('aria-hidden', 'false');
                sessionStorage.setItem('notificationShown', 'true');
            }, 3000);
        }
        
        closeNotification.addEventListener('click', () => {
            courseNotification.style.display = 'none';
            courseNotification.setAttribute('aria-hidden', 'true');
        });
        
        courseNotification.addEventListener('click', (e) => {
            if (e.target === courseNotification) {
                courseNotification.style.display = 'none';
                courseNotification.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    // ==================== COURSE TAGS SELECTION ====================
    document.querySelectorAll('.course-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const course = this.getAttribute('data-course');
            
            // Highlight selected tag
            document.querySelectorAll('.course-tag').forEach(t => {
                t.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Scroll to registration section
            setTimeout(() => {
                const registerSection = document.getElementById('register');
                if (registerSection) {
                    registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
    
    // ==================== KELAS BUTTON SELECTION ====================
    document.querySelectorAll('.course-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseName = this.getAttribute('data-course-name');
            const coursePrice = this.getAttribute('data-price');
            const courseId = this.getAttribute('data-course');
            
            // Auto-fill program selection in registration form
            const programSelect = document.getElementById('anggotaProgram');
            if (programSelect) {
                // Cari option yang sesuai
                const optionToSelect = Array.from(programSelect.options).find(option => 
                    option.text.includes(courseName) || 
                    option.value.includes(courseId)
                );
                
                if (optionToSelect) {
                    optionToSelect.selected = true;
                }
            }
            
            // Show confirmation
            showResponseMessage(
                `🎉 Kelas <strong>"${courseName}"</strong> telah dipilih!<br>
                Harga: <strong>${coursePrice}</strong><br>
                Silakan lanjutkan pendaftaran di bawah.`,
                'success'
            );
            
            // Scroll to registration form
            setTimeout(() => {
                const registerSection = document.getElementById('register');
                if (registerSection) {
                    registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
    
    // ==================== FORM RESPONSE MESSAGE ====================
    function showResponseMessage(message, type) {
        const responseMessage = document.getElementById('responseMessage');
        if (responseMessage) {
            responseMessage.innerHTML = message;
            responseMessage.className = `response-message ${type}`;
            responseMessage.style.display = 'block';
            responseMessage.setAttribute('role', 'alert');
            
            // Auto hide after 7 seconds (kecuali success)
            if (type !== 'success') {
                setTimeout(() => {
                    if (responseMessage.style.display === 'block') {
                        responseMessage.style.display = 'none';
                    }
                }, 7000);
            }
        }
    }
    
    // ==================== FORM VALIDATION FUNCTIONS ====================
    
    // Validasi NIK
    function validateNIK(nik) {
        const cleanNIK = nik.replace(/\D/g, '');
        
        if (cleanNIK.length === 0) {
            return { valid: false, message: 'NIK tidak boleh kosong' };
        }
        
        if (cleanNIK.length < 5) {
            return { valid: false, message: 'Nomor induk siswa minimal 5 digit' };
        }
        
        if (cleanNIK.length === 16 && !/^\d+$/.test(cleanNIK)) {
            return { valid: false, message: 'NIK harus 16 digit angka' };
        }
        
        return { valid: true, nik: cleanNIK };
    }
    
    // Validasi Nomor WhatsApp
    function validateWhatsApp(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.length === 0) {
            return { valid: false, message: 'Nomor WhatsApp tidak boleh kosong' };
        }
        
        if (cleanPhone.length < 10 || cleanPhone.length > 14) {
            return { valid: false, message: 'Nomor WhatsApp harus 10-14 digit' };
        }
        
        return { valid: true, phone: cleanPhone };
    }
    
    // Format nomor telepon untuk WhatsApp
    function formatPhoneNumber(phone) {
        const clean = phone.replace(/\D/g, '');
        
        if (clean.startsWith('0')) {
            return '62' + clean.substring(1);
        }
        
        if (clean.startsWith('62')) {
            return clean;
        }
        
        if (clean.startsWith('8')) {
            return '62' + clean;
        }
        
        return clean;
    }
    
    // ==================== GOOGLE SHEETS FORM SUBMISSION ====================
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
                el.classList.remove('error');
            });
            
            // Get form values
            const formData = new FormData(this);
            const data = {
                nama: formData.get('anggotaNama').trim(),
                program: formData.get('anggotaProgram'),
                nik: formData.get('anggotaNIK'),
                alamat: formData.get('anggotaAlamat').trim(),
                whatsapp: formData.get('anggotaWhatsApp'),
                terms: document.getElementById('anggotaTerms')?.checked || false
            };
            
            // Validate form
            const errors = [];
            
            if (!data.nama) {
                errors.push('Nama lengkap harus diisi');
                document.getElementById('anggotaNama').classList.add('error');
            } else if (data.nama.length < 3) {
                errors.push('Nama minimal 3 karakter');
                document.getElementById('anggotaNama').classList.add('error');
            }
            
            if (!data.program) {
                errors.push('Program kelas harus dipilih');
                document.getElementById('anggotaProgram').classList.add('error');
            }
            
            const nikValidation = validateNIK(data.nik);
            if (!nikValidation.valid) {
                errors.push(nikValidation.message);
                document.getElementById('anggotaNIK').classList.add('error');
            }
            
            if (!data.alamat) {
                errors.push('Alamat lengkap harus diisi');
                document.getElementById('anggotaAlamat').classList.add('error');
            } else if (data.alamat.length < 10) {
                errors.push('Alamat terlalu pendek, minimal 10 karakter');
                document.getElementById('anggotaAlamat').classList.add('error');
            }
            
            const phoneValidation = validateWhatsApp(data.whatsapp);
            if (!phoneValidation.valid) {
                errors.push(phoneValidation.message);
                document.getElementById('anggotaWhatsApp').classList.add('error');
            }
            
            if (!data.terms) {
                errors.push('Anda harus menyetujui syarat dan ketentuan');
            }
            
            if (errors.length > 0) {
                showResponseMessage(
                    `<strong>Perbaiki data berikut:</strong><br>• ${errors.join('<br>• ')}`,
                    'error'
                );
                
                // Scroll to first error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const resetBtn = this.querySelector('.reset-btn');
            let originalBtnText = '';
            
            if (submitBtn) {
                originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim ke Server...';
                submitBtn.disabled = true;
                if (resetBtn) resetBtn.disabled = true;
            }
            
            // Prepare data for Google Sheets
            const submissionData = {
                nama: data.nama,
                program: document.getElementById('anggotaProgram').options[document.getElementById('anggotaProgram').selectedIndex].text,
                program_code: data.program,
                nik: nikValidation.nik,
                alamat: data.alamat,
                whatsapp: formatPhoneNumber(phoneValidation.phone),
                timestamp: new Date().toLocaleString('id-ID')
            };
            
            console.log('📤 Data yang dikirim ke Google Sheets:', submissionData);
            
            try {
                // Kirim data ke Google Apps Script
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData)
                });
                
                console.log('📥 Response status:', response.status);
                
                // Handle response
                if (response.ok) {
                    try {
                        const result = await response.json();
                        
                        if (result && result.success) {
                            // SUCCESS - Data saved to Google Sheets
                            const memberId = generateMemberId();
                            
                            showResponseMessage(
                                `✅ <strong>Pendaftaran Berhasil!</strong><br>
                                Selamat <strong>${data.nama}</strong>, Anda telah terdaftar sebagai anggota Tik Tak Top Course.<br>
                                <strong>ID Anggota:</strong> ${memberId}<br>
                                <strong>Kelas:</strong> ${submissionData.program}<br>
                                <strong>Timestamp:</strong> ${submissionData.timestamp}<br><br>
                                Konfirmasi pendaftaran akan dikirim ke WhatsApp Anda dalam 1x24 jam.`,
                                'success'
                            );
                            
                            // Simpan ke localStorage sebagai backup
                            saveToLocalStorage({
                                ...submissionData,
                                memberId: memberId,
                                localSaveTime: new Date().toISOString()
                            });
                            
                            // Reset form setelah 3 detik
                            setTimeout(() => {
                                registrationForm.reset();
                                
                                // Tampilkan tombol WhatsApp
                                showWhatsAppButton(submissionData, memberId);
                                
                                // Reset button state
                                if (submitBtn) {
                                    submitBtn.innerHTML = originalBtnText;
                                    submitBtn.disabled = false;
                                    if (resetBtn) resetBtn.disabled = false;
                                }
                            }, 3000);
                            
                        } else {
                            // ERROR dari server
                            throw new Error(result.error || 'Unknown server error');
                        }
                    } catch (jsonError) {
                        // Jika response bukan JSON (CORS issue), anggap sukses
                        console.log('⚠️ Response bukan JSON, data mungkin sudah terkirim');
                        
                        const memberId = generateMemberId();
                        showResponseMessage(
                            `✅ <strong>Pendaftaran Diterima!</strong><br>
                            Data Anda telah dikirim. ID: ${memberId}<br>
                            Jika tidak ada konfirmasi dalam 24 jam, hubungi admin.`,
                            'success'
                        );
                        
                        saveToLocalStorage({
                            ...submissionData,
                            memberId: memberId,
                            localSaveTime: new Date().toISOString()
                        });
                        
                        setTimeout(() => {
                            registrationForm.reset();
                            if (submitBtn) {
                                submitBtn.innerHTML = originalBtnText;
                                submitBtn.disabled = false;
                                if (resetBtn) resetBtn.disabled = false;
                            }
                        }, 3000);
                    }
                } else {
                    // Network error
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
            } catch (error) {
                // Network error atau CORS error
                console.error('🌐 Error submitting form:', error);
                
                // Simpan ke localStorage sebagai fallback
                const memberId = generateMemberId();
                saveToLocalStorage({
                    ...submissionData,
                    memberId: memberId,
                    localSaveTime: new Date().toISOString(),
                    error: error.message
                });
                
                showResponseMessage(
                    `⚠️ <strong>Data disimpan sementara.</strong><br>
                    Koneksi bermasalah, tetapi data sudah disimpan lokal.<br>
                    <strong>ID Anggota:</strong> ${memberId}<br>
                    Silakan hubungi admin dengan ID tersebut untuk konfirmasi manual.`,
                    'warning'
                );
                
                // Reset button state
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    if (resetBtn) resetBtn.disabled = false;
                }
                
                // Reset form setelah 5 detik
                setTimeout(() => {
                    registrationForm.reset();
                }, 5000);
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
        
        // Form char counter for alamat
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
    }
    
    // ==================== HELPER FUNCTIONS ====================
    
    // Generate Member ID
    function generateMemberId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `TTTC-${timestamp}-${random}`.toUpperCase();
    }
    
    // Save to localStorage as backup
    function saveToLocalStorage(data) {
        try {
            const registrations = JSON.parse(localStorage.getItem('tiktaktop_registrations') || '[]');
            registrations.push(data);
            localStorage.setItem('tiktaktop_registrations', JSON.stringify(registrations));
            console.log('💾 Data saved to localStorage:', data);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    // Show WhatsApp button after successful registration
    function showWhatsAppButton(data, memberId) {
        const formContainer = document.querySelector('.form-section');
        if (!formContainer) return;
        
        // Remove existing button if any
        const existingButton = document.getElementById('whatsappButton');
        if (existingButton) {
            existingButton.remove();
        }
        
        const existingInfo = document.getElementById('whatsappInfo');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Create WhatsApp message
        const message = `Halo, saya ${data.nama}.\n\nSaya sudah mendaftar sebagai anggota TikTakTop Course:\n• ID Anggota: ${memberId}\n• Program: ${data.program}\n• WhatsApp: ${data.whatsapp}\n\nMohon info langkah selanjutnya.`;
        const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
        
        // Create info text
        const info = document.createElement('p');
        info.id = 'whatsappInfo';
        info.style.marginTop = '20px';
        info.style.marginBottom = '10px';
        info.style.fontSize = '14px';
        info.style.color = '#28a745';
        info.innerHTML = '✅ <strong>Pendaftaran berhasil!</strong> Klik tombol di bawah untuk konfirmasi via WhatsApp:';
        
        // Create WhatsApp button
        const button = document.createElement('a');
        button.id = 'whatsappButton';
        button.href = whatsappUrl;
        button.target = '_blank';
        button.className = 'whatsapp-button';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.gap = '10px';
        button.style.backgroundColor = '#25D366';
        button.style.color = 'white';
        button.style.padding = '12px 24px';
        button.style.borderRadius = '50px';
        button.style.textDecoration = 'none';
        button.style.fontWeight = '500';
        button.style.marginTop = '10px';
        button.style.transition = 'all 0.3s';
        button.innerHTML = `
            <i class="fab fa-whatsapp"></i>
            <span>Konfirmasi via WhatsApp</span>
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#128C7E';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 5px 15px rgba(37, 211, 102, 0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#25D366';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        
        // Append to form
        formContainer.appendChild(info);
        formContainer.appendChild(button);
    }
    
    // ==================== TEST GOOGLE SHEETS CONNECTION ====================
    async function testGoogleSheetsConnection() {
        try {
            console.log('🔗 Testing Google Sheets connection...');
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=test`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Google Sheets API Connected:', data);
                return true;
            } else {
                console.warn('⚠️ Google Sheets connection test failed');
                return false;
            }
        } catch (error) {
            console.warn('⚠️ Google Sheets connection test error:', error.message);
            return false;
        }
    }
    
    // Test connection on page load
    setTimeout(() => {
        testGoogleSheetsConnection();
    }, 1000);
    
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
    
    // ==================== ADMIN FUNCTIONS (DEV TOOLS) ====================
    // Hanya untuk development - bisa diakses via browser console
    window.tiktaktopAdmin = {
        // View localStorage registrations
        viewRegistrations: function() {
            const registrations = JSON.parse(localStorage.getItem('tiktaktop_registrations') || '[]');
            console.log('📋 Local Registrations:', registrations);
            return registrations;
        },
        
        // Export localStorage data as CSV
        exportLocalData: function() {
            const registrations = this.viewRegistrations();
            if (registrations.length === 0) {
                console.log('❌ No data in localStorage');
                return;
            }
            
            const headers = ['memberId', 'nama', 'program', 'nik', 'whatsapp', 'timestamp', 'localSaveTime'];
            const csvRows = [
                headers.join(','),
                ...registrations.map(r => headers.map(h => r[h] || '').join(','))
            ];
            
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `tiktaktop_backup_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('📤 CSV exported with', registrations.length, 'records');
        },
        
        // Clear localStorage
        clearLocalStorage: function() {
            localStorage.removeItem('tiktaktop_registrations');
            console.log('🗑️ localStorage cleared');
        },
        
        // Test Google Sheets connection
        testConnection: function() {
            return testGoogleSheetsConnection();
        },
        
        // Simulate form submission
        testSubmit: function() {
            const testData = {
                nama: "Test User",
                program: "Kelas Dasar Web Development",
                program_code: "web-dasar",
                nik: "1234567890123456",
                alamat: "Jl. Testing No. 123, Jakarta",
                whatsapp: "6281234567890",
                timestamp: new Date().toLocaleString('id-ID')
            };
            
            console.log('🧪 Test submission:', testData);
            
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            })
            .then(response => response.json())
            .then(data => console.log('✅ Test response:', data))
            .catch(error => console.error('❌ Test error:', error));
        }
    };
    
    console.log('All scripts initialized successfully');
    console.log('Google Sheets URL:', GOOGLE_SCRIPT_URL);
    console.log('Admin tools available: window.tiktaktopAdmin');
});