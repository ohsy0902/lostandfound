export function renderHeader(container, { isAdmin }) {
  const headerHtml = `
    <header class="glass-panel">
      <div class="logo-section">
        <h1>
          <span>Lost in 가온</span>
        </h1>
      </div>
      <div class="header-actions">
        ${
          isAdmin
            ? `
            <div class="admin-badge" title="게시물 수정 및 삭제가 가능합니다.">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              관리자 모드
            </div>
            `
            : ''
        }
      </div>
    </header>
  `;

  container.innerHTML = headerHtml;
}
