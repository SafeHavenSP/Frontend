import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'xxxxxxxxxxxxxxxxxx',
  authDomain: 'xxxxxxxxxxx',
  projectId: 'xxxxxxxxxxxx',
  storageBucket: 'xxxxxxxx',
  messagingSenderId: 'xxxxxxx',
  appId: 'xxxxxxxxxxxxxx',
  measurementId: 'xxxxxxxxxxxxxxxxx',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
