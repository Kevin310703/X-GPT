const API_KEY = "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";

export async function queryStableDiffusion(prompt: string) {
    if (!API_KEY) {
        throw new Error("API key is not set.");
    }

    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        }
    );

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.blob();
}

export async function queryVietAI(prompt: string) {
    if (!API_KEY) {
        throw new Error("API key is not set.");
    }

    const response = await fetch(
        "https://api-inference.huggingface.co/models/VietAI/envit5-translation", // URL của mô hình dịch
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }), // Gửi đầu vào
        }
    );

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Trích xuất kết quả dịch
    if (Array.isArray(result) && result.length > 0 && result[0].translation_text) {
        return result[0].translation_text;
    } else {
        throw new Error("Unexpected response format");
    }
}

export async function detectLanguage(text: string): Promise<string> {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/papluca/xlm-roberta-base-language-detection",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to detect language. Status: ${response.status}`);
    }

    const result = await response.json();
    const detectedLanguage = result[0]?.label;
    return detectedLanguage;
}
