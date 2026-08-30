export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString?: string): string => {
  if (!timeString) return '';
  return timeString;
};

export const getRelativeDateLabel = (dateString: string): string => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateString === today) return 'Today';
  if (dateString === tomorrow) return 'Tomorrow';
  if (dateString === yesterday) return 'Yesterday';

  return formatDate(dateString);
};

export const getGreeting = (name: string): { greeting: string; period: 'morning' | 'afternoon' | 'evening' } => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { greeting: `Good morning, ${name}`, period: 'morning' };
  } else if (hour < 18) {
    return { greeting: `Good afternoon, ${name}`, period: 'afternoon' };
  } else {
    return { greeting: `Good evening, ${name}`, period: 'evening' };
  }
};

export const getTodayFormattedLong = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
};

export interface CalendarDay {
  dateString: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export const getMonthDays = (year: number, month: number): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const todayStr = new Date().toISOString().split('T')[0];

  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday

  // Previous month filler days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateString = prevMonthDate.toISOString().split('T')[0];
    days.push({
      dateString,
      dayNumber: dayNum,
      dayName: prevMonthDate.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: dateString === todayStr,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const curDate = new Date(year, month, i);
    const dateString = curDate.toISOString().split('T')[0];
    days.push({
      dateString,
      dayNumber: i,
      dayName: curDate.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: dateString === todayStr,
      isCurrentMonth: true,
    });
  }

  // Next month filler days to complete 35 or 42 grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateString = nextDate.toISOString().split('T')[0];
    days.push({
      dateString,
      dayNumber: i,
      dayName: nextDate.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: dateString === todayStr,
      isCurrentMonth: false,
    });
  }

  return days;
};

export const getCurrentWeekDays = (selectedDateStr?: string): CalendarDay[] => {
  const base = selectedDateStr ? new Date(selectedDateStr) : new Date();
  const dayOfWeek = base.getDay(); // 0 is Sunday
  const sunday = new Date(base);
  sunday.setDate(base.getDate() - dayOfWeek);

  const todayStr = new Date().toISOString().split('T')[0];
  const weekDays: CalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const dateString = d.toISOString().split('T')[0];
    weekDays.push({
      dateString,
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: dateString === todayStr,
      isCurrentMonth: true,
    });
  }

  return weekDays;
};
