'use client';

import { useState, useEffect } from 'react';
import { getMonthlyPushups, getYearlyPushups, getRecentPushups, DailyStat } from './actions';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { SkeletonCalendar } from '@/components/ui/skeleton';
import { Heatmap } from '@/components/heatmap';
import PushupChart from '@/components/pushup-chart';

// Helpers for calendar generation
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function SummaryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<Record<string, DailyStat>>({});
  const [yearlyStats, setYearlyStats] = useState<Record<string, number>>({});
  const [recentStats, setRecentStats] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayStat, setSelectedDayStat] = useState<DailyStat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [monthlyData, yearlyData, recentData] = await Promise.all([
          getMonthlyPushups(year, month),
          getYearlyPushups(year),
          getRecentPushups(30)
        ]);
        setStats(monthlyData);
        setYearlyStats(yearlyData);
        setRecentStats(recentData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleYearChange = (offset: number) => {
    setCurrentDate(new Date(year + offset, month - 1, 1));
  };

  const handleMonthSelect = (m: number) => {
    setCurrentDate(new Date(year, m - 1, 1));
    setShowDateSelector(false);
  };

  // Calendar Logic (Monday Start)
  const daysInMonth = getDaysInMonth(year, month);
  let startDay = getFirstDayOfMonth(year, month);
  startDay = startDay === 0 ? 6 : startDay - 1;

  const calendarCells = [];
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  const openModal = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayStat = stats[dateStr];
    if (dayStat) {
      setSelectedDayStat(dayStat);
      setIsModalOpen(true);
    }
  };

  // Calculate monthly summary
  const monthlyTotal = Object.values(stats).reduce((sum, d) => sum + d.totalCount, 0);
  const daysWithData = Object.keys(stats).length;
  const dailyAverage = daysWithData > 0 ? Math.round(monthlyTotal / daysWithData) : 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <PageHeader backHref="/home" backLabel="返回打卡" />

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card animate>
            <CardBody className="p-4 text-center">
              <div className="text-3xl font-bold text-[var(--primary)]">{monthlyTotal}</div>
              <div className="text-xs text-[var(--muted)] mt-1">本月总数</div>
            </CardBody>
          </Card>
          <Card animate>
            <CardBody className="p-4 text-center">
              <div className="text-3xl font-bold text-[var(--success)]">{daysWithData}</div>
              <div className="text-xs text-[var(--muted)] mt-1">打卡天数</div>
            </CardBody>
          </Card>
          <Card animate>
            <CardBody className="p-4 text-center">
              <div className="text-3xl font-bold text-[var(--warning)]">{dailyAverage}</div>
              <div className="text-xs text-[var(--muted)] mt-1">日均数量</div>
            </CardBody>
          </Card>
        </div>

        {/* Calendar Card */}
        <Card animate className="relative overflow-visible">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button
              onClick={handlePrevMonth}
              disabled={showDateSelector}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5
                       transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={() => setShowDateSelector(!showDateSelector)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <span className="text-lg font-bold text-[var(--foreground)]">
                {year}年 {month}月
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-[var(--muted)] transition-transform duration-200 ${showDateSelector ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <button
              onClick={handleNextMonth}
              disabled={showDateSelector}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5
                       transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Date Selector Overlay */}
          {showDateSelector && (
            <div className="absolute inset-0 top-[65px] z-10 glass-card rounded-b-2xl p-6 animate-slide-up">
              {/* Year Switcher */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => handleYearChange(-1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <span className="text-xl font-bold text-[var(--foreground)]">{year}年</span>
                <button
                  onClick={() => handleYearChange(1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMonthSelect(m)}
                    className={`
                      py-2.5 rounded-xl text-sm font-medium transition-all
                      ${m === month
                        ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-md)]'
                        : 'bg-black/5 text-[var(--foreground)] hover:bg-black/10'
                      }
                    `}
                  >
                    {m}月
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Grid */}
          <CardBody className="p-4">
            {loading ? (
              <SkeletonCalendar />
            ) : (
              <>
                {/* Weekday Header */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-xs text-[var(--muted)] font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayData = stats[dateStr];
                    const hasData = !!dayData;
                    const isToday = new Date().getDate() === day
                      && new Date().getMonth() + 1 === month
                      && new Date().getFullYear() === year;

                    // Color intensity based on count
                    const getIntensityClass = (count: number) => {
                      if (count <= 10) return 'bg-[var(--primary)]/20';
                      if (count <= 30) return 'bg-[var(--primary)]/40';
                      if (count <= 50) return 'bg-[var(--primary)]/60';
                      return 'bg-[var(--primary)]/80';
                    };

                    return (
                      <div
                        key={day}
                        onClick={() => hasData && openModal(day)}
                        className={`
                          aspect-square rounded-lg flex flex-col items-center justify-center relative
                          transition-all duration-200
                          ${hasData
                            ? `cursor-pointer ${getIntensityClass(dayData.totalCount)} hover:scale-110 hover:shadow-md`
                            : 'hover:bg-black/5'
                          }
                          ${isToday ? 'ring-2 ring-[var(--primary)] ring-offset-1' : ''}
                        `}
                      >
                        <span className={`text-sm ${hasData ? 'font-bold text-[var(--foreground)]' : 'text-[var(--muted)]'}`}>
                          {day}
                        </span>
                        {hasData && (
                          <span className="text-[10px] font-medium text-[var(--primary)] mt-0.5">
                            {dayData.totalCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Trend Chart */}
        <Card animate>
          <CardBody>
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
              </svg>
              最近30天趋势
            </h2>
            <PushupChart data={recentStats} />
          </CardBody>
        </Card>

        {/* Annual Heatmap */}
        <Card animate>
          <CardBody>
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {year}年度热力图
            </h2>
            <Heatmap data={yearlyStats} year={year} />
          </CardBody>
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDayStat ? `${selectedDayStat.date} 记录` : ''}
        size="sm"
      >
        {selectedDayStat && (
          <div className="space-y-4">
            {/* Total */}
            <div className="p-4 rounded-xl text-center" style={{ background: 'var(--primary-gradient)' }}>
              <div className="text-sm text-white/80 mb-1">全天总计</div>
              <div className="text-4xl font-black text-white">{selectedDayStat.totalCount}</div>
            </div>

            {/* Sessions */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wider">
                详细记录
              </h3>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {selectedDayStat.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-black/5"
                  >
                    <div className="flex flex-col">
                      <span className="text-[var(--foreground)] font-bold text-lg">
                        {session.count} <span className="text-xs text-[var(--muted)] font-normal">个</span>
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {new Date(session.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[var(--muted)] bg-white/50 px-2 py-1 rounded">
                      {session.duration}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
