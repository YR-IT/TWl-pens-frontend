import { api } from "./api";

const SESSION_KEY = "atelier_session_id";

/**
 * Returns or creates an anonymous session identifier for funnel tracking.
 */
export function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `sess_fallback_${Date.now()}`;
  }
}

/**
 * Fire non-blocking analytics event to /api/events.
 * @param {"product_view" | "add_to_cart" | "checkout_started"} eventType 
 * @param {string|null} productId 
 * @param {object} metadata 
 */
export async function trackEvent(eventType, productId = null, metadata = {}) {
  try {
    const sessionId = getSessionId();
    // Non-blocking fire-and-forget
    api.post("/events", {
      event_type: eventType,
      product_id: productId || null,
      session_id: sessionId,
      metadata: metadata || {},
    }).catch(() => {
      // Ignore analytics logging failures silently
    });
  } catch {
    // Ignore tracking errors
  }
}
