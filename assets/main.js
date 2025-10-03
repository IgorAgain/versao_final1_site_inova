/* ===========================
   MENU HAMBÚRGUER – OFF-CANVAS
   =========================== */
(() => {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navbar');
  if (!btn || !nav) return;

  // Cria o backdrop uma vez
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const open = () => {
    nav.classList.add('active');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('no-scroll');
    backdrop.classList.add('show');
  };

  const close = () => {
    nav.classList.remove('active');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('no-scroll');
    backdrop.classList.remove('show');
  };

  // Toggle no botão
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // impede fechar imediato pelo handler global
    nav.classList.contains('active') ? close() : open();
  });

  // Clique fora: fecha (ignora cliques no botão)
  document.addEventListener('click', (e) => {
    if (
      nav.classList.contains('active') &&
      !e.target.closest('.navbar') &&
      !e.target.closest('.menu-toggle')
    ) {
      close();
    }
  });

  // Backdrop fecha
  backdrop.addEventListener('click', close);

  // Tecla ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) close();
  });

  // Garante estado fechado no carregamento
  close();
})();

// ========================================
// CARROSSEL DO HERO - VERSÃO CORRIGIDA
// ========================================

let images = [];
let currentImage = 0;
let heroInterval = null;

// Função para inicializar o carrossel
function initHeroCarousel() {
    images = document.querySelectorAll('.hero-image');
    
    if (images.length === 0) {
        console.warn('Nenhuma imagem do hero encontrada');
        return;
    }
    
    console.log(`Hero carousel iniciado com ${images.length} imagens`);
    
    // Garantir que apenas a primeira imagem está ativa
    images.forEach((img, index) => {
        if (index === 0) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });
    
    // Iniciar o carrossel automático
    startHeroCarousel();
}

function showNextImage() {
    if (images.length === 0) return;
    
    // Remove active da imagem atual
    images[currentImage].classList.remove('active');
    images[currentImage].classList.remove('slide-in');
    
    // Próxima imagem
    currentImage = (currentImage + 1) % images.length;
    
    // Adiciona active na nova imagem
    images[currentImage].classList.add('active');
    images[currentImage].classList.add('slide-in');
    
    // Remove a classe de animação após completar
    setTimeout(() => {
        if (images[currentImage]) {
            images[currentImage].classList.remove('slide-in');
        }
    }, 1000);
    
    console.log(`Mudou para imagem ${currentImage + 1} de ${images.length}`);
}

function startHeroCarousel() {
    // Limpar interval existente
    if (heroInterval) {
        clearInterval(heroInterval);
    }
    
    // Iniciar novo interval
    heroInterval = setInterval(showNextImage, 3000); // 3 segundos entre mudanças
}

function stopHeroCarousel() {
    if (heroInterval) {
        clearInterval(heroInterval);
        heroInterval = null;
    }
}

// ========================================
// SMOOTH SCROLL E MENU
// ========================================

// Smooth scroll para os links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// NAVEGAÇÃO ATIVA
// ========================================

// Simular navegação entre páginas (para demonstrar o estado ativo)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
            
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
                    
            // Adiciona active ao link clicado
            this.classList.add('active');
                    
            // Fecha o menu mobile se estiver aberto
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.classList.remove('active');
            }
        });
    });
});

// ========================================
// ANIMAÇÃO DAS ESTATÍSTICAS
// ========================================

// Animação dos números das estatísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 3000; // 3 segundos
        const startTime = performance.now();
        
        function formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace('.0', '') + ' Milhões';
            } else if (num == 320000) {
                return '320' + ' Mil';
            }
            return num.toString();
        }
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Função de easing para desacelerar no final
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const current = Math.floor(easedProgress * target);
            stat.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = formatNumber(target);
            }
        }
        
        requestAnimationFrame(updateNumber);
    });
}

// Observador para detectar quando a seção entra na viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

// ========================================
// CARROSSEL DOS SEGMENTOS - VERSÃO CORRIGIDA
// ========================================

