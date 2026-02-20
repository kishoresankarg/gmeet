export const formatDate = (date: string | Date): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (date.getFullYear() === 2001) {
    date.setFullYear(new Date().getFullYear());
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const downloadFile = (data: Blob, filename: string) => {
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
