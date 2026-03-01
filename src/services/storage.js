import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

export const uploadObstacleImage = async (file) => {
  if (!file) return null;
  // Create a unique path: obstacles/{timestamp}_{filename}
  const storageRef = ref(storage, `obstacles/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
