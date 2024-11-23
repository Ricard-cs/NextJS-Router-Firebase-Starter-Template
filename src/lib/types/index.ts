export interface Post {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  createdAt: number;
} 