import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
export function getEventImageUrl(path, category = "General") {
  if (!path || path === "null" || path === "undefined" || path === "") {
    const categoryImages = {
      "technical": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      "hackathon": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
      "workshop": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      "seminar": "https://images.unsplash.com/photo-1475721027185-392ef624aaef?w=800&q=80",
      "techfest": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      "competition": "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80",
      "cultural": "https://images.unsplash.com/photo-1514525253361-bee8a19740c1?w=800&q=80",
      "sports": "https://images.unsplash.com/photo-1461896705384-a4cd33a7d7b7?w=800&q=80",
      "academic": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      "other": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"
    };
    const key = category?.toLowerCase().replace(/[^a-z]/g, "") || "other";
    return categoryImages[key] || categoryImages["other"];
  }
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:5000";
  return `${baseUrl}${path}`;
}
