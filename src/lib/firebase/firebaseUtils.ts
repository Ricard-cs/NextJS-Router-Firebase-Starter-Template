import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Posts
export const createPost = async (data: Omit<Post, 'id'>) => {
  return addDoc(collection(db, 'posts'), {
    ...data,
    createdAt: Date.now(),
    likes: [],
    comments: []
  });
};

export const getFeedPosts = async (limitCount = 20) => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Post));
};

export const getUserPosts = async (userId: string) => {
  const q = query(
    collection(db, 'posts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Post));
};

// Profiles
export const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  return await updateDoc(doc(db, 'profiles', userId), {
    ...data,
    id: userId,
    createdAt: Date.now()
  });
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as UserProfile : null;
};

export const initializeUserProfile = async (user: User) => {
  const profile = await getUserProfile(user.uid);
  if (!profile) {
    await addDoc(collection(db, 'profiles'), {
      id: user.uid,
      name: user.displayName || 'Anonymous',
      imageUrl: user.photoURL || '',
      createdAt: Date.now()
    });
  }
};
