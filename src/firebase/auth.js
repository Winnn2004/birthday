import { getAuth } from 'firebase/auth';
import { app, isFirebaseConfigured } from './config';

// Keep Firebase Authentication out of the public invite bundle. This module is
// loaded only with the admin route.
export const auth = isFirebaseConfigured() && app ? getAuth(app) : null;
