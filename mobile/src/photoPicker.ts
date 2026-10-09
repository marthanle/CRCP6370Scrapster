import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export interface PickedPhoto {
  uri: string;
  base64: string;
  mediaType: string;
}

export class PhotoPermissionError extends Error {}

/**
 * "camera" opens the camera on a phone; the web has no camera roll API, so it
 * falls back to the file picker there. "library" always opens the photo library.
 */
export async function pickPhoto(from: "camera" | "library" = "camera"): Promise<PickedPhoto | null> {
  const useCamera = from === "camera" && Platform.OS !== "web";
  const permission = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new PhotoPermissionError(
      useCamera ? "Camera access is needed to scan." : "Photo access is needed to pick a photo.",
    );
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 0.6,
    base64: true,
  };
  const result = useCamera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options);

  const asset = !result.canceled ? result.assets[0] : undefined;
  if (!asset?.base64) return null;
  return { uri: asset.uri, base64: asset.base64, mediaType: asset.mimeType ?? "image/jpeg" };
}
