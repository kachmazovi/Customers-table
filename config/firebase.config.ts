import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyDlPJCwmFPCEHlTCOThATYMqrfguQZr7us',
  authDomain: 'customers-64fdb.firebaseapp.com',
  projectId: 'customers-64fdb',
  storageBucket: 'customers-64fdb.appspot.com',
  messagingSenderId: '751005847562',
  appId: '1:751005847562:web:aae9b26edf476824bccff3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
