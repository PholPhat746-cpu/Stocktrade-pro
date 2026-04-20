"use client";
import React, { useState } from 'react';
import { ArrowLeft, Wallet, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DepositPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative">
      <Link href="/">
        <button className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> ย้อนกลับ
        </button>
      </Link>

      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-600/20 p-4 rounded-full mb-4">
          <Wallet className="text-blue-500" size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-2">ฝากเงิน (Deposit)</h1>
        
        <div className="bg-slate-900 w-full p-6 rounded-3xl border border-slate-800 mb-6 mt-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 text-left">เลขที่บัญชี / Wallet</p>
          <div className="flex items-center justify-between bg-black/50 p-3 rounded-xl border border-slate-700">
            <span className="text-sm font-mono truncate mr-2 text-blue-400">0x71C7...f6D8</span>
            <button className="text-blue-500"><Copy size={18} /></button>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full bg-blue-600 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
        >
          ยืนยันการโอนเงิน
        </button>
      </div>

      {/* --- ระบบแจ้งเตือน (Success Modal) --- */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] w-full max-w-sm text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="text-green-500" size={80} />
            </div>
            <h2 className="text-2xl font-bold mb-2">ส่งคำขอสำเร็จ!</h2>
            <p className="text-slate-400 mb-8 text-sm">ระบบกำลังตรวจสอบรายการฝากของคุณพล<br/>กรุณารอสักครู่ครับ</p>
            <Link href="/history">
              <button className="w-full bg-green-500 py-3 rounded-xl font-bold text-black">ไปดูประวัติธุรกรรม</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

