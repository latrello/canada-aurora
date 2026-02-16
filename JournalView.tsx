
import React, { useState, useEffect, useRef } from 'react';
import { Card, SectionTitle, Button } from './UIProvider';
import { db, storage } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface JournalEntry {
  id: string;
  author: string;
  content: string;
  imageUrls: string[];
  createdAt: any;
  location: string;
}

const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'journals'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[];
      setEntries(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !content.trim() || !db || !storage) return;

    setIsUploading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `journals/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, 'journals'), {
        author: 'Kevin',
        content,
        imageUrls: uploadedUrls,
        createdAt: Timestamp.now(),
        location: 'Yellowknife'
      });

      setContent('');
      setShowAddForm(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <SectionTitle title="旅行日誌" icon="fa-solid fa-camera" />
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-16 h-16 rounded-full border-2 border-dashed border-[#88D8B0] flex items-center justify-center text-[#88D8B0]"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </div>
      
      {entries.map(entry => (
        <Card key={entry.id} className="p-0 overflow-hidden group">
          <div className="p-4 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fa-solid fa-user text-gray-400"></i>
             </div>
             <div>
                <h4 className="font-bold text-sm">{entry.author}</h4>
                <p className="text-[10px] text-gray-400">{entry.location}</p>
             </div>
          </div>
          <img src={entry.imageUrls[0]} className="w-full aspect-square object-cover" alt="story" />
          <div className="p-4">
             <p className="text-sm text-gray-600">{entry.content}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default JournalView;
