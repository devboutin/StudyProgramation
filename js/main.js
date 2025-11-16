// Espera o DOM (a página) carregar antes de executar
document.addEventListener('DOMContentLoaded', function() {
    
    // Configura todas as nossas novas interações
    setupScrollInteractions();
    setupFormValidation();
    setupScrollToTopButton();

});


/**
 * -----------------------------------------------------------------
 * INTERAÇÃO 1: Efeitos de Scroll (Header, Fade-in)
 * "Deixar o site mais interativo"
 * -----------------------------------------------------------------
 */
function setupScrollInteractions() {
    const header = document.querySelector('header');
    const fadeInElements = document.querySelectorAll('.fade-in-on-scroll'); 

    // Função que será chamada a cada scroll
    function handleScroll() {
        // 1. Adiciona sombra no Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Faz elementos aparecerem
        fadeInElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            // Se o topo do elemento estiver 80% "dentro" da tela
            if (elementTop < screenHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }

    // "Ouve" o evento de scroll da página
    window.addEventListener('scroll', handleScroll);
    
    // Chama uma vez no início para verificar o estado inicial
    handleScroll();
}

/**
 * -----------------------------------------------------------------
 * INTERAÇÃO 2: Botão "Voltar ao Topo"
 * "Deixar o site mais interativo"
 * -----------------------------------------------------------------
 */
function setupScrollToTopButton() {
    // 1. Cria o botão dinamicamente com JS
    const button = document.createElement('button');
    button.classList.add('scroll-to-top');
    button.innerHTML = '&#9650;'; // Ícone de seta para cima (^)
    document.body.appendChild(button); // Adiciona o botão na página

    // 2. "Ouve" o evento de scroll para mostrar/esconder
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    // 3. "Ouve" o clique para rolar suavemente ao topo
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // A mágica do "scroll suave"
        });
    });
}


/**
 * -----------------------------------------------------------------
 * INTERAÇÃO 3: Validação de Formulário "Bonita"
 * "Validação mais bonita"
 * -----------------------------------------------------------------
 */
function setupFormValidation() {
    const form = document.querySelector('#form-cadastro');
    if (!form) return; // Só executa se estiver na página "participe.html"

    // Pega todos os campos que têm 'required'
    const fields = form.querySelectorAll('[required]');

    // --- Validação "Bonita" em Tempo Real ---
    // Valida o campo assim que o usuário "sai" dele (evento 'blur')
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
    });

    // --- Validação Final no Envio (Obrigatório da Atividade) ---
    form.addEventListener('submit', function(evento) {
        
        // 1. Corrige o erro 405 (requisito da atividade)
        evento.preventDefault(); 
        
        let isFormValid = true;
        
        // 2. Valida todos os campos de uma vez
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        // 3. Validação final e específica do CPF (lógica)
        const cpfField = form.querySelector('#cpf');
        // Só roda a lógica do CPF se o campo já for válido (11 dígitos)
        if (cpfField.validity.valid) {
            const isCpfLogicValid = validaCPF(cpfField.value);
            if (!isCpfLogicValid) {
                showError(cpfField, "CPF inválido (dígito verificador não confere).");
                isFormValid = false;
            }
        }

        // 4. Se tudo estiver certo...
        if (isFormValid) {
            alert('Obrigado por participar! Seu cadastro foi recebido.');
            form.reset();
            fields.forEach(field => {
                field.style.borderColor = '#ccc'; // Limpa estilos
                const errorDiv = document.querySelector(`#${field.id}-error`);
                if (errorDiv) {
                    errorDiv.textContent = '';
                    errorDiv.classList.remove('visible');
                }
            });
        }
    });
}

// --- Funções Auxiliares de Validação ---

function validateField(field) {
    // field.validity.valid checa o HTML5 (required, pattern, type="email")
    if (field.validity.valid) {
        showSuccess(field);
        return true;
    } else {
        // Pega a mensagem de erro que colocamos no atributo 'title' do HTML
        const errorMessage = field.getAttribute('title') || 'Este campo é obrigatório.';
        showError(field, errorMessage);
        return false;
    }
}

function showError(field, message) {
    const errorDiv = document.querySelector(`#${field.id}-error`);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('visible');
    }
    field.style.borderColor = 'var(--cor-erro)';
}

function showSuccess(field) {
    const errorDiv = document.querySelector(`#${field.id}-error`);
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('visible');
    }
    field.style.borderColor = 'var(--cor-sucesso)';
}

// Função de validação de CPF (Requisito da Atividade)
function validaCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,''); 
    if(cpf == '' || cpf.length != 11 || /^(\d)\1+$/.test(cpf)) return false;
    let add = 0, rev;
    for (let i=0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
}