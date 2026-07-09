// LocalStorage Key Constants
const STORAGE_KEYS = {
  FOUND_ITEMS: 'gaon_found_items',
  LOST_ITEMS: 'gaon_lost_items',
  ADMIN_AUTH: 'gaon_admin_auth'
};

// Initial Dummy Data - 가온고등학교 맥락
const DUMMY_FOUND_ITEMS = [
  {
    id: 'f-1',
    title: '에어팟 프로 2세대 (흰색)',
    category: '전자기기',
    foundDate: '2026-07-09',
    foundLocation: '본관 2층 2-3반 교실',
    keepLocation: '2학년 교무실',
    status: '보관중',
    description: '에어팟 프로 2세대 충전 케이스와 양쪽 유닛 모두 있습니다. 케이스에 보라색 실리콘 커버가 씌워져 있고, 뒷면에 작은 곰돌이 키링이 달려있습니다.',
    image: './images/airpods.png',
    createdAt: new Date('2026-07-09T15:30:00').toISOString()
  },
  {
    id: 'f-2',
    title: '갈색 가죽 반지갑',
    category: '지갑',
    foundDate: '2026-07-09',
    foundLocation: '본관 1층 급식실 앞 복도',
    keepLocation: '제1 교무실',
    status: '보관중',
    description: '갈색 가죽 남성용 반지갑입니다. 내부에 학생증과 교통카드가 들어있습니다. 지갑 안쪽에 이니셜 자수가 있습니다.',
    image: './images/wallet.png',
    createdAt: new Date('2026-07-09T12:20:00').toISOString()
  },
  {
    id: 'f-3',
    title: '남색 체육복 상의 (L)',
    category: '패션잡화',
    foundDate: '2026-07-08',
    foundLocation: '체육관 남자 탈의실',
    keepLocation: '1학년 교무실',
    status: '보관중',
    description: '가온고 남색 체육복 상의(긴팔)입니다. 사이즈 L이며, 옷 안쪽 이름표에 이름이 적혀있으나 흐려서 판독이 어렵습니다.',
    image: './images/gym_uniform.png',
    createdAt: new Date('2026-07-08T17:10:00').toISOString()
  },
  {
    id: 'f-4',
    title: '스테인리스 텀블러 (실버)',
    category: '기타',
    foundDate: '2026-07-08',
    foundLocation: '신관 2층 디미과 2-1반 교실',
    keepLocation: '디미과 교무실',
    status: '보관중',
    description: '은색 스테인리스 보온 텀블러입니다. 용량 500ml 정도이며, 뚜껑에 작은 스크래치가 있습니다. 내부에 음료가 남아있었습니다.',
    image: './images/tumbler.png',
    createdAt: new Date('2026-07-08T14:45:00').toISOString()
  },
  {
    id: 'f-5',
    title: 'USB 메모리 (32GB, 검정)',
    category: '전자기기',
    foundDate: '2026-07-07',
    foundLocation: '본관 3층 컴퓨터실',
    keepLocation: '3학년 교무실',
    status: '보관중',
    description: '검정색 USB 메모리 32GB입니다. 컴퓨터실 3번 PC에 꽂혀있었습니다. 내부에 학교 과제 파일들이 저장되어 있는 것으로 보입니다.',
    image: './images/usb.png',
    createdAt: new Date('2026-07-07T16:30:00').toISOString()
  },
  {
    id: 'f-6',
    title: '접이식 우산 (남색)',
    category: '패션잡화',
    foundDate: '2026-07-07',
    foundLocation: '본관 1층 현관 우산꽂이',
    keepLocation: '제2 교무실',
    status: '보관중',
    description: '남색 3단 접이식 우산입니다. 손잡이에 투명 비닐 커버가 붙어있고, 우산 끈에 이름표가 있으나 지워져 있습니다.',
    image: './images/umbrella.png',
    createdAt: new Date('2026-07-07T08:50:00').toISOString()
  },
  {
    id: 'f-7',
    title: '학생증 (가온고등학교)',
    category: '기타',
    foundDate: '2026-07-06',
    foundLocation: '미술센터 1층 로비',
    keepLocation: '제1 교무실',
    status: '찾아감',
    description: '가온고등학교 학생증입니다. 2학년 학생 소유로 확인되어 본인에게 전달 완료하였습니다.',
    image: './images/student_id.png',
    createdAt: new Date('2026-07-06T11:15:00').toISOString()
  },
  {
    id: 'f-8',
    title: '금테 안경 + 안경케이스',
    category: '패션잡화',
    foundDate: '2026-07-06',
    foundLocation: '본관 3층 3-5반 교실 책상 위',
    keepLocation: '3학년 교무실',
    status: '보관중',
    description: '얇은 금테 라운드 안경과 갈색 하드 안경케이스입니다. 렌즈에 도수가 있으며, 케이스에 안경닦이 천도 함께 들어있습니다.',
    image: './images/glasses.png',
    createdAt: new Date('2026-07-06T09:40:00').toISOString()
  },
  {
    id: 'f-9',
    title: '보조배터리 (흰색, 10000mAh)',
    category: '전자기기',
    foundDate: '2026-07-05',
    foundLocation: '신관 1층 디미과 1-2반 교실',
    keepLocation: '디미과 교무실',
    status: '보관중',
    description: '흰색 보조배터리 10000mAh 용량입니다. C타입 충전 케이블이 함께 있었습니다. 뒷면에 스티커 자국이 있습니다.',
    image: '',
    createdAt: new Date('2026-07-05T15:20:00').toISOString()
  },
  {
    id: 'f-10',
    title: '수학 교과서 (수학Ⅱ)',
    category: '도서',
    foundDate: '2026-07-05',
    foundLocation: '본관 2층 2-7반 교실',
    keepLocation: '2학년 교무실',
    status: '보관중',
    description: '수학Ⅱ 교과서입니다. 표지에 반과 이름이 적혀있으나 수정테이프로 지워져 있습니다. 내부에 프린트물 여러 장이 끼워져 있습니다.',
    image: '',
    createdAt: new Date('2026-07-05T10:00:00').toISOString()
  }
];

