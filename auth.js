// auth.js - Lógica de Autenticação

const AUTH_CONFIG = {
  LOGIN_KEY: 'medcof_logged',
  VALID_USER: 'plalencar',
  VALID_PASS: 'residencia2028'
};

// Verificar se o usuário está autenticado
function checkAuth() {
  return sessionStorage.getItem(AUTH_CONFIG.LOGIN_KEY) === 'true';
}

// Fazer login
function doLogin(user, pass) {
  if (user === AUTH_CONFIG.VALID_USER && pass === AUTH_CONFIG.VALID_PASS) {
    sessionStorage.setItem(AUTH_CONFIG.LOGIN_KEY, 'true');
    return true;
  }
  return false;
}

// Fazer logout
function doLogout() {
  sessionStorage.removeItem(AUTH_CONFIG.LOGIN_KEY);
}

// Mostrar tela de login
function showLogin() {
  const loginScreen = document.getElementById('loginScreen');
  const mainNav = document.getElementById('mainNav');
  const pageCronograma = document.getElementById('page-cronograma');
  
  if (loginScreen) loginScreen.classList.add('active');
  if (mainNav) mainNav.style.display = 'none';
  if (pageCronograma) pageCronograma.classList.remove('active');
  
  // Fechar página de dashboard se estiver aberta
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
}

// Mostrar interface principal
function showMain() {
  const loginScreen = document.getElementById('loginScreen');
  const mainNav = document.getElementById('mainNav');
  const pageCronograma = document.getElementById('page-cronograma');
  
  if (loginScreen) loginScreen.classList.remove('active');
  if (mainNav) mainNav.style.display = 'flex';
  if (pageCronograma) pageCronograma.classList.add('active');
}

// Inicializar autenticação na carga da página
function initAuth() {
  console.log('[AUTH] Verificando autenticação...');
  if (checkAuth()) {
    console.log('[AUTH] Usuário autenticado, mostrando interface principal');
    showMain();
    // Renderizar cronograma após mostrar
    setTimeout(() => {
      console.log('[AUTH] Renderizando cronograma...');
      if (typeof renderAll === 'function') {
        renderAll();
        console.log('[AUTH] Cronograma renderizado com sucesso');
      } else {
        console.error('[AUTH] Função renderAll não encontrada');
      }
    }, 100);
  } else {
    console.log('[AUTH] Usuário não autenticado, mostrando tela de login');
    showLogin();
  }
}

// Event listeners para login
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value;
      const errMsg = document.getElementById('loginError');

      if (doLogin(user, pass)) {
        errMsg.classList.remove('show');
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        showMain();
        // Renderizar cronograma após mostrar
        setTimeout(() => {
          if (typeof renderAll === 'function') {
            renderAll();
          }
        }, 50);
      } else {
        errMsg.textContent = 'Usuário ou senha incorretos';
        errMsg.classList.add('show');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (!confirm('Fazer logout?')) return;
      doLogout();
      showLogin();
    });
  }
}
