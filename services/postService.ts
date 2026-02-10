
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Post } from "../types/post";

const POSTS_COLLECTION = "posts";

/**
 * 새 게시글 작성
 */
export const createPost = async (title: string, content: string, authorId: string, authorEmail: string) => {
  try {
    await addDoc(collection(db, POSTS_COLLECTION), {
      title,
      content,
      authorId,
      authorEmail,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("게시글 작성 중 오류가 발생했습니다.");
  }
};

/**
 * 실시간 게시글 목록 구독
 */
export const subscribePosts = (callback: (posts: Post[]) => void) => {
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });
    callback(posts);
  });
};
