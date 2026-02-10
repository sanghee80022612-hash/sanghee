
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 사용자가 제공한 설정값 적용
const firebaseConfig = {
  apiKey: "AIzaSyCJXv7rPjI61wLwif_wNVLM_7WajLvkioE",
  authDomain: "myproject-75964.firebaseapp.com",
  projectId: "myproject-75964",
  storageBucket: "myproject-75964.firebasestorage.app",
  messagingSenderId: "146230277701",
  appId: "1:146230277701:web:05d7a5a9958fa40f30552c",
  measurementId: "G-JX4ZN84GB9"
};

// Firebase 앱 초기화
export const app = initializeApp(firebaseConfig);
// Firebase Auth 인스턴스
export const auth = getAuth(app);
// Firestore (확장성을 위해 추가)
export const db = getFirestore(app);
