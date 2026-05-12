const usuarioLogado = JSON.parse(localStorage.getItem('hyperSensesLoggedUser'));

if (!usuarioLogado) {
     window.location.href = 'index.html';
}

let ocorrencias = JSON.parse(localStorage.getItem('hyperSensesOcorrencias')) || [];
let statusTrilho = JSON.parse(localStorage.getItem('hyperSensesStatusTrilho')) || {
    status: 'normal',
    problema: '',
    local: '',
    ultimaAtualizacao: new Date().toISOString()
};
let localizacaoTrem = JSON.parse(localStorage.getItem('hyperSensesLocalizacaoTrem')) || {
    km: '156,8',
    proximaEstacao: 'Estação Central',
    velocidade: 85,
    sentido: 'Norte',
    ultimaAtualizacao: new Date().toISOString()
};

document.getElementById('userName').textContent = usuarioLogado.nome;
document.getElementById('userMatricula').textContent = `Mat: ${usuarioLogado.matricula}`;

function atualizarDisplayStatus() {
  
    const trilhoStatusElement = document.getElementById('trilhoStatus');
    if (trilhoStatusElement) {
        trilhoStatusElement.textContent = statusTrilho.status === 'normal' ? '✅ Normal' : '⚠️ Anormal';
        trilhoStatusElement.style.color = statusTrilho.status === 'normal' ? '#4caf50' : '#f44336';
    }
    
    document.getElementById('tremLocalizacao').textContent = `KM ${localizacaoTrem.km}`;
    document.getElementById('tremVelocidade').textContent = `${localizacaoTrem.velocidade} km/h`;
}

