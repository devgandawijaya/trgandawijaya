const header = document.querySelector('.site-header');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const menuToggle = document.querySelector('.menu-toggle');
const videoModal = document.querySelector('#videoModal');
const videoModalFrame = document.querySelector('#videoModalFrame');
const videoModalTitle = document.querySelector('#videoModalTitle');
const videoModalClose = document.querySelector('.video-modal-close');
const videoTriggers = Array.from(document.querySelectorAll('.video-trigger'));
const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const portfolioThemes = {
    ecommerce: {
        accent: '#4f8bff',
        surface: '#132946',
        label: 'Storefront',
        icon: (accent) => `
            <rect x="66" y="70" width="188" height="104" rx="18" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.55" />
            <rect x="82" y="88" width="156" height="18" rx="9" fill="rgba(79,139,255,0.2)" />
            <rect x="82" y="118" width="46" height="42" rx="12" fill="${accent}" fill-opacity="0.24" />
            <rect x="138" y="118" width="46" height="42" rx="12" fill="rgba(255,255,255,0.08)" />
            <rect x="194" y="118" width="44" height="42" rx="12" fill="rgba(255,255,255,0.08)" />
            <circle cx="222" cy="71" r="14" fill="${accent}" />
            <path d="M217 71h10M222 66v10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        `,
    },
    erp: {
        accent: '#36d1a6',
        surface: '#112d2e',
        label: 'ERP Flow',
        icon: (accent) => `
            <rect x="64" y="64" width="84" height="54" rx="16" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <rect x="172" y="64" width="84" height="54" rx="16" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <rect x="118" y="128" width="84" height="54" rx="16" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <path d="M148 91h24M184 91h24M160 118v16M160 134h42" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85" />
            <circle cx="160" cy="91" r="7" fill="${accent}" />
            <circle cx="118" cy="155" r="7" fill="${accent}" />
            <circle cx="202" cy="155" r="7" fill="${accent}" />
        `,
    },
    crypto: {
        accent: '#f6c453',
        surface: '#2f2411',
        label: 'Wallet',
        icon: (accent) => `
            <rect x="72" y="72" width="176" height="100" rx="22" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.5" />
            <circle cx="132" cy="122" r="28" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="3" />
            <path d="M132 105v34M119 114c4-5 9-7 15-7 8 0 14 4 14 10 0 16-29 7-29 22 0 7 6 11 15 11 6 0 12-2 16-7" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="176" y="102" width="46" height="40" rx="14" fill="${accent}" fill-opacity="0.2" />
            <circle cx="206" cy="122" r="6" fill="${accent}" />
        `,
    },
    devops: {
        accent: '#8d8bff',
        surface: '#211b42',
        label: 'Runtime',
        icon: (accent) => `
            <rect x="76" y="60" width="164" height="36" rx="14" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <rect x="76" y="106" width="164" height="36" rx="14" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <rect x="76" y="152" width="164" height="36" rx="14" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <circle cx="100" cy="78" r="6" fill="${accent}" />
            <circle cx="100" cy="124" r="6" fill="${accent}" />
            <circle cx="100" cy="170" r="6" fill="${accent}" />
            <path d="M122 78h70M122 124h92M122 170h54" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85" />
        `,
    },
    analysis: {
        accent: '#ff8d6b',
        surface: '#3c2018',
        label: 'Audit Board',
        icon: (accent) => `
            <rect x="68" y="62" width="180" height="118" rx="22" fill="rgba(7,17,32,0.82)" stroke="${accent}" stroke-opacity="0.48" />
            <rect x="88" y="84" width="60" height="12" rx="6" fill="${accent}" fill-opacity="0.26" />
            <rect x="88" y="108" width="140" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
            <rect x="88" y="128" width="126" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
            <rect x="88" y="148" width="96" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
            <circle cx="212" cy="144" r="18" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="3" />
            <path d="M222 156l14 14" stroke="${accent}" stroke-width="4" stroke-linecap="round" />
        `,
    },
};

const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const wrapSvgText = (value, maxChars = 18) => {
    const words = value.split(/\s+/).filter(Boolean);
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;

        if (nextLine.length > maxChars && currentLine) {
            lines.push(currentLine);
            currentLine = word;
            return;
        }

        currentLine = nextLine;
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    if (lines.length <= 2) {
        return lines;
    }

    return [lines[0], `${lines.slice(1).join(' ').slice(0, maxChars - 1)}…`];
};

const createPortfolioVisual = (title, category, segment) => {
    const theme = portfolioThemes[category] || portfolioThemes.analysis;
    const safeTitle = escapeHtml(title);
    const safeSegment = escapeHtml(segment);
    const subtitle = theme.label;
    const titleLines = wrapSvgText(title).map((line) => escapeHtml(line));
    const titleMarkup = titleLines
        .map((line, index) => `<text x="38" y="${188 + (index * 18)}" fill="#f4f7ff" font-size="${index === 0 ? 22 : 18}" font-weight="700" font-family="Outfit, Arial, sans-serif">${line}</text>`)
        .join('');
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${safeTitle} project preview">
            <defs>
                <linearGradient id="panel-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${theme.surface}" />
                    <stop offset="100%" stop-color="#071120" />
                </linearGradient>
                <linearGradient id="glow-${category}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.08" />
                </linearGradient>
            </defs>
            <rect width="320" height="220" rx="28" fill="url(#panel-${category})" />
            <circle cx="258" cy="46" r="56" fill="${theme.accent}" fill-opacity="0.16" />
            <circle cx="74" cy="194" r="64" fill="#ffffff" fill-opacity="0.05" />
            <rect x="22" y="18" width="276" height="184" rx="24" fill="rgba(5,13,24,0.34)" stroke="rgba(255,255,255,0.08)" />
            <rect x="38" y="28" width="88" height="26" rx="13" fill="url(#glow-${category})" />
            <text x="54" y="45" fill="#f4f7ff" font-size="11" font-family="Outfit, Arial, sans-serif" letter-spacing="1.6">${escapeHtml(subtitle.toUpperCase())}</text>
            ${theme.icon(theme.accent)}
            ${titleMarkup}
            <text x="38" y="208" fill="#9ab5df" font-size="12" font-family="Outfit, Arial, sans-serif">${safeSegment}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
};

const inferPortfolioCategory = (metaText) => {
    if (metaText.includes('ecommerce')) {
        return 'ecommerce';
    }

    if (metaText.includes('erp')) {
        return 'erp';
    }

    if (metaText.includes('crypto')) {
        return 'crypto';
    }

    if (metaText.includes('dev ops') || metaText.includes('attendance') || metaText.includes('hris')) {
        return 'devops';
    }

    return 'analysis';
};

const hydratePortfolioImages = () => {
    portfolioCards.forEach((card) => {
        const image = card.querySelector('.portfolio-image img');
        const title = card.querySelector('h3')?.textContent?.trim();
        const meta = Array.from(card.querySelectorAll('.portfolio-meta span')).map((item) => item.textContent.trim());

        if (!image || !title || meta.length === 0) {
            return;
        }

        const category = inferPortfolioCategory(meta.join(' ').toLowerCase());
        image.src = createPortfolioVisual(title, category, meta[1] || meta[0]);
        image.loading = 'lazy';
        image.decoding = 'async';
    });
};

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

hydratePortfolioImages();
updateHeaderState();
updateActiveLink();
