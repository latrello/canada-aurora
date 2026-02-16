
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
    if (!db) return; // 如果 Firebase 未初始化則跳過
    try {
      const q = query(collection(db, 'journals'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[];
        setEntries(docs);
      }, (error) => {
        console.warn("Firestore listener error:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Failed to connect to Firestore.");
    }
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !content.trim() || !db || !storage) {
      alert("Firebase 尚未配置完成，目前無法上傳照片。");
      return;
    }

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
      alert("上傳失敗！請確認 Firebase 控制台已開啟 Storage 並設為測試模式。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-[#88D8B0] bg-white flex items-center justify-center text-[#88D8B0] active:scale-95 transition-all"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
        {entries.slice(0, 5).map(entry => (
          <div key={entry.id} className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-[#88D8B0] p-1 bg-white">
             <img src={entry.imageUrls[0]} className="w-full h-full rounded-full object-cover" alt="story" />
          </div>
        ))}
      </div>

      {showAddForm && (
        <Card className="p-6 border-2 border-[#88D8B0] animate-in zoom-in duration-300">
          <SectionTitle title="分享此刻 / New Post" icon="fa-solid fa-camera-retro" />
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="寫下你的極光心情..."
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#88D8B0] outline-none h-32 resize-none mb-4"
          />
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
            >
              {isUploading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-image"></i>}
              選擇照片
            </Button>
            <Button 
              className="flex-1"
              onClick={() => setShowAddForm(false)}
              variant="danger"
            >
              取消
            </Button>
          </div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            hidden 
            ref={fileInputRef} 
            onChange={handleUpload}
            disabled={isUploading}
          />
        </Card>
      )}

      {entries.map(entry => (
        <Card key={entry.id} className="p-0 overflow-hidden group">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#88D8B0] to-teal-200 p-0.5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" className="w-full h-full rounded-full bg-white object-cover" alt="avatar" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-700">{entry.author}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entry.location} • {entry.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}</p>
            </div>
          </div>
          
          <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={entry.imageUrls[0]} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="journal"
            />
            {entry.imageUrls.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black">
                1 / {entry.imageUrls.length}
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex gap-5 mb-4 text-xl text-[#5D6D7E]">
              <button className="hover:text-rose-400 transition-colors"><i className="fa-regular fa-heart"></i></button>
              <button className="hover:text-[#88D8B0] transition-colors"><i className="fa-regular fa-comment"></i></button>
              <button className="hover:text-sky-400 transition-colors"><i className="fa-regular fa-paper-plane"></i></button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              <span className="font-black text-[#5D6D7E] mr-2">{entry.author}</span>
              {entry.content}
            </p>
          </div>
        </Card>
      ))}

      {entries.length === 0 && !isUploading && (
        <div className="text-center py-20 opacity-20">
          <i className="fa-solid fa-images text-6xl mb-4"></i>
          <p className="font-black uppercase tracking-[0.2em]">No Journal Yet<br/>尚未有日誌記錄</p>
        </div>
      )}
    </div>
  );
};

export default JournalView;
