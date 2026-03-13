// script.js

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle icon
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');

        // Handle active state
        navLinksItems.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});

// Scroll Reveal Animation using Intersection Observer
const revealElements = document.querySelectorAll('.reveal, .fade-up:not(.reveal), .fade-right:not(.reveal), .fade-left:not(.reveal)');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Optional: stop observing once revealed
        }
    });
};

const revealOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Add active state to nav links based on scroll position
const sections = document.querySelectorAll('section, header');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');

        // Close all options
        document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
        document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);

        // Open this one if it wasn't open
        if (!isActive) {
            question.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Scroll progress bar
const scrollProgress = document.querySelector('.scroll-progress');
const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${percent}%`;
};

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Animated stats count
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const animateStats = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target) || 0;
        const isFloat = String(el.dataset.target).includes('.');
        const duration = 1400;
        const start = performance.now();

        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const value = isFloat ? (target * progress) : Math.round(target * progress);
            el.textContent = isFloat ? value.toFixed(1) : value;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (!isFloat && target > 0) {
                el.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(step);
        observer.unobserve(el);
    });
};

const statsObserver = new IntersectionObserver(animateStats, {
    root: null,
    threshold: 0.5,
});
statNumbers.forEach(el => statsObserver.observe(el));

// Dica do dia
const dailyTips = [
    'Ao acordar, alongue os braços e pescoço por 1 minuto para ajudar a mobilizar a coluna.',
    'Hidrate-se: beber água com regularidade ajuda a manter músculos e articulações flexíveis.',
    'Faça uma pausa curta a cada 50 minutos de trabalho sentado para caminhar e esticar as pernas.',
    'Use um rolo de espuma para relaxar a musculatura das costas e aliviar tensões.',
    'Mantenha os pés apoiados no chão ao sentar; isso ajuda a estabilizar a postura.',
];

const tipEl = document.getElementById('daily-tip');
const newTipBtn = document.getElementById('new-tip');
const shareTipBtn = document.getElementById('share-tip');

const getRandomTip = () => dailyTips[Math.floor(Math.random() * dailyTips.length)];

const setTip = (tip) => {
    if (tipEl) tipEl.textContent = tip;
};

const shareTip = async () => {
    const tip = tipEl?.textContent || '';
    if (!tip) return;

    if (navigator.share) {
        await navigator.share({
            title: 'Dica de Bem-Estar',
            text: tip,
        });
        return;
    }

    try {
        await navigator.clipboard.writeText(tip);
        alert('Dica copiada! Agora basta colar e compartilhar onde quiser 😊');
    } catch (err) {
        alert('Não foi possível copiar a dica automaticamente. Use Ctrl+C para copiar.');
    }
};

if (newTipBtn) {
    newTipBtn.addEventListener('click', () => setTip(getRandomTip()));
}

if (shareTipBtn) {
    shareTipBtn.addEventListener('click', shareTip);
}

setTip(getRandomTip());

// Back to top
const backToTop = document.querySelector('.back-to-top');

const updateBackToTop = () => {
    if (!backToTop) return;
    if (window.scrollY > window.innerHeight / 2) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

window.addEventListener('scroll', updateBackToTop);

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// FAQ search filter
const faqSearchInput = document.getElementById('faq-search');
const faqItems = document.querySelectorAll('.faq-item');

const filterFaq = (term) => {
    const normalized = term.trim().toLowerCase();
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answer = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
        const match = normalized === '' || question.includes(normalized) || answer.includes(normalized);
        item.style.display = match ? '' : 'none';
    });
};

faqSearchInput?.addEventListener('input', (event) => {
    filterFaq(event.target.value);
});



// Confetti effect
const confettiCanvas = document.getElementById('confetti-canvas');
let confettiCtx;
let confettiParticles = [];
let confettiFrame;

const createConfetti = () => {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiParticles = [];

    const colors = ['#850e35', '#ee6983', '#ffc4c4', '#fff5e4'];

    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 3,
            d: Math.random() * 20 + 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0,
        });
    }
};

const drawConfetti = () => {
    if (!confettiCtx || !confettiCanvas) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(p => {
        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        confettiCtx.stroke();
    });

    updateConfetti();
};

const updateConfetti = () => {
    confettiParticles.forEach(p => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (p.y > confettiCanvas.height) {
            p.y = -10;
            p.x = Math.random() * confettiCanvas.width;
        }
    });
};

const playConfetti = () => {
    if (!confettiCanvas) return;
    confettiCanvas.style.opacity = '1';
    createConfetti();

    const step = () => {
        drawConfetti();
        confettiFrame = requestAnimationFrame(step);
    };

    step();

    setTimeout(() => {
        cancelAnimationFrame(confettiFrame);
        if (confettiCanvas) {
            confettiCanvas.style.opacity = '0';
            confettiCtx?.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }, 2000);
};

const confettiButtons = document.querySelectorAll('.btn-primary[data-confetti]');

confettiButtons.forEach(button => {
    button.addEventListener('click', () => {
        playConfetti();
    });
});

// Keep confetti canvas full size on resize
window.addEventListener('resize', () => {
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

// Reviews carousel (Google Reviews / Local JSON)
const reviewsTrack = document.getElementById('reviews-track');
const sliderPrev = document.querySelector('.slider-control.prev');
const sliderNext = document.querySelector('.slider-control.next');

const sampleReviews = [
    {
        author: "Andressa Oliveira",
        date: "Mar 2026",
        rating: 5,
        text: "Excelente profissional, atenciosa, comunicativa, prestativa e pontual."
    },
    {
        author: "Jessica Santos",
        date: "Mar 2026",
        rating: 5,
        text: "Atendimento maravilhoso, super cuidadosa e atenciosa. Indico muito! ❤️"
    },
    {
        author: "Veridiana Rodrigues",
        date: "Mar 2026",
        rating: 5,
        text: "Um trabalho excepcionalmente lindo! Uma pessoa extremamente dedicada e que trabalha com amor! Trata cada paciente com um carinho exclusivo! E a simpatia é excelente!"
    },
    {
        author: "Tathi Lima",
        date: "Mar 2026",
        rating: 5,
        text: "Profissional incrível! Muito dedicada, atenciosa e competente. A partir do primeiro contato, senti acolhimento e segurança. Os resultados foram muito bons. Super recomendo!"
    },
    {
        author: "Deborah Helena Quezado Fernandes",
        date: "Mar 2026",
        rating: 5,
        text: "Excelente profissional! Muito humana, super competente e extremamente preparada. Além disso, é sempre pontual e demonstra grande cuidado e atenção com seus pacientes."
    },
    {
        author: "Rafael Sousa",
        date: "Mar 2026",
        rating: 5,
        text: "Ótima"
    }
];

const buildStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-star';
        if (i >= count) icon.style.opacity = '0.25';
        stars.push(icon);
    }
    return stars;
};

const createReviewCard = (review) => {
    const card = document.createElement('article');
    card.className = 'review-card';

    const header = document.createElement('div');
    header.className = 'review-header';

    const author = document.createElement('div');
    author.className = 'review-author';
    author.textContent = review.author;

    const date = document.createElement('div');
    date.className = 'review-date';
    date.textContent = review.date;

    const stars = document.createElement('div');
    stars.className = 'review-stars';
    buildStars(review.rating).forEach(star => stars.appendChild(star));

    header.appendChild(author);
    header.appendChild(date);

    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = review.text;

    card.appendChild(header);
    card.appendChild(stars);
    card.appendChild(text);

    return card;
};

const updateSliderButtons = () => {
    if (!reviewsTrack) return;
    const maxScroll = reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
    if (sliderPrev) sliderPrev.disabled = reviewsTrack.scrollLeft <= 10;
    if (sliderNext) sliderNext.disabled = reviewsTrack.scrollLeft >= maxScroll - 10;
};

const scrollReviews = (direction) => {
    if (!reviewsTrack) return;
    const step = reviewsTrack.clientWidth * 0.8;
    const target = direction === 'next'
        ? Math.min(reviewsTrack.scrollLeft + step, reviewsTrack.scrollWidth)
        : Math.max(reviewsTrack.scrollLeft - step, 0);
    reviewsTrack.scrollTo({ left: target, behavior: 'smooth' });
};

if (sliderPrev) sliderPrev.addEventListener('click', () => scrollReviews('prev'));
if (sliderNext) sliderNext.addEventListener('click', () => scrollReviews('next'));

if (reviewsTrack) {
    reviewsTrack.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateSliderButtons);
    });
}

const loadReviews = (reviews) => {
    if (!reviewsTrack) return;
    reviewsTrack.innerHTML = '';
    reviews.forEach(review => {
        reviewsTrack.appendChild(createReviewCard(review));
    });
    updateSliderButtons();
};

// Place ID para automação: ChIJrb3YGH0i0EERlDi2ukYC9VI
const GOOGLE_PLACE_ID = 'ChIJrb3YGH0i0EERlDi2ukYC9VI';

// Busca local (reviews.json) ou usa o sample interno
const initReviews = () => {
    fetch('reviews.json')
        .then(r => {
            if (!r.ok) throw new Error('No reviews.json');
            return r.json();
        })
        .then(data => loadReviews(Array.isArray(data) ? data : sampleReviews))
        .catch(() => loadReviews(sampleReviews));

    console.log(`%c[Automation] Place ID da Dra. Grazy: ${GOOGLE_PLACE_ID}`, 'color: #850e35; font-weight: bold;');
};

initReviews();


