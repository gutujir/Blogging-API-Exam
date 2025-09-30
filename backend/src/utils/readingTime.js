// Utility to calculate reading time for a blog post
// Assumes average reading speed of 200 words per minute

export function calculateReadingTime(text) {
  if (!text) return "0 min";
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}
