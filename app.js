const firebaseConfig = {
  apiKey: "AIzaSyBRxaicRfl6mpYkBSk5A7T7EVSbLLXPeQ0",
  authDomain: "eco-project-b03b0.firebaseapp.com",
  databaseURL: "https://eco-project-b03b0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eco-project-b03b0",
  storageBucket: "eco-project-b03b0.firebasestorage.app"
};

const state = {
  idToken: "",
  refreshToken: "",
  email: "",
  seenOpenAlerts: new Set(),
  pollHandle: null
};

firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");
const loginStatus = document.getElementById("login-status");
const sessionEmail = document.getElementById("session-email");
const sessionStatus = document.getElementById("session-status");
const alertsList = document.getElementById("alerts-list");
const usersList = document.getElementById("users-list");
const openAlertsCount = document.getElementById("open-alerts-count");
const usersCount = document.getElementById("users-count");
const waitingCount = document.getElementById("waiting-count");

document.getElementById("login-button").addEventListener("click", login);
document.getElementById("google-login-button").addEventListener("click", loginWithGoogle);
document.getElementById("register-button").addEventListener("click", registerAdmin);
document.getElementById("refresh-button").addEventListener("click", refreshDashboard);
document.getElementById("logout-button").addEventListener("click", logout);
document.getElementById("notify-button").addEventListener("click", async () => {
  const permission = await Notification.requestPermission();
  sessionStatus.textContent = permission === "granted"
    ? "Browser notifications enabled."
    : "Browser notifications were not enabled.";
});

initializeAuth();

async function initializeAuth() {
  try {
    const redirectResult = await firebaseAuth.getRedirectResult();
    if (redirectResult && redirectResult.user) {
      await finishLogin(redirectResult.user, "Signed in with Google.");
      return;
    }
  } catch (error) {
    loginStatus.textContent = humanizeGoogleError(error.code || error.message);
  }

  firebaseAuth.onAuthStateChanged(async (user) => {
    if (!user) {
      return;
    }
    if (!state.idToken) {
      await finishLogin(user, "Signed in.");
    }
  });
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) {
    loginStatus.textContent = "Enter email and password first.";
    return;
  }

  loginStatus.textContent = "Signing in...";
  try {
    const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
    await finishLogin(result.user, "Signed in.");
  } catch (error) {
    loginStatus.textContent = humanizeAuthError(error.code || error.message);
  }
}

async function registerAdmin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) {
    loginStatus.textContent = "Enter email and password first.";
    return;
  }

  loginStatus.textContent = "Creating admin account...";
  try {
    const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    await finishLogin(result.user, "Admin account created and signed in.");
  } catch (error) {
    loginStatus.textContent = humanizeAuthError(error.code || error.message);
  }
}

async function loginWithGoogle() {
  loginStatus.textContent = "Opening Google sign-in...";
  try {
    const isSmallTouchScreen = window.matchMedia("(max-width: 900px)").matches;
    if (isSmallTouchScreen) {
      await firebaseAuth.signInWithRedirect(googleProvider);
      return;
    }

    const result = await firebaseAuth.signInWithPopup(googleProvider);
    await finishLogin(result.user, "Signed in with Google.");
  } catch (error) {
    const code = error.code || error.message;
    if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
      loginStatus.textContent = "Popup was blocked. Switching to full-page Google sign-in...";
      await firebaseAuth.signInWithRedirect(googleProvider);
      return;
    }
    loginStatus.textContent = humanizeGoogleError(code);
  }
}

async function finishLogin(user, message) {
  state.idToken = await user.getIdToken();
  state.refreshToken = user.refreshToken || "";
  state.email = user.email || "Google account";
  loginPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  sessionEmail.textContent = state.email;
  sessionStatus.textContent = "Connected to Firebase. Polling every 10 seconds.";
  loginStatus.textContent = message;
  await refreshDashboard();
  startPolling();
}

async function logout() {
  state.idToken = "";
  state.refreshToken = "";
  state.email = "";
  state.seenOpenAlerts.clear();
  clearInterval(state.pollHandle);
  state.pollHandle = null;
  await firebaseAuth.signOut();
  dashboard.classList.add("hidden");
  loginPanel.classList.remove("hidden");
  loginStatus.textContent = "Signed out.";
}

function startPolling() {
  clearInterval(state.pollHandle);
  state.pollHandle = setInterval(refreshDashboard, 10000);
}