let currentSegmento = 0;
let segmentos = [];
let indicators = [];
let autoSlideInterval = null;
let isTransitioning = false;

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Captura elementos após DOM carregar
    segmentos = document.querySelectorAll('.segmento-item');
    indicators = document.querySelectorAll('.indicator');
    
    // Garante que o primeiro item esteja ativo
    if (segmentos.length > 0) {
        segmentos[0].classList.add('active');
    }
    if (indicators.length > 0) {
        indicators[0].classList.add('active');
    }
    
    // Inicia auto-slide
    startAutoSlide();
    
    // Para auto-slide quando usuário interage
    setupInteractionHandlers();
});
        
// Função para atualizar a visualização - MELHORADA
function updateCarousel() {
    if (isTransitioning) return;
            
    isTransitioning = true;
            
    // Remove active de todos os segmentos e indicadores
    segmentos.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
            
    // Força o reflow do browser antes de adicionar as novas classes
    document.body.offsetHeight;
            
    // Adiciona active apenas ao atual
    if (segmentos[currentSegmento]) {
        segmentos[currentSegmento].classList.add('active');
    }
    if (indicators[currentSegmento]) {
        indicators[currentSegmento].classList.add('active');
    }
    
    // Libera transição após tempo suficiente para a animação CSS
    setTimeout(() => {
        isTransitioning = false;
    }, 100);
}
        
// Função para mudar segmento
function changeSegmento(direction) {
    if (isTransitioning || segmentos.length === 0) return;
            
    const previousSegmento = currentSegmento;
    currentSegmento += direction;
            
    if (currentSegmento >= segmentos.length) {
        currentSegmento = 0;
    } else if (currentSegmento < 0) {
        currentSegmento = segmentos.length - 1;
    }
            
    // Se não mudou, não faz nada
    if (currentSegmento === previousSegmento) return;
            
    updateCarousel();
    resetAutoSlide();
}
        
// Função para ir diretamente a um segmento
function goToSegmento(index) {
    if (isTransitioning || index === currentSegmento || !segmentos[index]) return;
            
    currentSegmento = index;
    updateCarousel();
    resetAutoSlide();
}
        
// Função para próximo segmento (auto)
function nextSegmento() {
    changeSegmento(1);
}
        
// Controle do auto-slide
function startAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    autoSlideInterval = setInterval(nextSegmento, 5000);
}
        
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}
        
function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Configurar handlers para pausar auto-slide durante interação
function setupInteractionHandlers() {
    const carousel = document.querySelector('.segmentos-carousel');
    
    if (carousel) {
        // Pausa auto-slide no hover
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // Pausa auto-slide no touch (mobile)
        carousel.addEventListener('touchstart', stopAutoSlide, {passive:true});
        carousel.addEventListener('touchend', () => {
            setTimeout(startAutoSlide, 2000), {passive:true}; // Reativa após 2s
        });
    }
}

// Limpeza ao sair da página
window.addEventListener('beforeunload', stopAutoSlide);
// ========================================
// INICIALIZAÇÃO GERAL
// ========================================

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando site...');
    
    // Inicializar hero carousel
    setTimeout(() => {
        initHeroCarousel();
        
        // Controles para pausar/retomar no hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                stopHeroCarousel();
                console.log('Hero carousel pausado (hover)');
            });
            
            heroSection.addEventListener('mouseleave', () => {
                startHeroCarousel();
                console.log('Hero carousel retomado');
            });
        }
    }, 500);
    
    // Observar a seção de estatísticas
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Inicializar carrossel dos segmentos
    // Garantir que apenas o primeiro está ativo
    segmentos.forEach((item, index) => {
        if (index === 0) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
            
    indicators.forEach((indicator, index) => {
        if (index === 0) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
            
    // Iniciar auto-slide dos segmentos
    startAutoSlide();
            
    // Controles de hover para segmentos
    const carousel = document.querySelector('.segmentos-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }
});

// ========================================
// CONTROLES ADICIONAIS
// ========================================

// Reinicializar hero se a janela for redimensionada
window.addEventListener('resize', function() {
    if (images.length > 0) {
        clearTimeout(window.heroResizeTimeout);
        window.heroResizeTimeout = setTimeout(() => {
            stopHeroCarousel();
            setTimeout(() => {
                initHeroCarousel();
            }, 100);
        }, 250);
    }
});

// Parar carrossel quando página não estiver visível
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopHeroCarousel();
    } else {
        startHeroCarousel();
    }
});

// Suporte a teclado para segmentos
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        changeSegmento(-1);
    } else if (e.key === 'ArrowRight') {
        changeSegmento(1);
    }
});

