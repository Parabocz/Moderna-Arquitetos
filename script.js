// Inicialização do Lenis (Smooth Scrolling)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integração Lenis com ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Animação de Preloader
window.addEventListener("load", () => {
    const tl = gsap.timeline();

    // Texto do preloader desaparece
    tl.to(".preloader-text", {
        opacity: 0,
        duration: 0.5,
        delay: 0.5
    })
    // Cortina desliza para cima (reveal geométrico)
    .to(".preloader", {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
    }, "-=0.2")
    // Acopla a animação da Hero para iniciar antes mesmo da cortina terminar de subir
    .add(initHeroAnimations(), "-=0.8");
});

function initHeroAnimations() {
    const tl = gsap.timeline();

    tl.from(".pre-headline", {
        yPercent: 100,
        duration: 1,
        ease: "power3.out"
    })
    .from(".headline", {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=0.8")
    .from(".subheadline", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from(".cta-wrap", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
    }, "-=0.6");

    return tl;
}

// Parallax na Hero Section
gsap.to(".hero-bg video", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Revelação da seção "Sobre Nós"
gsap.from(".quote-text-editorial", {
    scrollTrigger: {
        trigger: ".about-editorial",
        start: "top 70%",
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});

gsap.from(".about-paragraph-editorial", {
    scrollTrigger: {
        trigger: ".about-editorial",
        start: "top 60%",
    },
    y: 30,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: "power3.out"
});

import Swiper from 'swiper';
import { Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/parallax';

// Inicialização dos Carrosséis com Swiper e módulo Parallax
const swipers = new Swiper('.parallax-slider', {
    modules: [Parallax],
    speed: 1000,        // Duração da troca de imagem suave
    parallax: true,     // Ativa o módulo de profundidade
    slidesPerView: 'auto', // Respeita os 80% definidos no CSS
    spaceBetween: 0,
    grabCursor: true,   // Muda o mouse para a "mãozinha" de puxar
});

// A Animação de Entrada (O "Swing") usando Intersection Observer e GSAP
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('parallax-slider')) {
            // Anima o container pai inteiro
            gsap.fromTo(entry.target, 
                { x: 40, opacity: 0 }, 
                { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
            );
            // Para de observar para animar apenas na primeira vez
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 });

// Inicia o observador em cada carrossel
document.querySelectorAll('.parallax-slider').forEach(slider => {
    observer.observe(slider);
});

// Efeitos nas imagens da Galeria (Fade in no scroll)
const masonryItems = document.querySelectorAll('.masonry-item');

masonryItems.forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Animação da Seção CEO & Reviews (Stagger Columns)
gsap.from(".stagger-column", {
    scrollTrigger: {
        trigger: ".ceo-reviews-block",
        start: "top 75%",
    },
    x: -50,
    opacity: 0,
    duration: 1,
    stagger: 0.3, // Entram uma a uma com atraso (Esquerda para Direita)
    ease: "power3.out"
});

// Animador do contador de avaliações no Bloco
ScrollTrigger.create({
    trigger: ".ceo-reviews-block",
    start: "top 75%",
    once: true,
    onEnter: () => {
        // Um pequeno atraso para sincronizar o contador com a entrada da coluna 2 (onde ele está)
        setTimeout(() => {
            const countEl = document.querySelector('.stats-number');
            if (countEl) {
                const targetVal = parseInt(countEl.getAttribute('data-target'));
                gsap.to(countEl, {
                    innerHTML: targetVal,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "power3.out",
                    onUpdate: function() {
                        countEl.innerHTML = Math.round(countEl.innerHTML);
                    }
                });
            }

            const decimalEl = document.querySelector('.stats-number-decimal');
            if (decimalEl) {
                const targetValDec = parseFloat(decimalEl.getAttribute('data-target'));
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: targetValDec,
                    duration: 2.5,
                    ease: "power3.out",
                    onUpdate: function() {
                        decimalEl.innerHTML = obj.val.toFixed(1);
                    }
                });
            }
        }, 300); // 300ms = 0.3s (mesmo tempo de stagger da coluna 2)
    }
});

