// utils/mediaUtils.ts
import { Platform } from "react-native";


export const generateWebThumbnail = (uri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS !== "web") {
            reject(new Error("This function is only supported on web"));
            return;
        }

        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        video.onloadedmetadata = () => {
            video.currentTime = 1; // Seek to 1 second
        };

        video.onseeked = () => {
            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }
            canvas.width = 64;
            canvas.height = 64;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            resolve(dataUrl);
        };

        video.onerror = () => {
            reject(new Error("Failed to load video"));
        };

        if (uri.startsWith("blob:")) {
            fetch(uri)
                .then((res) => res.blob())
                .then((blob) => {
                    video.src = URL.createObjectURL(blob);
                })
                .catch(reject);
        } else {
            video.src = uri;
        }
    });
};