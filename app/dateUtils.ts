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

  export {
    formatDateString,
    formatDate
  }