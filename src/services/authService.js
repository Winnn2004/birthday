import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { isFirebaseConfigured } from '../firebase/config';
import { auth } from '../firebase/auth';

export async function loginAdmin(email, password) {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase chưa được cấu hình. Vui lòng xem README.');
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  if (!auth) return;
  return signOut(auth);
}

export function onAuthChange(callback) {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}
