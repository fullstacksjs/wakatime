export const weeksSince = (dateString: string): number => {
  var date = new Date(dateString).getMilliseconds();
  var today = new Date().getMilliseconds();
  return Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
}


export const  getHours = (time: any) => {
  return Math.floor(time / 3600).toString();
}