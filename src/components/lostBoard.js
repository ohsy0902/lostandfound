import { maskContact, maskName, formatDate, showToast, fileToBase64 } from '../utils.js';

export function renderLostBoard(container, { items, isAdmin, onEdit, onDelete, onViewDetail, onOpenForm }) {
  let searchQuery = '';

  const renderTableRows = () => {
    const listContainer = container.querySelector('#lost-list-container');
    if (!listContainer) return;

    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lostLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>등록된 분실신고 내역이 없습니다.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(item => {
      // Masking contact & owner name if not admin
      const displayName = isAdmin ? item.ownerName : maskName(item.ownerName);
      const displayContact = isAdmin ? item.contact : maskContact(item.contact);

      return `
        <div class="lost-item-row glass-panel" data-id="${item.id}">
          <div class="lost-item-main">
            <span class="lost-item-title" data-id="${item.id}">${item.title}</span>
            <span class="lost-item-desc">${item.description}</span>
          </div>
          <div class="lost-item-meta">
            <span class="info-label" style="display: none;">분실자</span>${displayName}
          </div>
          <div class="lost-item-meta" title="${item.lostLocation}">
            <span class="info-label" style="display: none;">분실장소</span>${item.lostLocation}
          </div>
          <div class="lost-item-contact">
            ${displayContact}
          </div>
          <div class="lost-item-actions">
            ${isAdmin ? `
              <button class="btn btn-sm edit-lost-btn" data-id="${item.id}" title="수정">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>
              </button>
              <button class="btn btn-sm btn-danger delete-lost-btn" data-id="${item.id}" title="삭제">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            ` : ''}
            <button class="btn btn-sm btn-primary view-lost-btn" data-id="${item.id}">상세보기</button>
          </div>
        </div>
      `;
    }).join('');

    // Wire events
    listContainer.querySelectorAll('.view-lost-btn, .lost-item-title').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onViewDetail(el.dataset.id);
      });
    });

    if (isAdmin) {
      listContainer.querySelectorAll('.edit-lost-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onEdit(btn.dataset.id);
        });
      });

      listContainer.querySelectorAll('.delete-lost-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onDelete(btn.dataset.id);
        });
      });
    }
  };

  container.innerHTML = `
    <div class="panel-header">
      <h2 class="panel-title">분실물 게시판 (Lost Items Board)</h2>
      <button class="btn btn-primary" id="open-register-lost-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        분실신고 등록
      </button>
    </div>

    <!-- Search section -->
    <div class="filter-bar glass-panel" style="margin-bottom: 1.5rem;">
      <div class="search-input-wrapper" style="max-width: 400px;">
        <input type="text" class="form-control" id="lost-search-input" placeholder="분실물명, 분실장소, 분실자 검색..." />
      </div>
    </div>

    <!-- Board Headings -->
    <div class="lost-board-container">
      <div class="board-header-row">
        <div>분실물 정보</div>
        <div>분실자</div>
        <div>분실 장소</div>
        <div>연락처</div>
        <div style="text-align: right; padding-right: 2.5rem;">관리</div>
      </div>
      <div id="lost-list-container" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>
    </div>
  `;

  // Hook elements
  const searchInput = container.querySelector('#lost-search-input');
  const openFormBtn = container.querySelector('#open-register-lost-btn');

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTableRows();
  });

  openFormBtn.addEventListener('click', onOpenForm);

  renderTableRows();
}

/**
 * Renders and opens the Lost Item registration / editing modal.
 */
