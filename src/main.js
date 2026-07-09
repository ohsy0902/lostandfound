import './style.css';
import { initDB, FoundStore, LostStore, AdminAuth } from './storage.js';
import { renderHeader } from './components/header.js';
import { renderFoundList } from './components/foundList.js';
import { openFoundFormModal } from './components/foundForm.js';
import { renderLostBoard, openLostFormModal } from './components/lostBoard.js';
import { showToast, formatDate, maskContact, maskName } from './utils.js';

// Application State
const state = {
  currentTab: 'found', // 'found' or 'lost'
  isAdmin: AdminAuth.isAdmin()
};

// DOM Container Elements
let headerContainer;
let navContainer;
let contentContainer;

// Initialize Application
function init() {
  // 1. Initialize Mock Database
  initDB();

  // 2. Setup dynamic container elements in index.html
  const appRoot = document.getElementById('app');
  appRoot.innerHTML = `
    <div id="header-container"></div>
    <nav class="tabs-navigation" id="tabs-nav-container"></nav>
    <main id="tab-content-container"></main>
  `;

  headerContainer = document.getElementById('header-container');
  navContainer = document.getElementById('tabs-nav-container');
  contentContainer = document.getElementById('tab-content-container');

  // 4. Handle hidden admin auth via URL query parameter
  handleUrlAuth();

  // 5. Expose secret admin commands to window for browser developer tools console
  exposeConsoleCommands();

  // 6. Draw UI
  renderAll();
  
  // Console logging information for secret access
  console.log(
    `%c[경찰청 민원24 유실물 포털]%c 관리자 권한을 활성화하려면 개발자 콘솔에 아래 명령어를 입력하거나 URL 쿼리 파라미터를 사용하세요:\n` +
    `  - 콘솔 입력: %cauthAdmin("police_secret_2026")%c\n` +
    `  - 콘솔 로그아웃: %cclearAdmin()%c\n` +
    `  - URL 접속: %chttp://localhost:5173/?admin=police_secret_2026`,
    'color: #00b4d8; font-weight: bold; font-size: 13px;',
    'color: inherit;',
    'color: #ef4444; font-family: monospace; font-weight: bold; background: rgba(239,68,68,0.1); padding: 2px 4px; border-radius: 4px;',
    'color: inherit;',
    'color: #94a3b8; font-family: monospace; font-weight: bold;',
    'color: inherit;',
    'color: #10b981; font-family: monospace; font-weight: bold;'
  );
}

// ----------------------------------------------------
// Admin Auth & Secret Console Commands
// ----------------------------------------------------
function handleUrlAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const adminKey = urlParams.get('admin');
  
  if (adminKey) {
    const success = AdminAuth.authenticate(adminKey);
    if (success) {
      state.isAdmin = true;
      showToast('관리자 인증에 성공했습니다. 수정 및 삭제 권한이 활성화됩니다.', 'success');
      
      // Clean query parameters from URL without reloading
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    } else {
      showToast('잘못된 관리자 인증 키입니다.', 'error');
    }
  }
}

function exposeConsoleCommands() {
  window.authAdmin = (secretKey) => {
    const success = AdminAuth.authenticate(secretKey);
    if (success) {
      state.isAdmin = true;
      showToast('관리자 모드가 활성화되었습니다.', 'success');
      renderAll();
      return '인증 완료. 관리자 모드 활성화됨.';
    } else {
      showToast('인증 실패: 잘못된 시크릿 키입니다.', 'error');
      return '인증 실패. 잘못된 키입니다.';
    }
  };

  window.clearAdmin = () => {
    AdminAuth.logout();
    state.isAdmin = false;
    showToast('관리자 모드가 비활성화되었습니다.', 'info');
    renderAll();
    return '로그아웃 완료. 일반 사용자 모드.';
  };
}

// ----------------------------------------------------
// Rendering Controllers
// ----------------------------------------------------
function renderAll() {
  renderHeaderComponent();
  renderNavigationComponent();
  renderTabContent();
}

function renderHeaderComponent() {
  renderHeader(headerContainer, {
    isAdmin: state.isAdmin
  });
}

function renderNavigationComponent() {
  navContainer.innerHTML = `
    <button class="tab-trigger ${state.currentTab === 'found' ? 'active' : ''}" data-tab="found">습득물 포털</button>
    <button class="tab-trigger ${state.currentTab === 'lost' ? 'active' : ''}" data-tab="lost">분실물 게시판</button>
  `;

  navContainer.querySelectorAll('.tab-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      if (state.currentTab !== targetTab) {
        state.currentTab = targetTab;
        renderNavigationComponent();
        renderTabContent();
      }
    });
  });
}

