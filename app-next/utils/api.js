export default function api(route) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://meal-sharing-api-wpfg.onrender.com";
  return `${baseUrl}/api${route}`;
}
