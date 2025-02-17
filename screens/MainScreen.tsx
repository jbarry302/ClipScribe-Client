import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function VideoTranscriptionScreen() {
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);

    const handleVideoUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: "video/*",
        });
        if (result.canceled) return;
        setVideoUri(result.assets[0].uri);
    };

    const handleTranscription = () => {
        setTranscription("This is a sample transcribed text from the video...");
    };

    const handleCopyToClipboard = () => {
        Clipboard.setStringAsync(transcription || "");
    };

    const handleSaveAsFile = async () => {
        if (!transcription) return;
        const fileUri = FileSystem.documentDirectory + "transcription.txt";
        await FileSystem.writeAsStringAsync(fileUri, transcription, { encoding: FileSystem.EncodingType.UTF8 });
        alert("File saved at: " + fileUri);
    };

    return (
        <View className="flex-1 flex-col lg:flex-row bg-gray-100 p-4">
            <View className="flex-1 p-4 bg-white rounded-lg shadow-lg">
                <Text className="text-xl font-bold text-gray-900 mb-4">📹 Video Input</Text>

                {/* Video Container */}
                <View className="h-60 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {videoUri ? (
                        <Video
                            source={{ uri: videoUri }}
                            style={{ width: "100%", height: "100%" }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                        />
                    ) : (
                        <Text className="text-gray-600">No video selected</Text>
                    )}
                </View>

                <View className="mt-4 space-y-3">
                    <TouchableOpacity
                        onPress={handleVideoUpload}
                        className="bg-blue-600 p-3 rounded-lg flex-row items-center justify-center shadow-md"
                    >
                        <Feather name="upload" size={20} color="white" />
                        <Text className="text-white font-bold ml-2">Upload Video</Text>
                    </TouchableOpacity>

                    {videoUri && (
                        <TouchableOpacity
                            onPress={handleTranscription}
                            className="bg-green-600 p-3 rounded-lg flex-row items-center justify-center shadow-md"
                        >
                            <MaterialIcons name="subtitles" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Transcribe Video</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View className="flex-1 p-4 bg-gray-50 rounded-lg shadow-lg mt-4 lg:mt-0 lg:ml-4">
                <Text className="text-xl font-bold text-gray-900 mb-4">📜 Transcribed Text</Text>

                <ScrollView className="h-60 bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                    <Text className="text-gray-800">{transcription || "Transcription will appear here..."}</Text>
                </ScrollView>

                {transcription && (
                    <View className="mt-4 flex-row space-x-2">
                        <TouchableOpacity
                            onPress={handleCopyToClipboard}
                            className="flex-1 bg-gray-700 p-3 rounded-lg flex-row items-center justify-center shadow-md"
                        >
                            <Feather name="copy" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Copy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSaveAsFile}
                            className="flex-1 bg-purple-600 p-3 rounded-lg flex-row items-center justify-center shadow-md"
                        >
                            <Feather name="download" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Save as File</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
