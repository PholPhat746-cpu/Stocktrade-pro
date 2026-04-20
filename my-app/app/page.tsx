"use client";
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Home, BarChart2, Settings, User, Plus, ArrowRight, Download, Upload, History, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

const coins = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'SOLUSDT', name: 'Solana', icon: 'S' }
];

export default function Dashboard() {
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [price, setPrice] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedCoin.symbol}`);
        const data = await res.json();
        const currentPrice = parseFloat(data.lastPrice);
        const priceChange = parseFloat(data.priceChangePercent);
        
        setPrice(currentPrice);
        setChange(priceChange);
        
        setHistory(prev => {
          const newPoint = { time: new Date().toLocaleTimeString(), value: currentPrice };
          return [...prev.slice(-19), newPoint];
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [selectedCoin]);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans">
      {/* Top Header */}
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-500">StockTrade Pro</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Market Live</p>
          </div>
        </div>
        <div className="bg-slate-900 p-2 rounded-full border border-slate-800">
          <User className="text-slate-400" size={24} />
        </div>
      </header>

      <main className="flex-1 px-4 pb-32">
        {/* Asset Selector */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {coins.map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => { setSelectedCoin(coin); setHistory([]); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
                selectedCoin.symbol === coin.symbol ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <span>{coin.icon}</span>
              <span className="font-medium text-sm">{coin.name}</span>
            </button>
          ))}
        </div>

        {/* Main Price Card */}
        <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 text-sm mb-1">{selectedCoin.name} / USDT</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black">${price.toLocaleString()}</h2>
            </div>
            <div className={`flex items-center mt-2 text-sm font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? <TrendingUp size={16} className="mr-1" /> : null} {change}% 
            </div>
          </div>

          {/* Chart Section */}
          <div className="h-48 w-full mt-4 -ml-4">
            <ResponsiveContainer width="110%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={() => null} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions (ปุ่มกดที่ถามครับ) */}
        <div className="mb-8">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-2">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <button onClick={() => alert("ไปหน้าฝากเงิน...")} className="flex flex-col items-center gap-2">
              <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 text-blue-500">
                <Download size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Deposit</span>
            </button>
            <button onClick={() => alert("ไปหน้าถอนเงิน...")} className="flex flex-col items-center gap-2">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-400">
                <Upload size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Withdraw</span>
            </button>
            <button onClick={() => alert("ประวัติการทำรายการ")} className="flex flex-col items-center gap-2">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-400">
                <History size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">History</span>
            </button>
            <button onClick={() => alert("แลกเปลี่ยนเหรียญ")} className="flex flex-col items-center gap-2">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-400">
                <RefreshCcw size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Swap</span>
            </button>
          </div>
        </div>

        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white text-black font-black py-5 rounded-3xl text-lg shadow-xl active:scale-95 transition-transform">
            BUY
          </button>
          <button className="bg-slate-900 text-white font-black py-5 rounded-3xl text-lg border border-slate-800 active:scale-95 transition-transform">
            SELL
          </button>
        </div>
      </main>

      {/* Tab Bar */}
      <nav className="fixed bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 p-4 rounded-[2rem] flex justify-between items-center z-50 shadow-2xl">
        <Home className="text-blue-500" size={24} />
        <BarChart2 className="text-slate-500" size={24} />
        <div className="bg-blue-600 p-4 rounded-full -mt-14 shadow-lg shadow-blue-500/50 border-4 border-[#050505]">
          <ArrowRight className="text-white -rotate-45" size={28} />
        </div>
        <Wallet className="text-slate-500" size={24} />
        <Settings className="text-slate-500" size={24} />
      </nav>
    </div>
  );
}

