document.addEventListener('DOMContentLoaded', function() {
    const envelope = document.querySelector('.envelope');
    const instructions = document.querySelector('.instructions');
    const heartSeal = document.querySelector('.heart-seal');
    const cardWrapper = document.querySelector('.card-wrapper');
    let isOpen = false;
    let touchStartTime = 0;
    
    // Detectar se é um dispositivo touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        instructions.textContent = "• Toque para abrir a carta";
    }

    // Função utilitária para resetar animações
    function resetAnimation(element) {
        element.style.animation = 'none';
        void element.offsetWidth;
    }

    envelope.addEventListener('click', function(e) {
        // Prevenir clique rápido em dispositivos móveis
        const currentTime = new Date().getTime();
        if (currentTime - touchStartTime < 600) return;
        
        isOpen = !isOpen;
        envelope.classList.toggle('open', isOpen);
        touchStartTime = currentTime;
    });
    
    // Adicionar evento de clique para a carta sair completamente
    cardWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        resetAnimation(cardWrapper);
        
        cardWrapper.style.animation = 'card-exit 1200ms forwards';
    });
    
    // Melhorar resposta ao toque
    envelope.addEventListener('touchstart', function(e) {
        touchStartTime = new Date().getTime();
        e.preventDefault();
    }, { passive: false });
    
    // Prevenir zoom de duplo toque
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Adicionar keyframes dinamicamente para a animação de saída
    const style = document.createElement('style');
    style.textContent = `
        @keyframes card-exit {
            0% {
                transform: translateY(-180px) rotate(0deg);
            }
            50% {
                transform: translateY(-300px) rotate(-5deg);
            }
            100% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 0;
            }
        }
        
        .card-restore-btn {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid white;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: 100;
        }
        
        .card-restore-btn.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Criar botão de restaurar carta
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'card-restore-btn';
    restoreBtn.textContent = 'Restaurar Carta';
    document.querySelector('.scene').appendChild(restoreBtn);
    
    // Evento para restaurar a carta
    restoreBtn.addEventListener('click', () => {
        resetAnimation(cardWrapper);
        cardWrapper.style.animation = 'hide-card 1000ms forwards';
        restoreBtn.classList.remove('show');
        
        // Esconder o botão após a animação
        setTimeout(() => {
            restoreBtn.style.display = 'none';
        }, 1000);
    });
    
    // Observar o final da animação de saída
    cardWrapper.addEventListener('animationend', (e) => {
        if (e.animationName === 'card-exit') {
            // Mostrar botão de restaurar
            restoreBtn.style.display = 'block';
            setTimeout(() => {
                restoreBtn.classList.add('show');
            }, 100);
        }
    });
    
    // Acessibilidade: permitir abrir/restaurar com Enter ou Espaço
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
            if (restoreBtn.style.display === 'block') {
                restoreBtn.click();
            } else {
                envelope.click();
            }
        }
    });
});
