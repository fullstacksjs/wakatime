export const weeksSince = (dateString: string): number => {
  const date = new Date(dateString).getMilliseconds();
  const today = new Date().getMilliseconds();
  return Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
};

export const getHours = (time: any) => {
  return Math.floor(time / 3600).toString();
};