function carregarListaOcorrencias() {
    const listaElement = document.getElementById('listaOcorrencias');
    
    if (ocorrencias.length === 0) {
        listaElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma ocorrência registrada ainda</p>
            </div>
        `;
        return;
    }
    
    const ocorrenciasOrdenadas = [...ocorrencias].reverse();
    
    listaElement.innerHTML = ocorrenciasOrdenadas.map(occ => {
        const data = new Date(occ.data);
        const dataFormatada = data.toLocaleString('pt-BR');
        
        let gravidadeClass = '';
        if (occ.gravidade === 'baixa') gravidadeClass = 'gravidade-baixa';
        else if (occ.gravidade === 'media') gravidadeClass = 'gravidade-media';
        else if (occ.gravidade === 'alta') gravidadeClass = 'gravidade-alta';
        
        let tipoClass = '';
        if (occ.tipo === 'acidente') tipoClass = 'acidente';
        else if (occ.tipo === 'quase-acidente') tipoClass = 'quase-acidente';
        else if (occ.tipo === 'falha-tecnica') tipoClass = 'falha-tecnica';
        
        const tipoLabel = {
            'acidente': '🚨 Acidente',
            'quase-acidente': '⚠️ Quase Acidente',
            'falha-tecnica': '🔧 Falha Técnica',
            'obstrucao': '🚧 Obstrução na Via',
            'outro': '📝 Outro'
        }[occ.tipo] || occ.tipo;
        
        return `
            <div class="ocorrencia-item ${tipoClass}">
                <div class="ocorrencia-header">
                    <span class="ocorrencia-tipo">${tipoLabel}</span>
                    <span class="ocorrencia-data">${dataFormatada}</span>
                </div>
                <div class="ocorrencia-local">
                    <i class="fas fa-map-marker-alt"></i> ${occ.localizacao}
                </div>
                <div class="ocorrencia-descricao">
                    ${occ.descricao}
                </div>
                <div class="gravidade-${occ.gravidade}" style="margin-top: 5px; font-size: 12px;">
                    <i class="fas fa-flag"></i> Gravidade: ${occ.gravidade.toUpperCase()}
                </div>
            </div>
        `;
    }).join('');
}

function atualizarEstatisticas() {
    const totalAcidentes = ocorrencias.filter(occ => occ.tipo === 'acidente').length;
    const totalAlertas = ocorrencias.filter(occ => occ.gravidade === 'alta' || occ.tipo === 'acidente').length;
    const trilhosNormais = statusTrilho.status === 'normal' ? 100 : 0;
    
    document.getElementById('totalAcidentes').textContent = totalAcidentes;
    document.getElementById('totalAlertas').textContent = totalAlertas;
    document.getElementById('trilhosNormais').textContent = `${trilhosNormais}%`;
}

document.getElementById('ocorrenciaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tipo = document.getElementById('tipoOcorrencia').value;
    const localizacao = document.getElementById('localizacaoOcorrencia').value;
    const descricao = document.getElementById('descricaoOcorrencia').value;
    const gravidade = document.getElementById('gravidade').value;
    
    const novaOcorrencia = {
        id: Date.now(),
        tipo,
        localizacao,
        descricao,
        gravidade,
        data: new Date().toISOString(),
        registradoPor: usuarioLogado.nome,
        matricula: usuarioLogado.matricula
    };
    
    ocorrencias.push(novaOcorrencia);
    localStorage.setItem('hyperSensesOcorrencias', JSON.stringify(ocorrencias));
    
    e.target.reset();
    
    carregarListaOcorrencias();
    
    alert('✅ Ocorrência registrada com sucesso!');
});

document.getElementById('trilhoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const status = document.querySelector('input[name="statusTrilho"]:checked').value;
    const problema = document.getElementById('problemaTrilho').value;
    const local = document.getElementById('localTrilho').value;
    
    statusTrilho = {
        status,
        problema: status === 'anormal' ? problema : '',
        local,
        ultimaAtualizacao: new Date().toISOString(),
        atualizadoPor: usuarioLogado.nome
    };
    
    localStorage.setItem('hyperSensesStatusTrilho', JSON.stringify(statusTrilho));
    atualizarDisplayStatus();
    
    alert(`✅ Status do trilho atualizado: ${status === 'normal' ? 'Normal' : 'Anormal'}`);
    
    if (status === 'anormal' && problema) {
        const ocorrenciaAutomatica = {
            id: Date.now(),
            tipo: 'falha-tecnica',
            localizacao: local || 'Não especificado',
            descricao: `Problema nos trilhos: ${problema}`,
            gravidade: 'alta',
            data: new Date().toISOString(),
            registradoPor: usuarioLogado.nome,
            automatica: true
        };
        ocorrencias.push(ocorrenciaAutomatica);
        localStorage.setItem('hyperSensesOcorrencias', JSON.stringify(ocorrencias));
        carregarListaOcorrencias();
    }
});

document.querySelectorAll('input[name="statusTrilho"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const problemaGroup = document.getElementById('problemaTrilhoGroup');
        if (e.target.value === 'anormal') {
            problemaGroup.style.display = 'block';
        } else {
            problemaGroup.style.display = 'none';
        }
    });
});

document.getElementById('tremForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const km = document.getElementById('kmAtual').value;
    const proximaEstacao = document.getElementById('proximaEstacao').value;
    const velocidade = document.getElementById('velocidade').value;
    const sentido = document.getElementById('sentido').value;
    
    localizacaoTrem = {
        km,
        proximaEstacao,
        velocidade: velocidade || localizacaoTrem.velocidade,
        sentido,
        ultimaAtualizacao: new Date().toISOString(),
        atualizadoPor: usuarioLogado.nome
    };
    
    localStorage.setItem('hyperSensesLocalizacaoTrem', JSON.stringify(localizacaoTrem));
    atualizarDisplayStatus();
    
    alert('✅ Localização do trem atualizada!');
});

document.getElementById('limparHistorico').addEventListener('click', () => {
    if (confirm('⚠️ Tem certeza que deseja limpar todo o histórico de ocorrências? Esta ação não pode ser desfeita!')) {
        ocorrencias = [];
        localStorage.setItem('hyperSensesOcorrencias', JSON.stringify(ocorrencias));
        carregarListaOcorrencias();
        alert('✅ Histórico limpo com sucesso!');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('hyperSensesLoggedUser');
    window.location.href = 'index.html';
});

atualizarDisplayStatus();
carregarListaOcorrencias();

setInterval(() => {
    ocorrencias = JSON.parse(localStorage.getItem('hyperSensesOcorrencias')) || [];
    statusTrilho = JSON.parse(localStorage.getItem('hyperSensesStatusTrilho')) || statusTrilho;
    localizacaoTrem = JSON.parse(localStorage.getItem('hyperSensesLocalizacaoTrem')) || localizacaoTrem;
    
    atualizarDisplayStatus();
    carregarListaOcorrencias();
}, 5000);