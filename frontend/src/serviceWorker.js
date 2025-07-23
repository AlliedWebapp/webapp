const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:5000'
  : 'https://backend-services-theta.vercel.app'

  // const API_BASE_URL = process.env.NODE_ENV === 'production'
  // ? 'https://backend-services-theta.vercel.app'
  // : 'http://localhost:5000'

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    if (publicUrl.origin !== window.location.origin) {
      console.warn("Service worker won't work if PUBLIC_URL is on a different origin.");
      return;
    }

    window.addEventListener("load", async () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        await checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log("App is being served cache-first by a service worker.");
        });
      } else {
        await registerValidSW(swUrl, config);
      }

      await checkBackendConnection();
    });
  }
}

async function checkBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("✅ Successfully connected to the backend:", API_BASE_URL);
    } else {
      console.warn("⚠ Backend connection issue:", response.status, response.statusText);
    }
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("❌ Network error or CORS issue. Backend might not be reachable.");
    } else {
      console.error("❌ Failed to connect to backend:", error);
    }
  }
}

async function registerValidSW(swUrl, config) {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);
    console.log("✅ Service Worker registered successfully:", registration);

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            console.log("🔄 New content available, will be used after page refresh.");
            if (config?.onUpdate) config.onUpdate(registration);
          } else {
            console.log("📦 Content is cached for offline use.");
            if (config?.onSuccess) config.onSuccess(registration);
          }
        }
      };
    };
  } catch (error) {
    console.error("❌ Service Worker registration failed:", error);
  }
}

async function checkValidServiceWorker(swUrl, config) {
  try {
    const response = await fetch(swUrl, { headers: { "Service-Worker": "script" } });
    const contentType = response.headers.get("content-type");
    if (
      response.status === 404 ||
      (contentType && !contentType.includes("javascript"))
    ) {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      window.location.reload();
    } else {
      await registerValidSW(swUrl, config);
    }
  } catch (error) {
    console.warn("⚠ No internet connection. App is running in offline mode.");
  }
}

export async function unregister() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      console.log("❌ Service Worker unregistered.");
    } catch (error) {
      // Optionally log error
    }
  }
}
