// LocalStorage Key Constants
const STORAGE_KEYS = {
  FOUND_ITEMS: 'police_found_items',
  LOST_ITEMS: 'police_lost_items',
  ADMIN_AUTH: 'police_admin_auth'
};

// Initial Dummy Data to pre-populate the application
const DUMMY_FOUND_ITEMS = [
  {
    id: 'f-1',
    title: '검은색 가죽 가방 (프라다)',
    category: '가방',
    foundDate: '2026-07-08',
    foundLocation: '서울시 서초구 서초대로 버스정류장',
    keepLocation: '서초경찰서 유실물 보관소',
    status: '보관중', // '보관중' or '찾아감'
    description: '내부에 금색 지퍼가 있고, 검은색 가죽 끈이 달려있는 여성용 숄더백입니다. 내부에는 화장품 파우치와 열쇠가 들어있습니다.',
    image: '', // Will populate with placeholder details or SVG Base64 in UI
    createdAt: new Date('2026-07-08T14:30:00').toISOString()
  },
  {
    id: 'f-2',
    title: '아이폰 15 프로 (내추럴 티타늄)',
    category: '전자기기',
    foundDate: '2026-07-09',
    foundLocation: '강남역 2호선 개찰구 인근',
    keepLocation: '역삼지구대',
    status: '보관중',
    description: '아이폰 15 프로 모델이며, 투명 맥세이프 케이스가 끼워져 있습니다. 화면에 강화유리 필름이 붙어있고, 잠금화면은 하늘 사진입니다.',
    image: '',
    createdAt: new Date('2026-07-09T09:15:00').toISOString()
  },
  {
    id: 'f-3',
    title: '갈색 가죽 지갑 (몽블랑)',
    category: '지갑',
    foundDate: '2026-07-05',
    foundLocation: '홍대입구역 9번 출구 앞 스타벅스 테이블',
    keepLocation: '마포경찰서 종합민원실',
    status: '찾아감',
    description: '몽블랑 로고가 전면에 양각된 남성용 반지갑입니다. 내부에는 신분증(이**님)과 신용카드 2장이 들어있습니다.',
    image: '',
    createdAt: new Date('2026-07-05T18:22:00').toISOString()
  },
  {
    id: 'f-4',
    title: '에어팟 프로 2세대 (흰색)',
    category: '전자기기',
    foundDate: '2026-07-07',
    foundLocation: '여의도 한강공원 잔디밭',
    keepLocation: '여의도파출소',
    status: '보관중',
    description: '에어팟 프로 2세대 본체와 양쪽 유닛이 들어있습니다. 케이스에는 보라색 실리콘 고양이 캐릭터 케이스가 씌워져 있습니다.',
    image: '',
    createdAt: new Date('2026-07-07T16:40:00').toISOString()
  }
];

const DUMMY_LOST_ITEMS = [
  {
    id: 'l-1',
    title: '삼성 갤럭시 북 4 프로',
    category: '전자기기',
    lostDate: '2026-07-09',
    lostLocation: '신촌 인근 카페 (투썸플레이스)',
    contact: '010-1234-5678',
    ownerName: '김지현',
    description: '그레이 색상 16인치 모델입니다. 상판에 스티커 2장(디벨로퍼 캐릭터 스티커)이 붙어있습니다. 검은색 노트북 파우치에 넣어둔 채 두고 내렸습니다. 소중한 자료가 많습니다. 찾으면 꼭 연락주세요. 사례하겠습니다.',
    createdAt: new Date('2026-07-09T10:00:00').toISOString()
  },
  {
    id: 'l-2',
    title: '빨간색 체크무늬 3단 우산',
    category: '패션잡화',
    lostDate: '2026-07-08',
    lostLocation: '광화문 교보문고 지하보도',
    contact: '010-9876-5432',
    ownerName: '박영호',
    description: '손잡이 부분에 은색 스크래치가 있고, 우산 끈 단추가 떨어져 나간 상태입니다. 비가 많이 오던 날 두고 내렸습니다.',
    createdAt: new Date('2026-07-08T15:00:00').toISOString()
  },
  {
    id: 'l-3',
    title: '금테 안경 (젠틀몬스터)',
    category: '패션잡화',
    lostDate: '2026-07-06',
    lostLocation: '잠실 롯데월드몰 3층 식당가',
    contact: '010-5555-1234',
    ownerName: '이민서',
    description: '얇은 로즈골드빛 금테 안경입니다. 렌즈에 도수가 꽤 높은 편입니다. 갈색 가죽 안경케이스와 함께 잃어버렸습니다.',
    createdAt: new Date('2026-07-06T12:30:00').toISOString()
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
  getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS);
  getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS);
}

// Found Items API
export const FoundStore = {
  getAll: () => getStorageItem(STORAGE_KEYS.FOUND_ITEMS, DUMMY_FOUND_ITEMS),
  
  getById: (id) => {
    const list = FoundStore.getAll();
    return list.find(item => item.id === id);
  },

  create: (item) => {
    const list = FoundStore.getAll();
    const newItem = {
      id: `f-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: '보관중',
      ...item
    };
    list.unshift(newItem); // Add to the top
    setStorageItem(STORAGE_KEYS.FOUND_ITEMS, list);
    return newItem;
  },

  update: (id, updatedFields) => {
    const list = FoundStore.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      setStorageItem(STORAGE_KEYS.FOUND_ITEMS, list);
      return list[index];
    }
    return null;
  },

  delete: (id) => {
    const list = FoundStore.getAll();
    const filtered = list.filter(item => item.id !== id);
    setStorageItem(STORAGE_KEYS.FOUND_ITEMS, filtered);
    return true;
  }
};

// Lost Items API
export const LostStore = {
  getAll: () => getStorageItem(STORAGE_KEYS.LOST_ITEMS, DUMMY_LOST_ITEMS),
  
  getById: (id) => {
    const list = LostStore.getAll();
    return list.find(item => item.id === id);
  },

  create: (item) => {
    const list = LostStore.getAll();
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
    const list = LostStore.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      setStorageItem(STORAGE_KEYS.LOST_ITEMS, list);
      return list[index];
    }
    return null;
  },

  delete: (id) => {
    const list = LostStore.getAll();
    const filtered = list.filter(item => item.id !== id);
    setStorageItem(STORAGE_KEYS.LOST_ITEMS, filtered);
    return true;
  }
};

// Admin Session API
export const AdminAuth = {
  SECRET_KEY: 'police_secret_2026',

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
