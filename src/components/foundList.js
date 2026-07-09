import { formatDate } from '../utils.js';

const ITEMS_PER_PAGE = 6;

export function renderFoundList(container, { items, isAdmin, onEdit, onDelete, onViewDetail, onOpenForm }) {
  // Setup filters state
  let searchQuery = '';
  let selectedCategory = '';
  let selectedStatus = '';
  let currentPage = 1;

  const renderCards = () => {
    const grid = container.querySelector('#found-cards-grid');
    const paginationContainer = container.querySelector('#found-pagination');
    if (!grid) return;

    // Filter items
    const filtered = items.filter(item => {
      const matchSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.foundLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchStatus = selectedStatus === '' || item.status === selectedStatus;
      
      return matchSearch && matchCategory && matchStatus;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paged = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>검색 조건에 맞는 습득물이 없습니다.</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    grid.innerHTML = paged.map(item => {
      const statusBadgeClass = item.status === '보관중' ? 'badge-status-keep' : 'badge-status-claimed';
      
      // Use loaded Base64 image or modern SVG fallback
      const imageTag = item.image 
        ? `<img src="${item.image}" alt="${item.title}" class="card-image" loading="lazy" />`
        : `
          <div class="svg-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>No Image</span>
          </div>
        `;

      return `
        <div class="item-card glass-panel" data-id="${item.id}">
          <div class="card-image-wrapper">
            ${imageTag}
            <span class="card-badge ${statusBadgeClass}">${item.status}</span>
            <span class="card-category">${item.category}</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">${item.title}</h3>
            <ul class="card-info-list">
              <li class="card-info-item">
                <span class="info-label">습득 일자</span>
                <span class="info-value">${item.foundDate}</span>
              </li>
              <li class="card-info-item">
                <span class="info-label">습득 장소</span>
                <span class="info-value" title="${item.foundLocation}">${item.foundLocation}</span>
              </li>
              <li class="card-info-item">
                <span class="info-label">보관 장소</span>
                <span class="info-value" title="${item.keepLocation}">${item.keepLocation}</span>
              </li>
            </ul>
            <div class="card-footer">
              <span class="card-date">${formatDate(item.createdAt)}</span>
              <div class="card-actions">
                ${isAdmin ? `
                  <button class="btn btn-sm edit-btn" data-id="${item.id}" title="수정">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>
                  </button>
                  <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}" title="삭제">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                ` : ''}
                <button class="btn btn-sm btn-primary view-btn" data-id="${item.id}">상세보기</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach actions event listeners
    grid.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onViewDetail(btn.dataset.id);
      });
    });

    if (isAdmin) {
      grid.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onEdit(btn.dataset.id);
        });
      });

      grid.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onDelete(btn.dataset.id);
        });
      });
    }

    // Render pagination
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
      }

      let paginationHtml = `
        <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      `;

      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }

      paginationHtml += `
        <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      `;

      paginationContainer.innerHTML = paginationHtml;

      paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const page = btn.dataset.page;
          if (page === 'prev' && currentPage > 1) {
            currentPage--;
          } else if (page === 'next' && currentPage < totalPages) {
            currentPage++;
          } else if (page !== 'prev' && page !== 'next') {
            currentPage = parseInt(page);
          }
          renderCards();
        });
      });
    }
  };

  // Render container structure
  container.innerHTML = `
    <div class="panel-header">
      <h2 class="panel-title">습득물 센터 (Found Items)</h2>
      <button class="btn btn-primary" id="open-register-found-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        습득물 등록
      </button>
    </div>

    <!-- Filter section -->
    <div class="filter-bar glass-panel">
      <div class="search-input-wrapper">
        <input type="text" class="form-control" id="found-search-input" placeholder="습득물명, 습득장소, 내용 검색..." />
      </div>
      <select class="form-control filter-select" id="found-category-filter">
        <option value="">전체 카테고리</option>
        <option value="가방">가방</option>
        <option value="지갑">지갑</option>
        <option value="전자기기">전자기기</option>
        <option value="패션잡화">패션잡화</option>
        <option value="도서">도서</option>
        <option value="기타">기타</option>
      </select>
      <select class="form-control filter-select" id="found-status-filter">
        <option value="">전체 상태</option>
        <option value="보관중">보관중</option>
        <option value="찾아감">찾아감</option>
      </select>
    </div>

    <!-- Cards container -->
    <div class="cards-grid" id="found-cards-grid"></div>

    <!-- Pagination -->
    <div class="pagination" id="found-pagination"></div>
  `;

  // Filter event listeners
  const searchInput = container.querySelector('#found-search-input');
  const categoryFilter = container.querySelector('#found-category-filter');
  const statusFilter = container.querySelector('#found-status-filter');
  const openFormBtn = container.querySelector('#open-register-found-btn');

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    renderCards();
  });

  categoryFilter.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    currentPage = 1;
    renderCards();
  });

  statusFilter.addEventListener('change', (e) => {
    selectedStatus = e.target.value;
    currentPage = 1;
    renderCards();
  });

  openFormBtn.addEventListener('click', onOpenForm);

  // Initial draw
  renderCards();
}