export function openLostFormModal({ item, onSave }) {
  const isEdit = !!item;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  backdrop.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${isEdit ? '분실물 신고 수정' : '분실한 물건 등록'}</h2>
        <button class="modal-close" id="close-lost-modal-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="lost-form">
          <div class="form-group">
            <label for="lost-title">분실물명 *</label>
            <input type="text" id="lost-title" class="form-control" placeholder="예: 무선 이어폰 본체" required value="${item?.title || ''}">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="lost-category">카테고리 *</label>
              <select id="lost-category" class="form-control" required>
                <option value="가방" ${item?.category === '가방' ? 'selected' : ''}>가방</option>
                <option value="지갑" ${item?.category === '지갑' ? 'selected' : ''}>지갑</option>
                <option value="전자기기" ${item?.category === '전자기기' ? 'selected' : ''}>전자기기</option>
                <option value="패션잡화" ${item?.category === '패션잡화' ? 'selected' : ''}>패션잡화</option>
                <option value="도서" ${item?.category === '도서' ? 'selected' : ''}>도서</option>
                <option value="기타" ${item?.category === '기타' ? 'selected' : '' || !isEdit ? 'selected' : ''}>기타</option>
              </select>
            </div>
            <div class="form-group">
              <label for="lost-date">분실 일자 *</label>
              <input type="date" id="lost-date" class="form-control" required value="${item?.lostDate || new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <div class="form-group">
            <label for="lost-location">분실 장소 *</label>
            <input type="text" id="lost-location" class="form-control" placeholder="예: 영등포역 지하철 안" required value="${item?.lostLocation || ''}">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="lost-owner">분실자 성명 *</label>
              <input type="text" id="lost-owner" class="form-control" placeholder="예: 홍길동" required value="${item?.ownerName || ''}">
            </div>
            <div class="form-group">
              <label for="lost-contact">연락처 *</label>
              <input type="tel" id="lost-contact" class="form-control" placeholder="예: 010-1234-5678" required pattern="[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}" value="${item?.contact || ''}">
              <small style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem; display: block;">포맷: 010-1234-5678</small>
            </div>
          </div>

          <div class="form-group">
            <label for="lost-description">상세 설명</label>
            <textarea id="lost-description" class="form-control" rows="4" placeholder="물건의 색상, 잃어버린 상황, 특징을 상세히 설명해 주세요.">${item?.description || ''}</textarea>
          </div>

          <div class="form-group">
            <label>분실물 사진 (선택)</label>
            <div class="image-upload-area" id="lost-image-upload-dropzone">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>클릭하여 사진 추가 (또는 파일 드래그)</span>
              <input type="file" id="lost-image-file" accept="image/*" style="display: none;">
            </div>
            
            <div class="image-preview-container" id="lost-image-preview-box" style="${item?.image ? 'display: block;' : ''}">
              <img id="lost-image-preview" src="${item?.image || ''}" alt="Preview">
              <button type="button" class="remove-img-btn" id="lost-remove-image-btn">&times;</button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" id="cancel-lost-modal-btn">취소</button>
        <button type="submit" form="lost-form" class="btn btn-primary">${isEdit ? '저장하기' : '등록하기'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  setTimeout(() => backdrop.classList.add('show'), 10);

  const closeModal = () => {
    backdrop.classList.remove('show');
    setTimeout(() => backdrop.remove(), 300);
  };

  backdrop.querySelector('#close-lost-modal-btn').addEventListener('click', closeModal);
  backdrop.querySelector('#cancel-lost-modal-btn').addEventListener('click', closeModal);
  
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Image Upload Logic
  let base64Image = item?.image || '';
  const dropzone = backdrop.querySelector('#lost-image-upload-dropzone');
  const fileInput = backdrop.querySelector('#lost-image-file');
  const previewBox = backdrop.querySelector('#lost-image-preview-box');
  const previewImg = backdrop.querySelector('#lost-image-preview');
  const removeImgBtn = backdrop.querySelector('#lost-remove-image-btn');

  dropzone.addEventListener('click', () => fileInput.click());

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일만 업로드할 수 있습니다.', 'error');
      return;
    }

    try {
      base64Image = await fileToBase64(file);
      previewImg.src = base64Image;
      previewBox.style.display = 'block';
    } catch (err) {
      console.error(err);
      showToast('이미지 파일 변환에 실패했습니다.', 'error');
    }
  };

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--accent)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--border-color)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  removeImgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    base64Image = '';
    previewImg.src = '';
    previewBox.style.display = 'none';
    fileInput.value = '';
  });

  const form = backdrop.querySelector('#lost-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      title: form.querySelector('#lost-title').value.trim(),
      category: form.querySelector('#lost-category').value,
      lostDate: form.querySelector('#lost-date').value,
      lostLocation: form.querySelector('#lost-location').value.trim(),
      ownerName: form.querySelector('#lost-owner').value.trim(),
      contact: form.querySelector('#lost-contact').value.trim(),
      description: form.querySelector('#lost-description').value.trim(),
      image: base64Image
    };

    onSave(data);
    closeModal();
  });
}
