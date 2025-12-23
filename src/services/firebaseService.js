import { 
  collection, 
  query, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebaseClient';
import { DatabaseService, StorageService } from './serviceInterface';

/**
 * Firebase Database Service Implementation
 */
export class FirebaseDatabaseService extends DatabaseService {
  constructor(collectionName = 'flower_entries') {
    super();
    this.collectionName = collectionName;
  }

  async fetchEntries() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('created_at', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to ISO strings for consistency
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        entry_date: doc.data().entry_date || null,
      }));
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  }

  async createEntry(entryData) {
    try {
      // Convert entry_date to Firestore-compatible format if needed
      const data = {
        ...entryData,
        created_at: Timestamp.now(),
        entry_date: entryData.entry_date || new Date().toISOString().split('T')[0],
      };

      const docRef = await addDoc(collection(db, this.collectionName), data);
      
      return {
        id: docRef.id,
        ...data,
        created_at: data.created_at.toDate().toISOString(),
      };
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  }

  async updateEntry(entryId, entryData) {
    try {
      const docRef = doc(db, this.collectionName, entryId);
      await updateDoc(docRef, entryData);
      
      // Fetch updated document
      const updatedDoc = await this.getEntryById(entryId);
      return updatedDoc;
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }

  async deleteEntry(entryId) {
    try {
      const docRef = doc(db, this.collectionName, entryId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }

  async getEntryById(entryId) {
    try {
      const docRef = doc(db, this.collectionName, entryId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Entry not found');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      };
    } catch (error) {
      console.error('Error getting entry:', error);
      throw error;
    }
  }
}

/**
 * Firebase Storage Service Implementation
 */
export class FirebaseStorageService extends StorageService {
  async uploadFile(file, bucket, fileName = null) {
    try {
      const fileExt = file.name.split('.').pop();
      const finalFileName = fileName || `${Math.random()}.${fileExt}`;
      const storageRef = ref(storage, `${bucket}/${finalFileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(bucket, fileName) {
    try {
      const storageRef = ref(storage, `${bucket}/${fileName}`);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  getPublicUrl(bucket, fileName) {
    // For Firebase Storage, we need to upload first to get the URL
    // This method returns a path that can be used with uploadFile
    return `${bucket}/${fileName}`;
  }
}

