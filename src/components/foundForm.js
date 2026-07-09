import { fileToBase64, showToast } from '../utils.js';

/**
 * Renders and opens the Found Item registration / editing modal.
 * @param {Object} options 
 * @param {Object} [options.item] - Item data if editing, undefined if registering new
 * @param {Function} options.onSave - Callback when successfully saved
 */
export function openFoundFormModal({ item, onSave }) {
  const isEdit = !!item;
  
  // Create modal container
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  
  let base64Image = item?.image || '';

  backdrop.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${isEdit ? '습득물 정보 수정' : '신규 습득물 등록'}</h2>
        <button class="modal-close" id="close-modal-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="found-form">
          <div class="form-group">
            <label for="found-title">습득물명 *</label>
            <input type="text" id="found-title" class="form-control" placeholder="예: 갈색 가죽 지갑" required value="${item?.title || ''}">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="found-category">카테고리 *</label>
              <select id="found-category" class="form-control" required>
                <option value="가방" ${item?.category === '가방' ? 'selected' : ''}>가방</option>
                <option value="지갑" ${item?.category === '지갑' ? 'selected' : ''}>지갑</option>
                <option value="전자기기" ${item?.category === '전자기기' ? 'selected' : ''}>전자기기</option>
                <option value="패션잡화" ${item?.category === '패션잡화' ? 'selected' : ''}>패션잡화</option>
                <option value="도서" ${item?.category === '도서' ? 'selected' : ''}>도서</option>
                <option value="기타" ${item?.category === '기타' ? 'selected' : '' || !isEdit ? 'selected' : ''}>기타</option>
              </select>
            </div>
            <div class="form-group">
              <label for="found-date">습득 일자 *</label>
              <input type="date" id="found-date" class="form-control" required value="${item?.foundDate || new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="found-location">습득 장소 *</label>
              <input type="text" id="found-location" class="form-control" placeholder="예: 시청역 3번출구 부근" required value="${item?.foundLocation || ''}">
            </div>
            <div class="form-group">
              <label for="keep-location">보관 장소 *</label>
              <input type="text" id="keep-location" class="form-control" placeholder="예: 시청역 역무실" required value="${item?.keepLocation || ''}">
            </div>
          </div>

          ${isEdit ? `
            <div class="form-group">
              <label for="found-status">보관 상태 *</label>
              <select id="found-status" class="form-control" required>
                <option value="보관중" ${item.status === '보관중' ? 'selected' : ''}>보관중</option>
                <option value="찾아감" ${item.status === '찾아감' ? 'selected' : ''}>찾아감 (수령완료)</option>
              </select>
            </div>
          ` : ''}

          <div class="form-group">
            <label for="found-description">상세 설명</label>
            <textarea id="found-description" class="form-control" rows="4" placeholder="물건의 색상, 브랜드, 내용물 등 특징을 상세히 적어주세요.">${item?.description || ''}</textarea>
          </div>

          <div class="form-group">
            <label>습득물 사진</label>
            <div class="image-upload-area" id="image-upload-dropzone">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>클릭하여 사진 추가 (또는 파일 드래그)</span>
              <input type="file" id="found-image-file" accept="image/*" style="display: none;">
            </div>
            
            <div class="image-preview-container" id="image-preview-box" style="${base64Image ? 'display: block;' : ''}">
              <img id="image-preview" src="${base64Image}" alt="Preview">
              <button type="button" class="remove-img-btn" id="remove-image-btn">&times;</button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" id="cancel-modal-btn">취소</button>
        <button type="submit" form="found-form" class="btn btn-primary">${isEdit ? '저장하기' : '등록하기'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  // Trigger browser animation reflow
  setTimeout(() => backdrop.classList.add('show'), 10);

  // Setup Event Listeners
  const closeModal = () => {
    backdrop.classList.remove('show');
    setTimeout(() => backdrop.remove(), 300);
  };

  backdrop.querySelector('#close-modal-btn').addEventListener('click', closeModal);
  backdrop.querySelector('#cancel-modal-btn').addEventListener('click', closeModal);
  
  // Close on backdrop click (but not modal content)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Image Upload Logic
  const dropzone = backdrop.querySelector('#image-upload-dropzone');
  const fileInput = backdrop.querySelector('#found-image-file');
  const previewBox = backdrop.querySelector('#image-preview-box');
  const previewImg = backdrop.querySelector('#image-preview');
  const removeImgBtn = backdrop.querySelector('#remove-image-btn');

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

  // Drag and drop setup
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

  // Remove image logic
  removeImgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    base64Image = '';
    previewImg.src = '';
    previewBox.style.display = 'none';
    fileInput.value = '';
  });

  // Form Submit Logic
  const form = backdrop.querySelector('#found-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      title: form.querySelector('#found-title').value.trim(),
      category: form.querySelector('#found-category').value,
      foundDate: form.querySelector('#found-date').value,
      foundLocation: form.querySelector('#found-location').value.trim(),
      keepLocation: form.querySelector('#keep-location').value.trim(),
      description: form.querySelector('#found-description').value.trim(),
      image: base64Image
    };

    if (isEdit) {
      data.status = form.querySelector('#found-status').value;
    }

    onSave(data);
    closeModal();
  });
}
