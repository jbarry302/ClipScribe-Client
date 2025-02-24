// utils/whisperTranscriptionService.ts

// Base JSON response (default or "json")
export type JsonTranscription = {
    text: string;
};

// Verbose JSON response (for "verbose_json")
export type VerboseJsonTranscription = {
    language: string;
    duration: number;
    text: string;
    words: {
        word: string;
        start: number;
        end: number;
    }[];
    segments: {
        id: number;
        seek: number;
        start: number; // Added per typical Whisper verbose output
        end: number;
        text: string;
        tokens: number[];
        temperature: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
    }[];
};

// Union type for response based on format
export type TranscriptionResponse =
    | string  // For "text", "srt", "vtt"
    | JsonTranscription  // For "json"
    | VerboseJsonTranscription;  // For "verbose_json"

// Options for the transcribe method
export interface TranscriptionOptions {
    file: { uri: string; name?: string; type?: string }; // Required file object
    language?: string; // Optional ISO-639-1 code (e.g., "en")
    prompt?: string; // Optional prompt
    responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt"; // Optional, defaults to "json"
    temperature?: number; // Optional, 0 to 1
    timestampGranularities?: ("word" | "segment")[]; // Optional, requires "verbose_json"
}

export class WhisperTranscriptionService {
    private baseUrl: string;

    constructor(baseUrl: string = "http://localhost:3000") {
        this.baseUrl = baseUrl;
    }

    async transcribe(options: TranscriptionOptions): Promise<TranscriptionResponse> {
        throw new Error("Not implemented");
    }

    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }
}