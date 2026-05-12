let usuarios = JSON.parse(localStorage.getItem('hyperSensesUsers')) || [];
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const feedback = document.getElementById('feedback');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        authForms.forEach(form => form.classList.remove('active'));
        if (tabName === 'login') {
            loginForm.classList.add('active');
        } else {
            registerForm.classList.add('active');
        }
        
        hideFeedback();
    });
});

function showFeedback(message, type = 'error') {
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    setTimeout(() => {
        hideFeedback();
    }, 5000);
}

function hideFeedback() {
    feedback.className = 'feedback-message';
    feedback.textContent = '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9\s\-\(\)\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('regNome').value.trim();
    const matricula = document.getElementById('regMatricula').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const telefone = document.getElementById('regTelefone').value.trim();
    const senha = document.getElementById('regSenha').value;
    const confirmSenha = document.getElementById('regConfirmSenha').value;
    
    if (!nome || !matricula || !email || !telefone || !senha || !confirmSenha) {
        showFeedback('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showFeedback('Por favor, insira um email válido (deve conter @)!', 'error');
        return;
    }
    
    if (!validatePhone(telefone)) {
        showFeedback('Por favor, insira um número de telefone válido!', 'error');
        return;
    }
    
    if (senha.length < 6) {
        showFeedback('A senha deve ter no mínimo 6 caracteres!', 'error');
        return;
    }
    
    if (senha !== confirmSenha) {
        showFeedback('As senhas não coincidem!', 'error');
        return;
    }

    if (usuarios.find(u => u.matricula === matricula)) {
        showFeedback('Matrícula já cadastrada!', 'error');
        return;
    }

    if (usuarios.find(u => u.email === email)) {
        showFeedback('Email já cadastrado!', 'error');
        return;
    }
        const novoUsuario = {
        id: Date.now(),
        nome,
        matricula,
        email,
        telefone,
        senha: btoa(senha) 
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('hyperSensesUsers', JSON.stringify(usuarios));
    
    showFeedback('Cadastro realizado com sucesso! Faça login para continuar.', 'success');

    registerForm.reset();

    setTimeout(() => {
        document.querySelector('[data-tab="login"]').click();
    }, 2000);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const matricula = document.getElementById('matricula').value.trim();
    const senha = document.getElementById('senha').value;
    const rememberCheck = document.getElementById('rememberCheck').checked;
    
    if (!matricula || !senha) {
        showFeedback('Por favor, digite sua matrícula e senha!', 'error');
        return;
    }
    
    const usuario = usuarios.find(u => u.matricula === matricula);
    
    if (!usuario) {
        showFeedback('Matrícula não encontrada! Faça o cadastro primeiro.', 'error');
        return;
    }
    
    if (btoa(senha) !== usuario.senha) {
        showFeedback('Senha incorreta! Tente novamente.', 'error');
        return;
    }
    
    showFeedback(`Bem-vindo(a), ${usuario.nome}! Login realizado com sucesso!`, 'success');
    
    if (rememberCheck) {
        localStorage.setItem('hyperSensesLoggedUser', JSON.stringify({
            matricula: usuario.matricula,
            nome: usuario.nome,
            timestamp: Date.now()
        }));
    }
    
    setTimeout(() => {
        alert(`Redirecionando para o dashboard do sistema Hyper Senses...\nBem-vindo(a) ${usuario.nome}!`);

    }, 1500);
    
    loginForm.reset();
});

function checkSavedSession() {
    const savedUser = localStorage.getItem('hyperSensesLoggedUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const hoursSinceLogin = (Date.now() - user.timestamp) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) { 
            showFeedback(`Bem-vindo de volta, ${user.nome}!`, 'info');
            setTimeout(() => {
                alert(`Redirecionando para o dashboard...\nBem-vindo(a) ${user.nome}!`);
            }, 2000);
        } else {
            localStorage.removeItem('hyperSensesLoggedUser');
        }
    }
}

document.getElementById('forgotLink').addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Digite seu email cadastrado para recuperar a senha:');
    
    if (email) {
        if (!validateEmail(email)) {
            showFeedback('Email inválido!', 'error');
            return;
        }
        
        const usuario = usuarios.find(u => u.email === email);
        
        if (usuario) {
            showFeedback(`Um link de recuperação foi enviado para ${email}! (Simulação)`, 'success');
        } else {
            showFeedback('Email não encontrado! Faça o cadastro primeiro.', 'error');
        }
    }
});

checkSavedSession();

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        hideFeedback();
    });
});

if (usuarios.length === 0) {
    usuarios.push({
        id: 1,
        nome: "João Silva",
        matricula: "12345",
        email: "joao@hypersenses.com",
        telefone: "11999999999",
        senha: btoa("123456") 
    });
    localStorage.setItem('hyperSensesUsers', JSON.stringify(usuarios));
    console.log("Usuário de exemplo criado: Matrícula 12345, Senha 123456");
}