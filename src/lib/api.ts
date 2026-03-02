const BASE = "https://functions.poehali.dev/610ddc7c-dc78-424e-a4f1-4c328f453f32";

function getAdminToken() {
  return localStorage.getItem("admin_token") || "";
}

async function req(method: string, path: string, body?: unknown, admin = false) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (admin) headers["X-Admin-Token"] = getAdminToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export const api = {
  // Players
  getPlayers: () => req("GET", "/players"),
  createPlayer: (d: unknown) => req("POST", "/players", d, true),
  updatePlayer: (id: number, d: unknown) => req("PUT", `/players/${id}`, d, true),
  deletePlayer: (id: number) => req("DELETE", `/players/${id}`, undefined, true),

  // Matches
  getMatches: () => req("GET", "/matches"),
  createMatch: (d: unknown) => req("POST", "/matches", d, true),
  updateMatch: (id: number, d: unknown) => req("PUT", `/matches/${id}`, d, true),
  deleteMatch: (id: number) => req("DELETE", `/matches/${id}`, undefined, true),

  // News
  getNews: () => req("GET", "/news"),
  createNews: (d: unknown) => req("POST", "/news", d, true),
  updateNews: (id: number, d: unknown) => req("PUT", `/news/${id}`, d, true),
  deleteNews: (id: number) => req("DELETE", `/news/${id}`, undefined, true),

  // Achievements
  getAchievements: () => req("GET", "/achievements"),
  createAchievement: (d: unknown) => req("POST", "/achievements", d, true),
  updateAchievement: (id: number, d: unknown) => req("PUT", `/achievements/${id}`, d, true),
  deleteAchievement: (id: number) => req("DELETE", `/achievements/${id}`, undefined, true),

  // Club
  getClub: () => req("GET", "/club"),
  updateClub: (d: unknown) => req("PUT", "/club", d, true),
};

export function isAdminLoggedIn() {
  return !!localStorage.getItem("admin_token");
}

export function adminLogin(token: string) {
  localStorage.setItem("admin_token", token);
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
}