function renderTabContent() {
  contentContainer.innerHTML = ''; // reset content

  if (state.currentTab === 'found') {
    renderFoundList(contentContainer, {
      items: FoundStore.getAll(),
      isAdmin: state.isAdmin,
      onOpenForm: () => {
        openFoundFormModal({
          onSave: (data) => {
            FoundStore.create(data);
            showToast('습득물이 정상적으로 등록되었습니다.', 'success');
            renderTabContent(); // Refresh view
          }
        });
      },
      onEdit: (id) => {
        const item = FoundStore.getById(id);
        if (!item) return;
        openFoundFormModal({
          item,
          onSave: (updatedData) => {
            FoundStore.update(id, updatedData);
            showToast('습득물 정보가 수정되었습니다.', 'success');
            renderTabContent();
          }
        });
      },
      onDelete: (id) => {
        if (confirm('이 습득물 등록 게시글을 정말 삭제하시겠습니까?')) {
          FoundStore.delete(id);
          showToast('성공적으로 삭제되었습니다.', 'success');
          renderTabContent();
        }
      },
      onViewDetail: (id) => {
        const item = FoundStore.getById(id);
        openDetailModal('found', item);
      }
    });
  } else {
    renderLostBoard(contentContainer, {
      items: LostStore.getAll(),
      isAdmin: state.isAdmin,
      onOpenForm: () => {
        openLostFormModal({
          onSave: (data) => {
            LostStore.create(data);
            showToast('분실신고가 등록되었습니다.', 'success');
            renderTabContent();
          }
        });
      },
      onEdit: (id) => {
        const item = LostStore.getById(id);
        if (!item) return;
        openLostFormModal({
          item,
          onSave: (updatedData) => {
            LostStore.update(id, updatedData);
            showToast('분실물 정보가 수정되었습니다.', 'success');
            renderTabContent();
          }
        });
      },
      onDelete: (id) => {
        if (confirm('이 분실물 신고 게시글을 정말 삭제하시겠습니까?')) {
          LostStore.delete(id);
          showToast('성공적으로 삭제되었습니다.', 'success');
          renderTabContent();
        }
      },
      onViewDetail: (id) => {
        const item = LostStore.getById(id);
        openDetailModal('lost', item);
      }
    });
  }
}

// ----------------------------------------------------
// Detail Modal View Component
// ----------------------------------------------------
function openDetailModal(type, item) {
  if (!item) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const isFound = type === 'found';
  
  // Dynamic contents for Detail Modal
  const infoGridHtml = isFound 
    ? `
      <div class="detail-grid">
        <div class="detail-info-box">
          <div class="detail-label">카테고리</div>
          <div class="detail-value">${item.category}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-label">보관 상태</div>
          <div class="detail-value" style="color: ${item.status === '보관중' ? 'var(--success)' : 'var(--text-muted)'}">${item.status}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-label">습득 일자</div>
          <div class="detail-value">${item.foundDate}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-label">습득 장소</div>
          <div class="detail-value">${item.foundLocation}</div>
        </div>
        <div class="detail-info-box" style="grid-column: span 2;">
          <div class="detail-label">보관 장소</div>
          <div class="detail-value">${item.keepLocation}</div>
        </div>
        <div class="detail-info-box detail-desc-box">
          <div class="detail-label">상세 특징 및 설명</div>
          <div class="detail-value" style="font-weight: normal; white-space: pre-wrap;">${item.description || '상세 설명이 없습니다.'}</div>
        </div>
      </div>
    `
    : `
      <div class="detail-grid">
        <div class="detail-info-box">
          <div class="detail-label">카테고리</div>
          <div class="detail-value">${item.category}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-label">분실 일자</div>
          <div class="detail-value">${item.lostDate}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-label">분실자</div>
          <div class="detail-value">${state.isAdmin ? item.ownerName : maskName(item.ownerName)}</div>
        </div>
        <div class="detail-info-box">
          <div class="detail-label">연락처</div>
          <div class="detail-value" style="color: var(--accent);">${state.isAdmin ? item.contact : maskContact(item.contact)}</div>
        </div>
        <div class="detail-info-box" style="grid-column: span 2;">
          <div class="detail-label">분실 장소</div>
          <div class="detail-value">${item.lostLocation}</div>
        </div>
        <div class="detail-info-box detail-desc-box">
          <div class="detail-label">상세 특징 및 분실 경위</div>
          <div class="detail-value" style="font-weight: normal; white-space: pre-wrap;">${item.description || '상세 설명이 없습니다.'}</div>
        </div>
      </div>
    `;

  const imageSectionHtml = (isFound && item.image) 
    ? `
      <div class="detail-img-wrapper">
        <img src="${item.image}" alt="${item.title}">
      </div>
    `
    : '';

  backdrop.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${isFound ? '습득물 상세 조회' : '분실물 신고 상세'}</h2>
        <button class="modal-close" id="close-detail-modal-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="detail-view">
          <h3 style="font-size: 1.4rem; font-family: var(--font-title); margin-bottom: 0.5rem;">${item.title}</h3>
          
          ${imageSectionHtml}
          ${infoGridHtml}
        </div>
      </div>
      <div class="modal-footer">
        <span style="font-size: 0.75rem; color: var(--text-muted); margin-right: auto;">
          등록 일시: ${formatDate(item.createdAt)}
        </span>
        <button type="button" class="btn btn-primary" id="confirm-detail-modal-btn">닫기</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  setTimeout(() => backdrop.classList.add('show'), 10);

  const closeModal = () => {
    backdrop.classList.remove('show');
    setTimeout(() => backdrop.remove(), 300);
  };

  backdrop.querySelector('#close-detail-modal-btn').addEventListener('click', closeModal);
  backdrop.querySelector('#confirm-detail-modal-btn').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });
}

// Bootstrapping the app
document.addEventListener('DOMContentLoaded', init);
