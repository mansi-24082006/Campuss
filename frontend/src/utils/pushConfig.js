import api from "@/lib/axios";

const VAPID_PUBLIC_KEY = "BHmstq0oLWUDmA03HIBGdVkCimV9i4TKxrGWtnoQfJSToF-KkriiT5en4qC_rGmeF_0YcfDc0BKU4XEay8lReoQ";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const subscribeUserToPush = async () => {
  try {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    
    // Check if subscription already exists
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Notification permission denied");
        return;
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Determine device type
    const ua = navigator.userAgent;
    let deviceType = "desktop";
    if (/mobile/i.test(ua)) deviceType = "mobile";
    if (/tablet/i.test(ua)) deviceType = "tablet";

    // Send subscription to backend
    await api.post("/notifications/subscribe", {
      subscription,
      deviceType
    });

    console.log("Push subscription successful");
  } catch (error) {
    console.error("Error subscribing to push:", error);
  }
};
