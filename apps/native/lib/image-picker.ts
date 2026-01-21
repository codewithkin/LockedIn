import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export interface ImagePickerResult {
  uri: string;
  base64?: string;
  width: number;
  height: number;
  type: "image" | "video";
}

export async function pickImage(): Promise<ImagePickerResult | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    console.log("Permission to access media library was denied");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    base64: asset.base64 ?? undefined,
    width: asset.width,
    height: asset.height,
    type: "image",
  };
}

export async function takePhoto(): Promise<ImagePickerResult | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    console.log("Permission to access camera was denied");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    base64: asset.base64 ?? undefined,
    width: asset.width,
    height: asset.height,
    type: "image",
  };
}

export async function getFileInfo(uri: string) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo;
  } catch (error) {
    console.log("Error getting file info:", error);
    return null;
  }
}
