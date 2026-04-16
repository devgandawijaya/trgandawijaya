const header = document.querySelector('.site-header');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const menuToggle = document.querySelector('.menu-toggle');
const videoModal = document.querySelector('#videoModal');
const videoModalFrame = document.querySelector('#videoModalFrame');
const videoModalTitle = document.querySelector('#videoModalTitle');
const videoModalClose = document.querySelector('.video-modal-close');
const videoTriggers = Array.from(document.querySelectorAll('.video-trigger'));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const syncBodyScroll = () => {
    const shouldLock = header.classList.contains('menu-open') || videoModal?.classList.contains('is-open');
    document.body.style.overflow = shouldLock ? 'hidden' : '';
};

const closeMenu = () => {
    header.classList.remove('menu-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    syncBodyScroll();
};

const openMenu = () => {
    header.classList.add('menu-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    syncBodyScroll();
};

const closeVideoModal = () => {
    if (!videoModal || !videoModalFrame) {
        return;
    }

    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    videoModalFrame.src = '';
    syncBodyScroll();
};

const openVideoModal = (videoId, title) => {
    if (!videoModal || !videoModalFrame || !videoModalTitle) {
        return;
    }

    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    videoModalTitle.textContent = title;
    videoModalFrame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    syncBodyScroll();
};

const updateHeaderState = () => {
    if (window.scrollY > 24) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

const updateActiveLink = () => {
    const checkpoint = window.scrollY + 140;

    sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const link = navLinks[index];
        const isActive = checkpoint >= top && checkpoint < bottom;

        link.classList.toggle('active', isActive);
    });
};

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));

        if (!target) {
            return;
        }

        closeMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.contains('menu-open');

    if (isOpen) {
        closeMenu();
        return;
    }

    openMenu();
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
        closeMenu();
    }
});

window.addEventListener('scroll', () => {
    updateHeaderState();
    updateActiveLink();
});

videoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        openVideoModal(trigger.dataset.videoId, trigger.dataset.videoTitle || 'Youtube Video');
    });
});

videoModalClose?.addEventListener('click', closeVideoModal);

videoModal?.addEventListener('click', (event) => {
    if (event.target === videoModal) {
        closeVideoModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && videoModal?.classList.contains('is-open')) {
        closeVideoModal();
    }
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px',
    }
);

Array.from(document.querySelectorAll('.reveal')).forEach((element) => {
    revealObserver.observe(element);
});

const revealPanelContent = (panel) => {
    Array.from(panel.querySelectorAll('.reveal')).forEach((element) => {
        element.classList.add('is-visible');
    });
};

Array.from(document.querySelectorAll('[data-tab-group]')).forEach((group) => {
    const buttons = Array.from(group.querySelectorAll('[data-tab-target]'));
    const panels = Array.from(group.querySelectorAll('[data-tab-panel]'));

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.tabTarget;

            buttons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-selected', String(isActive));
            });

            panels.forEach((panel) => {
                const isActive = panel.dataset.tabPanel === target;
                panel.classList.toggle('is-active', isActive);

                if (isActive) {
                    revealPanelContent(panel);
                }
            });
        });
    });

    const activePanel = group.querySelector('[data-tab-panel].is-active');

    if (activePanel) {
        revealPanelContent(activePanel);
    }
});

const contactForm = document.querySelector('.contact-form');
const whatsappNumber = '6282218866002';
const contactEmail = 'devgandawijaya@gmail.com';

const setContactButtonState = (button, nextLabel) => {
    if (!button) {
        return;
    }

    const initialText = button.dataset.initialText || button.textContent;

    if (!button.dataset.initialText) {
        button.dataset.initialText = initialText;
    }

    button.textContent = nextLabel;
    button.disabled = true;

    window.setTimeout(() => {
        button.textContent = initialText;
        button.disabled = false;
    }, 1800);
};

const buildContactDraft = () => {
    if (!contactForm) {
        return null;
    }

    const name = contactForm.querySelector('[name="nama"]')?.value.trim() || 'Website visitor';
    const email = contactForm.querySelector('[name="email"]')?.value.trim() || 'Not provided';
    const message = contactForm.querySelector('[name="pesan"]')?.value.trim() || 'Halo, saya ingin berdiskusi lebih lanjut terkait project atau kebutuhan sistem.';
    const subject = `Portfolio inquiry from ${name}`;
    const lines = [
        'Halo Tatang,',
        '',
        'Saya menghubungi Anda dari website portfolio.',
        '',
        `Nama: ${name}`,
        `Email: ${email}`,
        '',
        'Pesan:',
        message,
    ];

    return {
        subject,
        body: lines.join('\n'),
    };
};

const openContactChannel = (channel, triggerButton) => {
    const draft = buildContactDraft();

    if (!draft) {
        return;
    }

    if (channel === 'email') {
        const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.location.href = mailtoUrl;
        setContactButtonState(triggerButton, 'Opening Email');
        return;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(draft.body)}`;
    window.open(whatsappUrl, '_blank', 'noopener');
    setContactButtonState(triggerButton, 'Opening WhatsApp');
};

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('.submit-btn');

    openContactChannel('whatsapp', submitButton);
});

contactForm?.querySelector('[data-contact-channel="email"]')?.addEventListener('click', (event) => {
    openContactChannel('email', event.currentTarget);
});

updateHeaderState();
updateActiveLink();
