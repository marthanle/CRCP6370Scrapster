import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export interface PickedPhoto {
  base64: string;
  mediaType: string;
}

export class PhotoPermissionError extends Error {}

/** Camera on a phone, photo library on web (browsers have no camera roll API here). */
export async function pickPhoto(): Promise<PickedPhoto | null> {
  const useCamera = Platform.OS !== "web";
  const permission = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new PhotoPermissionError(
      useCamera ? "Camera access is needed to scan." : "Photo access is needed to scan.",
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
  return { base64: asset.base64, mediaType: asset.mimeType ?? "image/jpeg" };
}
