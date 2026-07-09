/**
 * Masks contact numbers for privacy.
 * Example: "010-1234-5678" -> "010-****-5678"
 */
export function maskContact(contact) {
  if (!contact) return '';
  const cleaned = contact.replace(/[^0-9]/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-***-${cleaned.slice(6)}`;
  }
  return contact.replace(/(?<=.{3}).(?=.{3})/g, '*');
}

/**
 * Masks owner name for privacy.
 * Example: "김지현" -> "김*현", "홍길동" -> "홍*동"
 */
export function maskName(name) {
  if (!name) return '';
  if (name.length <= 2) {
    return name.charAt(0) + '*';
  }
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
}

/**
 * Converts a file object from input[type=file] to Base64 Data URL.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Formats ISO date string to a human-readable format.
 * Example: "2026-07-09T10:00:00.000Z" -> "2026. 07. 09. 10:00"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
}

/**
 * Shows a beautiful toast notification in the UI.
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation reflow
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300); // match transition duration
  }, 3000);
}