const DUMMY_LOST_ITEMS = [
  {
    id: 'l-1',
    title: '갤럭시 버즈 2 프로 (흰색)',
    category: '전자기기',
    lostDate: '2026-07-09',
    lostLocation: '본관 1층 1-3반 교실',
    contact: '010-1234-5678',
    ownerName: '김도윤',
    description: '흰색 갤럭시 버즈 2 프로입니다. 충전 케이스에 검은색 실리콘 커버가 씌워져 있습니다. 5교시 끝나고 잃어버린 것 같습니다.',
    createdAt: new Date('2026-07-09T16:00:00').toISOString()
  },
  {
    id: 'l-2',
    title: '검은색 후드집업 (나이키)',
    category: '패션잡화',
    lostDate: '2026-07-09',
    lostLocation: '체육관 또는 본관 2층 2-1반 교실',
    contact: '010-9876-5432',
    ownerName: '박서연',
    description: '나이키 검정 후드집업(M사이즈)입니다. 지퍼 끝에 은색 나이키 로고가 있습니다. 체육 수업 후 잃어버린 것 같습니다.',
    createdAt: new Date('2026-07-09T14:30:00').toISOString()
  },
  {
    id: 'l-3',
    title: '투명 케이스 아이폰 15',
    category: '전자기기',
    lostDate: '2026-07-08',
    lostLocation: '본관 3층 3-2반 교실 또는 복도',
    contact: '010-5555-1234',
    ownerName: '이하준',
    description: '아이폰 15 (블루) 투명 케이스에 포토카드 한 장이 끼워져 있습니다. 잠금화면은 고양이 사진입니다.',
    createdAt: new Date('2026-07-08T17:30:00').toISOString()
  },
  {
    id: 'l-4',
    title: '파란색 필통 (이스트팩)',
    category: '기타',
    lostDate: '2026-07-08',
    lostLocation: '본관 2층 2-6반 교실',
    contact: '010-3333-4444',
    ownerName: '최은서',
    description: '네이비 이스트팩 필통입니다. 내부에 검정 볼펜 3자루, 샤프 2자루, 형광펜 세트가 들어있습니다.',
    createdAt: new Date('2026-07-08T13:00:00').toISOString()
  },
  {
    id: 'l-5',
    title: '실내화 (흰색, 250mm)',
    category: '패션잡화',
    lostDate: '2026-07-07',
    lostLocation: '본관 1층 신발장 부근',
    contact: '010-7777-8888',
    ownerName: '정민재',
    description: '흰색 실내화 250mm입니다. 왼쪽 신발 뒤꿈치에 이름이 매직으로 적혀있습니다.',
    createdAt: new Date('2026-07-07T15:45:00').toISOString()
  },
  {
    id: 'l-6',
    title: '영어 단어장 (수능 VOCA)',
    category: '도서',
    lostDate: '2026-07-07',
    lostLocation: '신관 3층 디미과 3-1반 교실',
    contact: '010-1111-2222',
    ownerName: '한지우',
    description: '수능 VOCA 영어 단어장입니다. 표지에 형광 포스트잇이 여러 개 붙어있고, 내부에 메모가 빼곡히 적혀있습니다.',
    createdAt: new Date('2026-07-07T11:20:00').toISOString()
  },
  {
    id: 'l-7',
    title: '카카오프렌즈 카드지갑',
    category: '지갑',
    lostDate: '2026-07-06',
    lostLocation: '본관 1층 매점 앞',
    contact: '010-6666-9999',
    ownerName: '윤서아',
    description: '라이언 캐릭터 카드지갑입니다. 안에 교통카드, 학생증, 용돈 약간이 들어있습니다.',
    createdAt: new Date('2026-07-06T12:50:00').toISOString()
  },
  {
    id: 'l-8',
    title: '체육복 하의 (반바지, M)',
    category: '패션잡화',
    lostDate: '2026-07-05',
    lostLocation: '체육관 여자 탈의실',
    contact: '010-4444-5555',
    ownerName: '강하은',
    description: '가온고 체육복 반바지(M)입니다. 이름표에 이름이 적혀있습니다. 체육 수업 후 탈의실에 두고 갔습니다.',
    createdAt: new Date('2026-07-05T09:00:00').toISOString()
  }
];

