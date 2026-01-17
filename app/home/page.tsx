'use client';

import { useState, useRef, useEffect } from 'react';
import { savePushupSession } from './actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';

export default function HomePage() {
  const [status, setStatus] = useState<'idle' | 'timing' | 'input' | 'saving' | 'success'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [count, setCount] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    setStatus('timing');
    const start = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 100);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('input');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!count) return;

    setStatus('saving');
    try {
      await savePushupSession(parseInt(count, 10), elapsed);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setCount('');
        setElapsed(0);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert('保存失败，请重试');
      setStatus('input');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Decorative Elements - 悬浮动画光晕 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--primary)]/15 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--success)]/15 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1.5s' }} />

      <Card animate className="w-full max-w-md">
        <CardBody className="text-center py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">俯卧撑打卡</h1>
            <p className="text-[var(--muted)] text-sm">坚持每一天，见证你的成长</p>
          </div>

          {/* Idle State - Start Button */}
          {status === 'idle' && (
            <div className="relative inline-block">
              {/* Pulse Ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse-ring"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              />

              <button
                onClick={handleStart}
                className="relative w-44 h-44 rounded-full text-white text-2xl font-bold 
                         shadow-xl transition-all duration-300
                         hover:scale-105 active:scale-95
                         flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="animate-bounce-subtle">开始计时</span>
              </button>
            </div>
          )}

          {/* Timing State */}
          {status === 'timing' && (
            <div className="space-y-8 animate-fade-in">
              <div className="relative">
                {/* Timer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-[var(--primary)]/20" />
                <div className="relative w-44 h-44 mx-auto rounded-full flex items-center justify-center
                              bg-gradient-to-br from-white to-[var(--primary-light)] shadow-inner">
                  <span className="text-5xl font-mono font-bold text-[var(--foreground)]">
                    {formatTime(elapsed)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[var(--muted)]">
                <span className="w-2 h-2 bg-[var(--danger)] rounded-full animate-pulse" />
                <span className="text-sm">计时中...</span>
              </div>

              <button
                onClick={handleStop}
                className="w-full py-4 rounded-2xl text-white text-xl font-bold 
                         shadow-lg transition-all duration-300
                         hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
              >
                结束计时
              </button>
            </div>
          )}

          {/* Input State */}
          {status === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
              <div className="glass-card rounded-xl p-4">
                <span className="text-[var(--muted)] block text-sm mb-1">本次用时</span>
                <span className="text-4xl font-mono font-bold text-[var(--foreground)]">
                  {formatTime(elapsed)}
                </span>
              </div>

              <div className="text-left">
                <label htmlFor="count" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  俯卧撑数量
                </label>
                <input
                  id="count"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="请输入数量"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--primary-light)] 
                           bg-white/50 text-xl font-bold text-[var(--foreground)]
                           focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]
                           outline-none transition-all duration-200
                           placeholder:text-[var(--muted-foreground)] placeholder:font-normal"
                  required
                  min="1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-white text-xl font-bold 
                         shadow-lg transition-all duration-300
                         hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                🎉 提交打卡
              </button>
            </form>
          )}

          {/* Saving State */}
          {status === 'saving' && (
            <div className="py-10 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[var(--primary-light)] border-t-[var(--primary)] animate-spin" />
              <p className="text-[var(--muted)]">正在保存...</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="space-y-6 animate-scale-in">
              {/* Success Icon */}
              <div className="relative w-24 h-24 mx-auto">
                <div
                  className="absolute inset-0 rounded-full animate-pulse-ring"
                  style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
                />
                <div
                  className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--success)] mb-2">打卡成功！</h2>
                <p className="text-[var(--foreground)]">
                  耗时 <span className="font-mono font-bold">{formatTime(elapsed)}</span>，
                  完成 <span className="font-bold text-[var(--primary)]">{count}</span> 个
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-[var(--muted)] text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span>3秒后返回...</span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Bottom Link */}
      <div className="mt-8">
        <Link
          href="/summary"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                   text-[var(--muted)] hover:text-[var(--primary)] 
                   glass-card hover:bg-[var(--glass-bg)]
                   hover:shadow-[var(--shadow-md)]
                   transition-all duration-200 group"
        >
          <span className="text-sm font-medium">查看历史统计</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
