function formatDateString(isoDate: string) {
    const date = new Date(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: '2-digit' };
    if (date.getDate() === today.getDate()) {
        return 'Today';
    }
    if (date.getDate() === yesterday.getDate()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('en-IN', options).replace(',', '');
}

  const formatDate = (date: any) => {
    date = new Date(date);
    const formattedTime = date.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        day: 'numeric',
        month: 'short',
        year: '2-digit',
    });
    return formattedTime;
  }

  const getTimeFromDate = (date: any) => {
    date = new Date(date);
    const formattedTime = date.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
    return formattedTime;
  }
  const getDateByFormat = (date: any, format = {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }) => {
    date = new Date(date);
    const formattedTime = date.toLocaleString('en-IN', {
     ...format
    });
    return formattedTime;
  }

  function differenceFromToday(iso: string): number {
    const givenDate = new Date(iso);
    const today = new Date();
    const diffInMs = today.getTime() - givenDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  export {
    formatDateString,
    formatDate,
    differenceFromToday,
    getTimeFromDate,
    getDateByFormat,
    formatTime
  }