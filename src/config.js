import firebase from 'firebase';
let app;

var firebaseConfig = {
  apiKey: "AIzaSyCvJhZ2oACiXo9C9YhgY3kj6b74nvh9gJk",
  authDomain: "insideout-af169.firebaseapp.com",
  databaseURL: "https://insideout-af169.firebaseio.com",
  projectId: "insideout-af169",
  storageBucket: "insideout-af169.appspot.com",
  messagingSenderId: "609192647805",
  appId: "1:609192647805:web:8c397018ecd56cc8d9e514",
  measurementId: "G-8M5NG0PCY7"
};
// Initialize Firebase
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}
export const db = app;