export function getRandomImageUrl(originalUrl: string): string {
  if (!originalUrl) return ''; // Prevent errors if the URL is missing
  
  const baseUrl = originalUrl.split('?')[0]; // Remove any existing lock parameter
  
  return `${baseUrl}?lock=${Date.now()}-${Math.random()}`;
}
