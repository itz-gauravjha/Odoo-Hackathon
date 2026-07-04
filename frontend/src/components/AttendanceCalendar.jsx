import React, { useState } from 'react';

export default function AttendanceCalendar({ logs, onSelectRange, selectedStart, selectedEnd }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (dir) => {
    let newMonth = currentMonth + dir;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getFormattedDateInput = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDayClick = (dayNum) => {
    const clicked = new Date(currentYear, currentMonth, dayNum);
    onSelectRange(clicked);
  };

  const renderCalendarDays = () => {
    const days = [];
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Offset slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-[1.2] border border-white/5 bg-white/[0.01] opacity-20" />);
    }

    const today = new Date();
    const isThisMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(currentYear, currentMonth, day);
      const cellDateStr = getFormattedDateInput(cellDate);

      let cellStyle = "aspect-[1.2] border border-white/5 rounded-lg flex flex-col justify-between items-end p-2 text-xs font-semibold cursor-pointer transition-all hover:bg-white/5 hover:border-indigo-500/30";
      
      if (isThisMonth && day === today.getDate()) {
        cellStyle += " border-purple-500 shadow-md shadow-purple-500/10";
      }

      if (selectedStart && cellDateStr === getFormattedDateInput(selectedStart)) {
        cellStyle += " border-indigo-500 shadow-md shadow-indigo-500/20";
      } else if (selectedEnd && cellDateStr === getFormattedDateInput(selectedEnd)) {
        cellStyle += " border-purple-500 shadow-md shadow-purple-500/20";
      } else if (selectedStart && selectedEnd && cellDate > selectedStart && cellDate < selectedEnd) {
        cellStyle += " bg-indigo-500/10 border-indigo-500/20";
      }

      const log = logs.find(l => l.date === cellDateStr);

      days.push(
        <div key={`day-${day}`} onClick={() => handleDayClick(day)} className={cellStyle}>
          <span className="text-slate-400">{day}</span>
          {log && (
            <span className={`w-full text-center rounded py-0.5 text-[9px] font-bold shadow-sm ${
              log.status === 'Present' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
              log.status === 'Absent' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
              log.status === 'Half-day' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
              'bg-purple-500/10 border border-purple-500/20 text-purple-400'
            }`}>
              {log.status}
            </span>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="font-display font-bold text-white text-base">{monthNames[currentMonth]} {currentYear}</h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="rounded-lg border border-white/5 bg-white/5 p-2 text-slate-400 hover:text-white transition-all">◀</button>
          <button onClick={() => changeMonth(1)} className="rounded-lg border border-white/5 bg-white/5 p-2 text-slate-400 hover:text-white transition-all">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mt-6 text-center text-xs font-semibold text-slate-500 border-b border-white/5 pb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-3">
        {renderCalendarDays()}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500" /> Present</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-red-500" /> Absent</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-amber-500" /> Half-day</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-purple-500" /> On Leave</div>
      </div>
    </div>
  );
}