// Helper to load/save JSON
function getStorageItem(key, defaultValue) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing storage for key', key, e);
    return defaultValue;
  }
}

function setStorageItem(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initial initialization
export function initDB() {
  // Clean up old police-prefixed keys if they exist
  const oldPoliceFound = localStorage.getItem('police_found_items');
  if (oldPoliceFound) {
    localStorage.removeItem('police_found_items');
    localStorage.removeItem('police_lost_items');
    localStorage.removeItem('police_admin_auth');
  }

  getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS);
  getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS);
}

// Found Items API
export const FoundStore = {
  getAll: () => {
    const items = getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS);
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  getById: (id) => {
    const list = FoundStore.getAll();
    return list.find(item => item.id === id);
  },

  create: (item) => {
    const list = getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS);
    const newItem = {
      id: `f-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: '보관중',
      ...item
    };
    list.unshift(newItem);
    setStorageItem(STORAGE_KEYS.FOUND_ITEMS, list);
    return newItem;
  },

  update: (id, updatedFields) => {
    const list = getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      setStorageItem(STORAGE_KEYS.FOUND_ITEMS, list);
      return list[index];
    }
    return null;
  },

  delete: (id) => {
    const list = getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS);
    const filtered = list.filter(item => item.id !== id);
    setStorageItem(STORAGE_KEYS.FOUND_ITEMS, filtered);
    return true;
  }
};

// Lost Items API
export const LostStore = {
  getAll: () => {
    const items = getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS);
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  getById: (id) => {
    const list = LostStore.getAll();
    return list.find(item => item.id === id);
  },

  create: (item) => {
    const list = getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS);
    const newItem = {
      id: `l-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    list.unshift(newItem);
    setStorageItem(STORAGE_KEYS.LOST_ITEMS, list);
    return newItem;
  },

  update: (id, updatedFields) => {
    const list = getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      setStorageItem(STORAGE_KEYS.LOST_ITEMS, list);
      return list[index];
    }
    return null;
  },

  delete: (id) => {
    const list = getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS);
    const filtered = list.filter(item => item.id !== id);
    setStorageItem(STORAGE_KEYS.LOST_ITEMS, filtered);
    return true;
  }
};

// Admin Session API
export const AdminAuth = {
  SECRET_KEY: 'gaon_admin_2026',

  isAdmin: () => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  authenticate: (key) => {
    if (key === AdminAuth.SECRET_KEY) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};
