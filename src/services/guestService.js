import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

const GUESTS_COLLECTION = 'guests';

export async function addGuest({ name, nickname }) {
  const cleanName = name.trim();
  const cleanNickname = nickname.trim();

  if (!isFirebaseConfigured() || !db) {
    console.warn('Firebase chưa được cấu hình. Đang chạy chế độ demo lưu tạm.');
    return { id: 'demo-guest-' + Date.now() };
  }

  return addDoc(collection(db, GUESTS_COLLECTION), {
    name: cleanName,
    nickname: cleanNickname,
    note: '',
    status: 'attending',
    createdAt: serverTimestamp(),
  });
}

export async function updateGuestNote(guestId, note) {
  const cleanNote = note.trim();

  if (!isFirebaseConfigured() || !db) {
    console.warn('Firebase chưa được cấu hình. Đang chạy chế độ demo.');
    return;
  }

  if (guestId.startsWith('demo-guest-')) {
    return;
  }

  return updateDoc(doc(db, GUESTS_COLLECTION, guestId), {
    note: cleanNote,
  });
}

export function subscribeAllGuests(callback, onError) {
  if (!isFirebaseConfigured() || !db) {
    callback([
      {
        id: 'demo-1',
        name: 'Nguyễn Văn A',
        nickname: 'A Béo',
        status: 'attending',
        note: 'Chúc mừng sinh nhật bro! Sẽ đến đúng giờ.',
        createdAt: new Date(),
      },
      {
        id: 'demo-2',
        name: 'Trần Thị B',
        nickname: 'Bơ',
        status: 'attending',
        note: 'Nhớ chuẩn bị bánh kem sô-cô-la nha.',
        createdAt: new Date(Date.now() - 3600000),
      },
    ]);
    return () => {};
  }

  const q = query(
    collection(db, GUESTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const guests = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(guests);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function deleteGuest(guestId) {
  if (!isFirebaseConfigured() || !db) {
    console.warn('Firebase chưa được cấu hình.');
    return;
  }

  return deleteDoc(doc(db, GUESTS_COLLECTION, guestId));
}
