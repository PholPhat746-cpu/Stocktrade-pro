"use client";
import React from 'react';
import { ArrowLeft, History, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  // ข้อมูลจำลอง (Mock Data)
  const transactions = [
    { id: 1, type: 'Deposit', amount: '+ 0.0050 BTC', status: 'Success', date: '2026-04-15 10:30', color: 'text-green-500' },
    { id: 2, type: 'Withdraw', amount: '- 500.00 USDT', status: 'Pending', date: '2026-04-14 15:45', color: 'text-red-500' },
    { id: 3, type: 'Buy ETH', amount: '+ 1.25 ETH', status: 'Success', date: '2026-04-12 09:12', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <Link href="/">
        <button className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft size={20} /> กลับหน้าหลัก
        </button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <History className="text-blue-500" size={28} />
        <h1 className="text-2xl font-bold">ประวัติธุรกรรม</h1>
      </div>

      <div className="space-y-4">
        {transactions.map((item) => (
          <div key={item.id} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${item.type === 'Deposit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {item.type === 'Deposit' ? <ArrowDownLeft className="text-green-500" size={20} /> : <ArrowUpRight className="text-red-500" size={20} />}
              </div>
              <div>
                <p className="font-semibold">{item.type}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${item.color}`}>{item.amount}</p>
              <p className="text-[10px] text-slate-400 uppercase">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

