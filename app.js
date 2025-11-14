// Variáveis globais
let usersData = [];

// Função principal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializa a aplicação
function initializeApp() {
    // Carrega os dados da API
    fetchData();
    
    // Configura os event listeners
    setupEventListeners();
}

// Configura todos os event listeners
function setupEventListeners() {
    // Botão de atualizar
    document.getElementById('refreshBtn').addEventListener('click', fetchData);
    
    // Botão de filtrar
    document.getElementById('filterBtn').addEventListener('click', showFilterOptions);
    
    // Modal
    const modal = document.getElementById('userModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Função para buscar dados da API
async function fetchData() {
    const resultDiv = document.getElementById('result');
    
    try {
        // Mostra estado de carregamento
        resultDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Carregando dados da API...</p>
            </div>
        `;
        
        // Desabilita botões durante o carregamento
        setButtonsState(true);
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        usersData = await response.json();
        displayUsers(usersData);
        
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        showErrorState(error.message);
    } finally {
        // Reabilita os botões
        setButtonsState(false);
    }
}

// Função para exibir os usuários na página
function displayUsers(users) {
    const resultDiv = document.getElementById('result');
    
    if (users.length === 0) {
        resultDiv.innerHTML = `
            <div class="empty-state">
                <div class="icon">👥</div>
                <h3>Nenhum usuário encontrado</h3>
                <p>Tente atualizar os dados ou verificar sua conexão.</p>
            </div>
        `;
        return;
    }
    
    const usersGrid = document.createElement('div');
    usersGrid.className = 'users-grid';
    
    users.forEach(user => {
        const userCard = createUserCard(user);
        usersGrid.appendChild(userCard);
    });
    
    resultDiv.innerHTML = '';
    resultDiv.appendChild(usersGrid);
}

// Cria um card de usuário
function createUserCard(user) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    
    // Pega a primeira letra do nome para o avatar
    const avatarLetter = user.name.charAt(0).toUpperCase();
    
    userCard.innerHTML = `
        <div class="user-header">
            <div class="user-avatar">${avatarLetter}</div>
            <div>
                <div class="user-name">${user.name}</div>
                <div class="user-username">@${user.username}</div>
            </div>
        </div>
        
        <div class="user-info">
            <div class="info-item">
                <span class="info-icon">📧</span>
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">📱</span>
                <span class="info-label">Telefone:</span>
                <span class="info-value">${user.phone}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">🏢</span>
                <span class="info-label">Empresa:</span>
                <span class="info-value">${user.company.name}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">🌐</span>
                <span class="info-label">Website:</span>
                <span class="info-value">${user.website}</span>
            </div>
        </div>
        
        <div class="user-actions">
            <button class="action-btn view" onclick="viewUserDetails(${user.id})">
                Ver Detalhes
            </button>
            <button class="action-btn delete" onclick="deleteUser(${user.id})">
                Remover
            </button>
        </div>
    `;
    
    return userCard;
}

// Função para visualizar detalhes do usuário em um modal
function viewUserDetails(userId) {
    const user = usersData.find(u => u.id === userId);
    
    if (!user) {
        alert('Usuário não encontrado!');
        return;
    }
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; color: #2c3e50;">Detalhes do Usuário</h2>
        
        <div class="user-detail">
            <label>Nome Completo:</label>
            <span>${user.name}</span>
        </div>
        
        <div class="user-detail">
            <label>Nome de Usuário:</label>
            <span>@${user.username}</span>
        </div>
        
        <div class="user-detail">
            <label>Email:</label>
            <span>${user.email}</span>
        </div>
        
        <div class="user-detail">
            <label>Telefone:</label>
            <span>${user.phone}</span>
        </div>
        
        <div class="user-detail">
            <label>Website:</label>
            <span>${user.website}</span>
        </div>
        
        <div class="user-detail">
            <label>Empresa:</label>
            <span>${user.company.name}</span>
        </div>
        
        <div class="user-detail">
            <label>Slogan:</label>
            <span>"${user.company.bs}"</span>
        </div>
        
        <div class="user-detail">
            <label>Endereço:</label>
            <span>${user.address.street}, ${user.address.suite}, ${user.address.city} - ${user.address.zipcode}</span>
        </div>
        
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ecf0f1;">
            <small style="color: #7f8c8d;">ID do usuário: ${user.id}</small>
        </div>
    `;
    
    document.getElementById('userModal').style.display = 'block';
}

// Função para "remover" um usuário (apenas para demonstração)
function deleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    
    if (!user) return;
    
    if (confirm(`Tem certeza que deseja remover o usuário "${user.name}"?`)) {
        // Encontra e remove o card do usuário
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            const deleteBtn = card.querySelector('.action-btn.delete');
            if (deleteBtn && deleteBtn.getAttribute('onclick') === `deleteUser(${userId})`) {
                // Animação de remoção
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.remove();
                    
                    // Atualiza o array de dados
                    usersData = usersData.filter(u => u.id !== userId);
                    
                    // Se não houver mais usuários, mostra estado vazio
                    if (usersData.length === 0) {
                        displayUsers([]);
                    }
                }, 300);
            }
        });
        
        // Feedback visual
        showNotification(`Usuário "${user.name}" removido com sucesso!`, 'success');
    }
}

// Função para mostrar opções de filtro (exemplo simplificado)
function showFilterOptions() {
    const searchTerm = prompt('Digite o nome do usuário para filtrar:');
    
    if (searchTerm !== null) {
        const filteredUsers = usersData.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        displayUsers(filteredUsers);
        
        if (filteredUsers.length === 0) {
            showNotification('Nenhum usuário encontrado com esse nome.', 'info');
        }
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }
    
    document.body.appendChild(notification);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Função para mostrar estado de erro
function showErrorState(errorMessage) {
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = `
        <div class="error">
            <h3>Erro ao Carregar Dados</h3>
            <p>${errorMessage}</p>
            <button class="btn btn-primary" onclick="fetchData()">
                <span class="btn-icon">🔄</span>
                Tentar Novamente
            </button>
        </div>
    `;
}

// Função para controlar o estado dos botões
function setButtonsState(disabled) {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        if (disabled) {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

// Adiciona estilos CSS para animações dinâmicas
const dynamicStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
