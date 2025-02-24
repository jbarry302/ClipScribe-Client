import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Image, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Feather } from "@expo/vector-icons";
import { generateWebThumbnail } from "@/utils/mediaUtils"; // Import the utility

export default function MainScreen() {
    const [video, setVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [transcribedText, setTranscribedText] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const pickVideo = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedVideo = result.assets[0];
            setVideo(selectedVideo);
            setTranscribedText(null);

            if (Platform.OS === "web") {
                try {
                    const thumbnail = await generateWebThumbnail(selectedVideo.uri);
                    setThumbnailUri(thumbnail);
                } catch (error) {
                    console.error("Web thumbnail error:", error);
                    setThumbnailUri(null);
                }
            } else {
                try {
                    const { uri } = await VideoThumbnails.getThumbnailAsync(selectedVideo.uri, {
                        time: 1000,
                        quality: 0.8,
                    });
                    setThumbnailUri(uri);
                } catch (error) {
                    console.error("Mobile thumbnail error:", error);
                    setThumbnailUri(null);
                }
            }
        }
    };

    const transcribeVideo = async () => {
        if (!video) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setTranscribedText("This is a sample transcribed text from the uploaded video.".repeat(100));
        }, 3000);
    };

    const copyToClipboard = async () => {
        if (transcribedText) {
            await Clipboard.setStringAsync(transcribedText);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 px-6 py-10">
            <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">AI Video Transcription</Text>
            <Text className="text-gray-500 text-center mb-6">Upload a video and get instant text transcriptions.</Text>

            <View className="flex flex-col md:flex-row gap-6 w-full h-[calc(100vh-200px)]">
                <View className="bg-white p-6 rounded-2xl shadow-md flex flex-col flex-1 min-w-[300px] h-full">
                    <TouchableOpacity
                        onPress={pickVideo}
                        className="border border-gray-300 p-6 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition flex-grow mb-4"
                    >
                        <Feather name="upload-cloud" size={50} color="#4F46E5" />
                        <Text className="text-gray-600 mt-3 font-medium">Tap to Upload Video</Text>
                    </TouchableOpacity>

                    {video && (
                        <View className="mb-4 bg-gray-100 p-4 rounded-xl flex flex-row items-center space-x-4">
                            {thumbnailUri ? (
                                <Image
                                    source={{ uri: thumbnailUri }}
                                    className="w-16 h-16 rounded-lg bg-gray-200"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <Feather name="video" size={24} color="#6B7280" />
                                </View>
                            )}
                            <View className="flex-1">
                                <Text className="text-gray-800 font-medium">{video.name}</Text>
                                {video.size && (
                                    <Text className="text-gray-500 text-sm">{(video.size / 1024 / 1024).toFixed(2)} MB</Text>
                                )}
                            </View>
                        </View>
                    )}

                    <View className="mt-auto">
                        <TouchableOpacity
                            onPress={transcribeVideo}
                            disabled={!video || loading}
                            className={`w-full py-3 rounded-xl flex items-center justify-center transition ${video ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md" : "bg-gray-300"
                                }`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold text-lg">Transcribe</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-white p-6 rounded-2xl shadow-md flex flex-col flex-1 min-w-[300px] h-full">
                    <Text className="text-xl font-semibold text-gray-900 mb-3">Transcription</Text>

                    <View className="flex-1 flex flex-col">
                        <View className="flex-1 bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <ScrollView
                                style={{ flex: 1 }}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                <TextInput
                                    multiline
                                    editable={false}
                                    value={transcribedText || "No transcription yet. Upload a video to begin."}
                                    className="text-gray-800 p-3 flex-1"
                                    style={{ minHeight: 200 }}
                                />
                            </ScrollView>
                        </View>

                        <View className="h-12 flex flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={copyToClipboard}
                                disabled={!transcribedText || isCopied}
                                className={`h-10 w-24 flex flex-row items-center justify-center rounded-md transition-colors ${isCopied ? "bg-green-100 border border-green-300" : "bg-blue-50 hover:bg-blue-100"
                                    }`}
                            >
                                <Feather name={isCopied ? "check" : "copy"} size={20} color={isCopied ? "#15803d" : "#4F46E5"} />
                                <Text
                                    className={`ml-1 text-sm font-medium truncate ${isCopied ? "text-green-700" : "text-blue-600"}`}
                                    numberOfLines={1}
                                >
                                    {isCopied ? "Copied!" : "Copy"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="h-10 flex flex-row items-center">
                                <Feather name="download" size={20} color="#4F46E5" />
                                <Text className="ml-2 text-blue-600 font-medium">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}