/**
 * Generates role-based avatars with distinct professional colors.
 * Admin: Deep Navy | Faculty: Professional Emerald | Student: Modern Indigo
 */
export const getAvatarUrl = (user) => {
  const seed = user?.email || "default";
  const role = user?.role?.toLowerCase() || "student";

  // Identicon: Professional, geometric patterns for a "fixed" system identity
  const baseUrl = "https://api.dicebear.com/7.x/identicon/svg";
  const commonParams = "padding=20&scale=80"; // Ensures a consistent "fixed" look

  switch (role) {
    case "admin":
      // Deep Navy - Authority
      return `${baseUrl}?seed=${seed}&backgroundColor=0f172a&${commonParams}`;

    case "faculty":
      // Professional Emerald - Growth & Knowledge
      return `${baseUrl}?seed=${seed}&backgroundColor=064e3b&${commonParams}`;

    case "student":
    default:
      // Modern Indigo - Community & Participation
      return `${baseUrl}?seed=${seed}&backgroundColor=312e81&${commonParams}`;
  }
};