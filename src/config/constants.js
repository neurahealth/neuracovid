//import firebase from 'firebase/app';
import {firebase} from '@firebase/app';
import 'firebase/auth';

// Update config details from firebase project
const config = {
  apiKey: "AIz...azg",
  authDomain: "example.firebaseapp.com",
  databaseURL: "https://example.firebaseio.com",
  projectId: "example",
  storageBucket: "example.appspot.com",
  messagingSenderId: "1153....1919"
};

firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = firebase.auth;