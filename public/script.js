/**
 * Acko Consultancy — Landing page interactions & form submission.
 * Depends on config.js (CONFIG) loaded before this file.
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       0. Centralized configuration
    ========================================= */
    const initConfig = () => {
        if (typeof CONFIG === 'undefined') {
            console.warn('CONFIG not found. Load config.js before script.js.');
            return;
        }

        document.querySelectorAll('.dynamic-company-name').forEach((el) => {
            el.textContent = CONFIG.COMPANY_NAME;
        });

        document.querySelectorAll('.dynamic-email').forEach((el) => {
            el.textContent = CONFIG.EMAIL;
            const link = el.closest('a') || el.parentElement;
            if (link && link.tagName === 'A') {
                link.href = `mailto:${CONFIG.EMAIL}`;
            }
        });

        document.querySelectorAll('.dynamic-mobile').forEach((el) => {
            el.textContent = CONFIG.MOBILE;
            const link = el.closest('a') || el.parentElement;
            if (link && link.tagName === 'A') {
                link.href = `tel:${CONFIG.MOBILE.replace(/[^0-9+]/g, '')}`;
            }
        });

        const waDigits = CONFIG.MOBILE.replace(/[^0-9]/g, '');
        document.querySelectorAll('.dynamic-whatsapp-link').forEach((el) => {
            el.href = `https://wa.me/${waDigits}?text=${encodeURIComponent(
                `Hello ${CONFIG.COMPANY_NAME}, I am interested in joining your team.`
            )}`;
        });

        document.title = `${CONFIG.COMPANY_NAME} — Insurance Advisor Careers`;
    };

    initConfig();

    /* =========================================
       0b. Rotating motivational quotes
    ========================================= */
    const initQuotes = () => {
        const quotes = CONFIG?.QUOTES;
        if (!quotes?.length) return;

        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        const quoteDots = document.getElementById('quoteDots');
        if (!quoteText || !quoteAuthor) return;

        let current = 0;

        const renderQuote = (i) => {
            quoteText.classList.add('quote-fade-out');
            setTimeout(() => {
                quoteText.textContent = `"${quotes[i].text}"`;
                quoteAuthor.textContent = `— ${quotes[i].author}`;
                quoteText.classList.remove('quote-fade-out');
                quoteDots?.querySelectorAll('.quote-dot').forEach((d, idx) => {
                    d.classList.toggle('active', idx === i);
                });
            }, 300);
        };

        quotes.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = `quote-dot${i === 0 ? ' active' : ''}`;
            dot.addEventListener('click', () => {
                current = i;
                renderQuote(current);
            });
            quoteDots?.appendChild(dot);
        });

        renderQuote(0);
        setInterval(() => {
            current = (current + 1) % quotes.length;
            renderQuote(current);
        }, CONFIG.QUOTE_INTERVAL_MS || 6000);
    };

    initQuotes();

    /* =========================================
       1. Mobile menu
    ========================================= */
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuIcon && navLinks) {
        mobileMenuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuIcon.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    /* =========================================
       2. Sticky navbar
    ========================================= */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* =========================================
       3. Smooth scrolling
    ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === 'javascript:void(0)') return;

            e.preventDefault();
            navLinks?.classList.remove('active');
            const icon = mobileMenuIcon?.querySelector('i');
            if (icon?.classList.contains('fa-times')) {
                icon.classList.replace('fa-times', 'fa-bars');
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth',
                });
            }
        });
    });

    /* =========================================
       4. Scroll reveal
    ========================================= */
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const delay = entry.target.getAttribute('data-delay');
                const activate = () => entry.target.classList.add('active');
                delay ? setTimeout(activate, parseInt(delay, 10)) : activate();
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    /* =========================================
       5. Hero slider
    ========================================= */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        if (!slides.length) return;
        slides.forEach((s) => s.classList.remove('active'));
        dots.forEach((d) => d.classList.remove('active'));

        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide]?.classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);
    const startSlider = () => { slideInterval = setInterval(nextSlide, 5000); };
    const resetSlider = () => { clearInterval(slideInterval); startSlider(); };

    if (slides.length > 0) {
        nextBtn?.addEventListener('click', () => { nextSlide(); resetSlider(); });
        prevBtn?.addEventListener('click', () => { prevSlide(); resetSlider(); });
        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                showSlide(parseInt(e.target.getAttribute('data-index'), 10));
                resetSlider();
            });
        });
        startSlider();
    }

    /* =========================================
       6. Animated counters
    ========================================= */
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const updateCount = () => {
                const count = +counter.innerText.replace(/\D/g, '') || 0;
                const inc = Math.max(target / speed, 1);
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target >= 1000 ? `${target.toLocaleString()}+` : `${target}+`;
                }
            };
            updateCount();
        });
    };

    const countersSection = document.querySelector('.counters-section');
    if (countersSection) {
        const counterObserver = new IntersectionObserver(
            (entries, observer) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        counterObserver.observe(countersSection);
    }

    /* =========================================
       7. FAQ accordion
    ========================================= */
    document.querySelectorAll('.accordion-header').forEach((header) => {
        header.addEventListener('click', () => {
            const activeHeader = document.querySelector('.accordion-header.active');
            if (activeHeader && activeHeader !== header) {
                activeHeader.classList.remove('active');
                activeHeader.nextElementSibling.style.maxHeight = null;
            }
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            content.style.maxHeight = header.classList.contains('active')
                ? `${content.scrollHeight}px`
                : null;
        });
    });

    /* =========================================
       8. Modal (opens on button click only)
    ========================================= */
    const modal = document.getElementById('registrationModal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.close-modal');

    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtns.forEach((btn) => btn.addEventListener('click', openModal));
    closeBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    /* =========================================
       9. Inline field validation UI
    ========================================= */
    document.querySelectorAll('.input-group input, .input-group select').forEach((element) => {
        const validateGroup = (target) => {
            const inputGroup = target.closest('.input-group');
            const ok = target.tagName === 'SELECT'
                ? target.value !== ''
                : target.checkValidity() && (target.id !== 'whatsappNumber' || target.value.length === 10);
            inputGroup.classList.toggle('valid', ok);
            inputGroup.classList.toggle('invalid', !ok && target.value.length > 0);
        };

        element.addEventListener('input', (e) => validateGroup(e.target));
        if (element.tagName === 'SELECT') {
            element.addEventListener('change', (e) => validateGroup(e.target));
        }
    });

    const whatsappInput = document.getElementById('whatsappNumber');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
            const inputGroup = e.target.closest('.input-group');
            const ok = e.target.value.length === 10;
            inputGroup.classList.toggle('valid', ok);
            inputGroup.classList.toggle('invalid', !ok && e.target.value.length > 0);
        });
    }

    /* =========================================
       10. Form submission (fetch → FastAPI)
    ========================================= */
    const recruitmentForm = document.getElementById('recruitmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const loader = submitBtn?.querySelector('.loader');

    const submitOverlay = document.getElementById('submitOverlay');
    const statusPopup = document.getElementById('statusPopup');
    const popupIcon = statusPopup?.querySelector('.popup-icon i');
    const popupMessage = statusPopup?.querySelector('.popup-message');
    const popupSubtext = statusPopup?.querySelector('.popup-subtext');
    const popupCloseBtn = statusPopup?.querySelector('.popup-close-btn');

    const setSubmitOverlay = (visible) => {
        if (!submitOverlay) return;
        submitOverlay.classList.toggle('active', visible);
        submitOverlay.setAttribute('aria-hidden', visible ? 'false' : 'true');
    };

    const showPopup = (type, message, subtext = '') => {
        statusPopup.className = `status-popup active ${type}`;
        statusPopup.setAttribute('aria-hidden', 'false');
        popupMessage.textContent = message;
        if (popupSubtext) popupSubtext.textContent = subtext;
        popupIcon.className = type === 'success'
            ? 'fa-solid fa-check-circle'
            : 'fa-solid fa-circle-exclamation';
    };

    const closePopup = () => {
        statusPopup.classList.remove('active', 'success', 'error');
        statusPopup.setAttribute('aria-hidden', 'true');
    };

    popupCloseBtn?.addEventListener('click', closePopup);
    statusPopup?.addEventListener('click', (e) => {
        if (e.target === statusPopup) closePopup();
    });

    const validateForm = () => {
        const inputs = recruitmentForm.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach((input) => {
            const group = input.closest('.input-group');
            if (!input.checkValidity()) {
                isValid = false;
                group.classList.add('invalid');
                group.classList.remove('valid');
                input.reportValidity();
            } else {
                group.classList.remove('invalid');
                group.classList.add('valid');
            }
        });

        if (whatsappInput && whatsappInput.value.length !== 10) {
            isValid = false;
            whatsappInput.closest('.input-group').classList.add('invalid');
        }
        return isValid;
    };

    const setLoading = (loading) => {
        submitBtn.disabled = loading;
        submitBtn.classList.toggle('is-loading', loading);
        if (btnText) btnText.style.visibility = loading ? 'hidden' : 'visible';
        if (loader) loader.style.display = loading ? 'block' : 'none';
    };

    recruitmentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData(recruitmentForm);
        const payload = Object.fromEntries(formData.entries());
        payload.age = parseInt(payload.age, 10);

        const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL)
            ? CONFIG.API_URL
            : '/api/submit';

        setLoading(true);
        setSubmitOverlay(true);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}`);
            }

            closeModal();
            showPopup(
                'success',
                'Data Submitted Successfully',
                'Our team will contact you shortly. Thank you!'
            );
            recruitmentForm.reset();
            document.querySelectorAll('.input-group').forEach((el) => {
                el.classList.remove('valid', 'invalid');
            });
        } catch (err) {
            console.error('Submission failed:', err);
            closeModal();
            showPopup(
                'error',
                'Failed To Upload Data',
                'Please check your connection and try again.'
            );
        } finally {
            setLoading(false);
            setSubmitOverlay(false);
        }
    });

    /* =========================================
       11. Password-protected report downloads
    ========================================= */
    const downloadModal = document.getElementById('downloadModal');
    const openDownloadBtn = document.getElementById('openDownloadModal');
    const closeDownloadBtn = document.querySelector('.close-download-modal');
    const downloadForm = document.getElementById('downloadPasswordForm');
    const downloadPasswordInput = document.getElementById('downloadPassword');
    const downloadErrorMsg = document.getElementById('downloadErrorMsg');
    const downloadSubmitBtn = document.getElementById('downloadSubmitBtn');
    const downloadBtnText = downloadSubmitBtn?.querySelector('.btn-text');
    const downloadLoader = downloadSubmitBtn?.querySelector('.loader');
    const togglePasswordBtn = document.getElementById('toggleDownloadPassword');

    const openDownloadModal = (e) => {
        e?.preventDefault();
        downloadModal?.classList.add('active');
        downloadModal?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (downloadErrorMsg) downloadErrorMsg.textContent = '';
        downloadPasswordInput?.focus();
    };

    const closeDownloadModalFn = () => {
        downloadModal?.classList.remove('active');
        downloadModal?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        downloadForm?.reset();
        if (downloadErrorMsg) downloadErrorMsg.textContent = '';
    };

    openDownloadBtn?.addEventListener('click', openDownloadModal);
    closeDownloadBtn?.addEventListener('click', closeDownloadModalFn);
    downloadModal?.addEventListener('click', (e) => {
        if (e.target === downloadModal) closeDownloadModalFn();
    });

    togglePasswordBtn?.addEventListener('click', () => {
        const input = downloadPasswordInput;
        const icon = togglePasswordBtn.querySelector('i');
        if (!input || !icon) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.toggle('fa-eye', isPassword);
        icon.classList.toggle('fa-eye-slash', !isPassword);
    });

    const setDownloadLoading = (loading) => {
        if (!downloadSubmitBtn) return;
        downloadSubmitBtn.disabled = loading;
        downloadSubmitBtn.classList.toggle('is-loading', loading);
        if (downloadBtnText) downloadBtnText.style.visibility = loading ? 'hidden' : 'visible';
        if (downloadLoader) downloadLoader.style.display = loading ? 'block' : 'none';
    };

    const getFilenameFromResponse = (response, fallback) => {
        const disposition = response.headers.get('Content-Disposition') || '';
        const match = disposition.match(/filename="?([^";\n]+)"?/i);
        return match ? match[1].trim() : fallback;
    };

    downloadForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = downloadPasswordInput?.value?.trim();
        if (!password) return;

        if (downloadErrorMsg) downloadErrorMsg.textContent = '';
        setDownloadLoading(true);

        try {
            const generateUrl = CONFIG?.API_GENERATE_REPORTS_URL || '/api/reports/generate';

            const response = await fetch(generateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const msg = data.detail === 'Invalid Password' || response.status === 401
                    ? 'Invalid Password'
                    : (data.detail || 'Download failed');
                if (downloadErrorMsg) downloadErrorMsg.textContent = msg;
                showPopup('error', msg, 'Please try again with the correct password.');
                return;
            }

            const blob = await response.blob();
            const filename = getFilenameFromResponse(response, 'acko-web-reports.xlsx');
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);

            closeDownloadModalFn();
            showPopup(
                'success',
                'Reports Downloaded Successfully',
                'Complete lead report saved as Excel (acko-web date-time).'
            );
        } catch (err) {
            console.error('Download failed:', err);
            if (downloadErrorMsg) downloadErrorMsg.textContent = 'Download failed. Please try again.';
            showPopup('error', 'Download Failed', 'Could not download reports. Check your connection.');
        } finally {
            setDownloadLoading(false);
        }
    });
});
