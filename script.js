document.addEventListener('DOMContentLoaded', function() {
    const envelope = document.querySelector('.envelope');
    const instructions = document.querySelector('.instructions');
    let isOpen = false;
    let lastClickTime = 0;
    
    // Detectar se é um dispositivo touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        instructions.textContent = "• Toque para abrir/fechar a carta";
    } else {
        instructions.textContent = "• Clique para abrir/fechar a carta";
    }

    envelope.addEventListener('click', function(e) {
        // Prevenir clique rápido (debounce)
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 800) return;
        lastClickTime = currentTime;
        
        isOpen = !isOpen;
        envelope.classList.toggle('open', isOpen);
        
        // Atualizar instruções
        if (isOpen) {
            instructions.textContent = isTouchDevice ? 
                "• Toque para fechar a carta" : 
                "• Clique para fechar a carta";
        } else {
            instructions.textContent = isTouchDevice ? 
                "• Toque para abrir a carta" : 
                "• Clique para abrir a carta";
        }
    });
    
    // Melhorar resposta ao toque
    envelope.addEventListener('touchstart', function(e) {
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
    
    // Acessibilidade: permitir abrir/fechar com Enter ou Espaço
    envelope.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            envelope.click();
        }
    });
    
    // Tornar o envelope focável para acessibilidade
    envelope.setAttribute('tabindex', '0');
    envelope.setAttribute('role', 'button');
    envelope.setAttribute('aria-label', 'Abrir carta de convite');
});