// ========================================
// FUNÇÕES GLOBAIS PARA DEBUGGING
// ========================================

// Controles globais para teste
window.heroCarouselControls = {
    next: showNextImage,
    start: startHeroCarousel,
    stop: stopHeroCarousel,
    getCurrentImage: () => currentImage,
    getImages: () => images
};

// Controles dos segmentos
window.segmentosCarousel = {
    changeSegmento,
    goToSegmento,
    startAutoSlide,
    stopAutoSlide
};

// Animação de entrada dos parceiros (Intersection Observer)
document.addEventListener('DOMContentLoaded', function() {
    
    // Função para animar elementos quando entram na viewport
    function createIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar todos os itens de parceiros
        const parceiroPutItens = document.querySelectorAll('[data-aos]');
        parceiroPutItens.forEach(item => {
            observer.observe(item);
        });
    }

    // Animação sequencial mais suave
    function animateParceiroSequence() {
        const parceiros = document.querySelectorAll('.parceiro-item');
        
        parceiros.forEach((parceiro, index) => {
            // Adiciona delay baseado no índice
            setTimeout(() => {
                parceiro.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                parceiro.classList.add('aos-animate');
            }, index * 150);
        });
    }

    // Função para reset das animações ao sair da viewport (opcional)
    function createResetObserver() {
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Remove a animação quando sair da viewport (opcional)
                    // entry.target.classList.remove('aos-animate');
                }
            });
        }, {
            threshold: 0
        });

        const parceiroItems = document.querySelectorAll('.parceiro-item');
        parceiroItems.forEach(item => {
            resetObserver.observe(item);
        });
    }

    // Efeito de hover aprimorado
    function enhanceHoverEffects() {
        const parceiroCards = document.querySelectorAll('.parceiro-card');
        
        parceiroCards.forEach(card => {
            const image = card.querySelector('.parceiro-logo');
            const overlay = card.querySelector('.parceiro-overlay');
            
            card.addEventListener('mouseenter', () => {
                // Adiciona uma leve rotação na imagem
                if (image) {
                    image.style.transform = 'scale(1.08) rotate(1deg)';
                }
                
                // Anima o overlay com mais suavidade
                if (overlay) {
                    overlay.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Retorna ao estado normal
                if (image) {
                    image.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    // Adiciona efeito de paralaxe sutil (opcional)
    function addParallaxEffect() {
        const parceiroSection = document.querySelector('.principais-parceiros');
        if (!parceiroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.1;
            
            // Aplica um movimento sutil de paralaxe nos cards
            const cards = document.querySelectorAll('.parceiro-card');
            cards.forEach((card, index) => {
                const offset = parallax * (index % 2 === 0 ? 1 : -1);
                card.style.transform = `translateY(${offset}px)`;
            });
        });
    }

    // Inicializar todas as funcionalidades
    function initParceiroAnimations() {
        createIntersectionObserver();
        enhanceHoverEffects();
        
        // Verifica se o usuário prefere movimento reduzido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            // addParallaxEffect(); // Descomente se quiser o efeito de paralaxe
        }
    }

    // Aguarda o carregamento das imagens antes de iniciar as animações
    const images = document.querySelectorAll('.parceiro-logo');
    let imagesLoaded = 0;
    
    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            initParceiroAnimations();
        }
    }
    
    if (images.length === 0) {
        initParceiroAnimations();
    } else {
        images.forEach(img => {
            if (img.complete) {
                onImageLoad();
            } else {
                img.addEventListener('load', onImageLoad);
                img.addEventListener('error', onImageLoad); // Garante que continue mesmo com erro
            }
        });
    }
});

// Função auxiliar para verificar se o elemento está na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Funcionalidades do formulário Fale Conosco
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do formulário
    const form = document.getElementById('formContato');
    const inputs = document.querySelectorAll('.form-input');
    const textarea = document.querySelector('.form-textarea');
    const select = document.querySelector('.form-select');
    
    // Função para limpar placeholder quando o usuário clicar
    function handleFocus(element) {
        if (element.type !== 'email' && element.type !== 'tel') {
            element.dataset.placeholder = element.placeholder;
            element.placeholder = '';
        }
    }
    
    // Função para restaurar placeholder quando o campo ficar vazio e perder o foco
    function handleBlur(element) {
        if (element.value === '' && element.dataset.placeholder) {
            element.placeholder = element.dataset.placeholder;
        }
    }
    
    // Aplicar eventos nos inputs
    inputs.forEach(input => {
        input.addEventListener('focus', () => handleFocus(input));
        input.addEventListener('blur', () => handleBlur(input));
    });
    
    // Aplicar eventos no textarea
    if (textarea) {
        textarea.addEventListener('focus', () => handleFocus(textarea));
        textarea.addEventListener('blur', () => handleBlur(textarea));
    }
    
    // Formatação automática do telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{2})/, '($1)');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Validação e envio do formulário
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                assunto: document.getElementById('assunto').value,
                mensagem: document.getElementById('mensagem').value.trim()
            };
            
            // Validação simples
            if (!formData.nome) {
                alert('Por favor, preencha seu nome.');
                document.getElementById('nome').focus();
                return;
            }
            
            if (!formData.email) {
                alert('Por favor, preencha seu e-mail.');
                document.getElementById('email').focus();
                return;
            }
            
            if (!isValidEmail(formData.email)) {
                alert('Por favor, insira um e-mail válido.');
                document.getElementById('email').focus();
                return;
            }
            
            if (!formData.telefone) {
                alert('Por favor, preencha seu telefone.');
                document.getElementById('telefone').focus();
                return;
            }
            
            if (!formData.assunto) {
                alert('Por favor, selecione um assunto.');
                document.getElementById('assunto').focus();
                return;
            }
            
            if (!formData.mensagem) {
                alert('Por favor, escreva sua mensagem.');
                document.getElementById('mensagem').focus();
                return;
            }
            
            // Simula o envio (aqui você integraria com seu backend)
            console.log('Dados do formulário:', formData);
            
            // Feedback visual para o usuário
            const submitButton = form.querySelector('.form-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // Simula o tempo de envio
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                
                // Reset do formulário
                form.reset();
                
                // Restaura o botão
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                
            }, 2000);
        });
    }
    
    // Função para validar e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Evento para o botão WhatsApp
    const whatsappContact = document.querySelector('.whatsapp-contact');
    if (whatsappContact) {
        whatsappContact.addEventListener('click', function() {
            // Substitua pelo número real da empresa
            const phoneNumber = '5511912214289'; // Mesmo número do rodapé
            const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os serviços da Inova Tecnologia.');
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Animação suave nos campos quando em foco
    const formElements = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    formElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Função para scroll suave até a seção (caso queira usar em links)
function scrollToFaleConosco() {
    const faleConoscoSection = document.querySelector('.fale-conosco');
    if (faleConoscoSection) {
        faleConoscoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para expandir/contrair cards
document.addEventListener('DOMContentLoaded', function() {
    const servicoButtons = document.querySelectorAll('.servico-cta');
    
    servicoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.servico-card');
            const isExpanded = card.classList.contains('expandido');
            const span = this.querySelector('span');
            
            if (isExpanded) {
                // Contrair
                card.classList.remove('expandido');
                span.textContent = 'Descubra sobre';
                this.setAttribute('data-action', 'expand');
            } else {
                // Expandir
                card.classList.add('expandido');
                span.textContent = 'Mostrar';
                this.setAttribute('data-action', 'collapse');
            }
        });
    });
});

;

/* ========== Tabs de Arquitetura ========== */
(() => {
  const tabs = document.querySelectorAll('.arch-tab');
  const panels = {
    facial: document.getElementById('arch-facial'),
    qr:     document.getElementById('arch-qr'),
    bio:    document.getElementById('arch-bio')
  };
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('is-active'));
      Object.values(panels).forEach(p => { p.classList.remove('is-active'); p.hidden = true; });

      btn.classList.add('is-active');
      const key = btn.dataset.arch;
      panels[key].hidden = false;
      panels[key].classList.add('is-active');
    });
  });
})();

/* ========== Carrossel de Kits (scroll-snap + botões) ========== */
(() => {
  const wrap = document.querySelector('[data-kits]');
  if (!wrap) return;
  const track = wrap.querySelector('.kits-track');
  const prev  = wrap.querySelector('.kits-nav.prev');
  const next  = wrap.querySelector('.kits-nav.next');

  const step = () => track.clientWidth * 0.9;

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });
})();