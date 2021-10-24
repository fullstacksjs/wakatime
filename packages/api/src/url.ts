export const getUrlWithParams = (webpageUrl: string, params: [string, unknown][]): string => {
  const url = new URL(webpageUrl);
  const queryParams = new URLSearchParams();
  params.forEach(([key, value]) => {
    queryParams.append(key, JSON.stringify(value));
  });
  url.search = queryParams.toString();
  return url.toString();
};
