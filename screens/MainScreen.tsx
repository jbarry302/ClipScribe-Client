import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Image, Platform, ToastAndroid, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";

export default function MainScreen() {
    const [video, setVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [transcribedText, setTranscribedText] = useState<string | null>(null);

    const pickVideo = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: "video/*" });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setVideo(result.assets[0]);
            setTranscribedText(null);
        }
    };

    const transcribeVideo = async () => {
        if (!video) return;
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setTranscribedText("This is a sample transcribed text from the uploaded video.");
        }, 3000);
    };

    const copyToClipboard = async () => {
        if (transcribedText) {
            await Clipboard.setStringAsync(transcribedText);

            if (Platform.OS === "android") {
                ToastAndroid.show("Copied to clipboard! ✅", ToastAndroid.SHORT);
            } else {
                Alert.alert("Copied!", "Text has been copied to clipboard.");
            }
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
                            <Image source={{ uri: video.uri }} className="w-16 h-16 rounded-lg bg-gray-200" />
                            <View className="flex-1">
                                <Text className="text-gray-800 font-medium">{video.name}</Text>
                                {video.size && <Text className="text-gray-500 text-sm">{(video.size / 1024 / 1024).toFixed(2)} MB</Text>}
                            </View>
                        </View>
                    )}

                    <View className="mt-auto">
                        <TouchableOpacity
                            onPress={transcribeVideo}
                            disabled={!video || loading}
                            className={`w-full py-3 rounded-xl flex items-center justify-center transition ${
                                video ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md" : "bg-gray-300"
                            }`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold text-lg">Transcribe</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-white p-6 rounded-2xl shadow-md flex flex-col flex-1 min-w-[300px] h-full">
                    <Text className="text-xl font-semibold text-gray-900">Transcription</Text>

                    <View className="mt-3 flex-1 bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                            <TextInput
                                multiline
                                editable={false}
                                value={transcribedText || "No transcription yet. Upload a video to begin."}
                                className="text-gray-800 p-3"
                                style={{ flex: 1, minHeight: 200 }}
                            />
                        </ScrollView>
                    </View>

                    <View className="mt-auto flex flex-row justify-between">
                        <TouchableOpacity onPress={copyToClipboard} className="flex flex-row items-center">
                            <Feather name="copy" size={22} color="#4F46E5" />
                            <Text className="ml-2 text-blue-600 font-medium">Copy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex flex-row items-center">
                            <Feather name="download" size={22} color="#4F46E5" />
                            <Text className="ml-2 text-blue-600 font-medium">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
