
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * 회원가입 (Email/Password)
 */
export const signUp = async (email: string, pass: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * 로그인 (Email/Password)
 */
export const signIn = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * 로그아웃
 */
export const logOut = async () => {
  await signOut(auth);
};

/**
 * 인증 상태 변경 감지 훅용 래퍼
 */
export const onAuthStatusChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Firebase 에러 코드를 사용자 친화적 메시지로 변환
 */
const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use': return '이미 사용 중인 이메일입니다.';
    case 'auth/invalid-email': return '유효하지 않은 이메일 형식입니다.';
    case 'auth/weak-password': return '비밀번호는 최소 6자 이상이어야 합니다.';
    case 'auth/user-not-found': return '등록되지 않은 사용자입니다.';
    case 'auth/wrong-password': return '비밀번호가 일치하지 않습니다.';
    case 'auth/invalid-credential': return '이메일 또는 비밀번호를 확인해주세요.';
    default: return '인증 오류가 발생했습니다. 다시 시도해주세요.';
  }
};
