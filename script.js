document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const feedbackDiv = document.getElementById('feedback');
    const matriculaInput = document.getElementById('matricula');
    const senhaInput = document.getElementById('senha');
    const rememberCheck = document.getElementById('rememberCheck');
    const forgotLink = document.getElementById('forgotLink');

    const VALID_MATRICULA = "HS2025";
    const VALID_SENHA = "hypersenses";

    function loadSavedCredentials() {
        const savedMatricula = localStorage.getItem('hs_matricula');
        const savedSenha = localStorage.getItem('hs_senha');
        const savedRemember = localStorage.getItem('hs_remember') === 'true';
        
        if (savedRemember && savedMatricula && savedSenha) {
            matriculaInput.value = savedMatricula;
            senhaInput.value = savedSenha;
            rememberCheck.checked = true;
            showMessage('<i class="fas fa-database"></i> Credenciais HYPER SENSES carregadas', false);
        }
    }


    function saveCredentialsIfNeeded(matricula, senha) {
        if (rememberCheck.checked) {
            localStorage.setItem('hs_matricula', matricula);
            localStorage.setItem('hs_senha', senha);
            localStorage.setItem('hs_remember', 'true');
        } else {
            localStorage.removeItem('hs_matricula');
            localStorage.removeItem('hs_senha');
            localStorage.setItem('hs_remember', 'false');
        }
    }
    function showMessage(message, isError = false) {
        feedbackDiv.innerHTML = message;
        feedbackDiv.style.color = isError ? '#ff8888' : '#0ff';
        feedbackDiv.style.borderLeft = isError ? '3px solid #ff4444' : '3px solid #0ff';
        
        setTimeout(() => {
            if (feedbackDiv.innerHTML === message) {
                feedbackDiv.innerHTML = '';
            }
        }, 3000);
    }

    function handleLogin(event) {
        event.preventDefault();
        
        const matricula = matriculaInput.value.trim();
        const senha = senhaInput.value;
        
        if (!matricula || !senha) {
            showMessage('<i class="fas fa-exclamation-triangle"></i> Preencha matrícula e senha', true);
            return;
        }
        
        const btn = document.querySelector('.btn-login');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Validando acesso...';
        btn.disabled = true;
        
        setTimeout(() => {
            if (matricula === VALID_MATRICULA && senha === VALID_SENHA) {
                saveCredentialsIfNeeded(matricula, senha);
                showMessage('<i class="fas fa-check-circle"></i> Bem-vindo ao HYPER SENSES! Acesso autorizado.');
           
                setTimeout(() => {
                    feedbackDiv.innerHTML = '<i class="fas fa-chart-line"></i> Sistema Hyper Senses ativado<br><small>Baixo risco • 0 acidentes • 50 passagens monitoradas • 80 ações preditivas</small>';
                    feedbackDiv.style.background = 'rgba(0, 255, 255, 0.1)';
                    
                    setTimeout(() => {
                        if (confirm('Login bem-sucedido! Deseja acessar o Dashboard HYPER SENSES?')) {
                            alert('Dashboard Ferroviário Hyper Senses\n\n✅ Monitoramento em tempo real\n✅ Rede IoT ativa\n✅ Risco zero detectado');
                        }
                    }, 500);
                }, 1000);
            } else {
                showMessage('<i class="fas fa-ban"></i> Matrícula ou senha inválidos', true);
                senhaInput.value = '';
                senhaInput.focus();
            }
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 800);
    }
    
    function handleForgotPassword(event) {
        event.preventDefault();
        const matricula = matriculaInput.value.trim();
        
        if (!matricula) {
            showMessage('<i class="fas fa-info-circle"></i> Digite sua matrícula para recuperar acesso', true);
            return;
        }
        
        showMessage(`<i class="fas fa-envelope"></i> Token de redefinição enviado para o e-mail do ferroviário ${matricula}`, false);
    }
    
    loginForm.addEventListener('submit', handleLogin);
    forgotLink.addEventListener('click', handleForgotPassword);
    
    loadSavedCredentials();
    
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.01)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
    
    console.log('%c🚂 HYPER SENSES - Sistema de Monitoramento Ferroviário', 'color: #0ff; font-size: 14px; font-weight: bold;');
    console.log('%cBaixo risco • 0 acidentes • 50 passagens • 80 ações preditivas', 'color: #88ff88; font-size: 12px;');
});