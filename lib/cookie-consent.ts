export const COOKIE_CONSENT_KEY = "emilie-cookie-consent"
export const COOKIE_CONSENT_EVENT = "emilie-cookie-consent"

export function hasCookieConsent(): boolean {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted"
  } catch {
    return false
  }
}

export function acceptCookieConsent() {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))
}
