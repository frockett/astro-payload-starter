const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || "http://localhost:3000";

export async function getGlobal(slug: string, isDraft = false) {
  const url = `${PAYLOAD_URL}/api/globals/${slug}${isDraft ? "?draft=true" : ""}`;
  const response = await fetch(url);
  return response.json();
}