async function refreshDashboard() {
  if (!state.idToken) {
    return;
  }

  sessionStatus.textContent = "Refreshing dashboard...";
  try {
    const [alerts, users] = await Promise.all([
      fetchJson(`${firebaseConfig.databaseURL}/alerts.json?auth=${encodeURIComponent(state.idToken)}`),
      fetchJson(`${firebaseConfig.databaseURL}/users.json?auth=${encodeURIComponent(state.idToken)}`)
    ]);

    renderAlerts(alerts || {});
    renderUsers(users || {});
    sessionStatus.textContent = `Last synced ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    sessionStatus.textContent = `Refresh failed: ${error.message}`;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function renderAlerts(alerts) {
  const items = Object.values(alerts).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const openItems = items.filter((item) => item.status === "OPEN");
  openAlertsCount.textContent = String(openItems.length);

  alertsList.innerHTML = "";
  if (items.length === 0) {
    alertsList.innerHTML = `<div class="item-card"><p>No alerts yet.</p></div>`;
    return;
  }

  for (const alert of items) {
    const card = document.createElement("article");
    card.className = `item-card ${alert.status === "OPEN" ? "alert-open" : ""}`;
    card.innerHTML = `
      <p class="eyebrow">${escapeHtml(alert.reason || "UNKNOWN")}</p>
      <h3>${escapeHtml(alert.userId || "Unknown user")}</h3>
      <div class="meta-row">
        <p>Status: ${escapeHtml(alert.status || "UNKNOWN")}</p>
        <p>Created: ${formatTimestamp(alert.createdAt)}</p>
        <p>Location: ${formatLocation(alert.currentLocation, alert.lastKnownLocation)}</p>
        <p>Location source: ${escapeHtml(alert.locationStatus || "Unavailable")}</p>
      </div>
    `;

    appendLocationUi(card, alert.currentLocation, alert.lastKnownLocation);

    if (alert.status === "OPEN") {
      const actions = document.createElement("div");
      actions.className = "card-actions";
      const resolveButton = document.createElement("button");
      resolveButton.className = "danger";
      resolveButton.textContent = "Mark resolved";
      resolveButton.addEventListener("click", () => resolveAlert(alert.alertId));
      actions.appendChild(resolveButton);
      card.appendChild(actions);

      if (!state.seenOpenAlerts.has(alert.alertId)) {
        state.seenOpenAlerts.add(alert.alertId);
        maybeNotify(alert);
      }
    }

    alertsList.appendChild(card);
  }
}

function renderUsers(users) {
  const items = Object.values(users).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  usersCount.textContent = String(items.length);
  waitingCount.textContent = String(items.filter((user) => user.status === "WAITING_FOR_OK").length);

  usersList.innerHTML = "";
  if (items.length === 0) {
    usersList.innerHTML = `<div class="item-card"><p>No users found.</p></div>`;
    return;
  }

  for (const user of items) {
    const card = document.createElement("article");
    card.className = "item-card";
    card.innerHTML = `
      <p class="eyebrow">${escapeHtml(user.displayName || "User")}</p>
      <h3>${escapeHtml(user.uid || "Unknown")}</h3>
      <div class="meta-row">
        <p>Status: ${escapeHtml(user.status || "UNKNOWN")}</p>
        <p>Monitoring: ${user.monitoringEnabled ? "On" : "Off"}</p>
        <p>Last check-in: ${formatTimestamp(user.lastCheckInAt)}</p>
        <p>Next check: ${formatTimestamp(user.nextCheckAt)}</p>
        <p>Last location: ${formatLocation(user.currentLocation, user.lastKnownLocation)}</p>
      </div>
    `;
    appendLocationUi(card, user.currentLocation, user.lastKnownLocation);
    usersList.appendChild(card);
  }
}

async function resolveAlert(alertId) {
  if (!alertId || !state.idToken) {
    return;
  }

  sessionStatus.textContent = `Resolving ${alertId}...`;
  try {
    await fetchJson(
      `${firebaseConfig.databaseURL}/alerts/${encodeURIComponent(alertId)}.json?auth=${encodeURIComponent(state.idToken)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RESOLVED",
          resolvedAt: Date.now(),
          resolvedBy: state.email
        })
      }
    );
    await refreshDashboard();
  } catch (error) {
    sessionStatus.textContent = `Resolve failed: ${error.message}`;
  }
}

function maybeNotify(alert) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const body = `${alert.reason || "Emergency"} for ${alert.userId || "unknown user"}\n${formatLocation(alert.currentLocation, alert.lastKnownLocation)}`;
  new Notification("Eco alert", { body });
}

function formatLocation(currentLocation, lastKnownLocation) {
  const location = currentLocation || lastKnownLocation;
  if (!location) {
    return "No location shared";
  }
  return `${Number(location.latitude).toFixed(5)}, ${Number(location.longitude).toFixed(5)}`;
}

function appendLocationUi(card, currentLocation, lastKnownLocation) {
  const location = currentLocation || lastKnownLocation;
  if (!location || Number.isNaN(Number(location.latitude)) || Number.isNaN(Number(location.longitude))) {
    return;
  }

  const lat = Number(location.latitude);
  const lng = Number(location.longitude);
  const iframe = document.createElement("iframe");
  iframe.className = "map-frame";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  card.appendChild(iframe);

  const links = document.createElement("div");
  links.className = "location-links";
  links.innerHTML = `
    <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}" target="_blank" rel="noreferrer">OpenStreetMap</a>
    <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noreferrer">Google Maps</a>
  `;
  card.appendChild(links);
}

function formatTimestamp(value) {
  if (!value) {
    return "Not available";
  }
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function humanizeAuthError(message) {
  switch (message) {
    case "auth/user-not-found":
    case "EMAIL_NOT_FOUND":
      return "No admin account exists with that email. Use Create admin account first.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "INVALID_LOGIN_CREDENTIALS":
    case "INVALID_PASSWORD":
      return "Wrong email or password.";
    case "auth/email-already-in-use":
    case "EMAIL_EXISTS":
      return "That email already exists. Use Sign in instead.";
    case "auth/operation-not-allowed":
    case "OPERATION_NOT_ALLOWED":
      return "Email/password login is disabled in Firebase Authentication. Enable it in Firebase Console.";
    case "auth/weak-password":
    case "WEAK_PASSWORD : Password should be at least 6 characters":
      return "Password must be at least 6 characters.";
    default:
      return message;
  }
}

function humanizeGoogleError(message) {
  switch (message) {
    case "auth/operation-not-allowed":
      return "Google sign-in is disabled in Firebase Authentication. Enable Google provider in Firebase Console.";
    case "auth/popup-blocked":
      return "The popup was blocked by the browser. Allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "The Google popup was closed before sign-in finished.";
    case "auth/unauthorized-domain":
      return "This page must be served from an authorized domain such as localhost or Firebase Hosting, not directly from file://.";
    default:
      return message;
  }
}
