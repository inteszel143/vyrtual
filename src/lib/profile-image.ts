const PROFILE_IMAGE_KEY = "vyrtual-profile-image";
const PROFILE_IMAGE_EVENT = "vyrtual-profile-image-change";

export function getProfileImageSnapshot() {
  return window.localStorage.getItem(PROFILE_IMAGE_KEY) ?? "";
}

export function getProfileImageServerSnapshot() {
  return "";
}

export function subscribeToProfileImage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PROFILE_IMAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROFILE_IMAGE_EVENT, callback);
  };
}

export function saveProfileImage(image: string) {
  window.localStorage.setItem(PROFILE_IMAGE_KEY, image);
  window.dispatchEvent(new Event(PROFILE_IMAGE_EVENT));
}

export function removeProfileImage() {
  window.localStorage.removeItem(PROFILE_IMAGE_KEY);
  window.dispatchEvent(new Event(PROFILE_IMAGE_EVENT));
}

export function optimizeProfileImage(file: File) {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Choose an image file."));
  }
  if (file.size > 10 * 1024 * 1024) {
    return Promise.reject(new Error("Choose an image smaller than 10 MB."));
  }

  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Your browser could not process this image."));
        return;
      }

      context.fillStyle = "#15151c";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be opened. Try a different file."));
    };
    image.src = objectUrl;
  });
}
