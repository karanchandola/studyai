
import { HfInference } from "@huggingface/inference";
import { NextResponse } from 'next/server';

export async function POST(req) {
    const client = new HfInference(process.env.HF_TOKEN);

    const { input } = await req.json(); // Use req.json() to parse the request body
    let out = "";

    try {
        const stream = client.chatCompletionStream({
            model: "deepseek-ai/DeepSeek-R1",
            messages: [
                {
                    role: "user",
                    content: `IMPORTANT: Do NOT include any internal monologue, thinking process, or reasoning. 
                    DO NOT use <think> tags or describe what you're thinking. 
                    Your response must ONLY include the final answer. 
                    Any output using <think> will be considered invalid.

                    User's question:
                    ${input}`,
                }
            ],
            provider: "sambanova",
            temperature: 0.5,
            max_tokens: 400,
            top_p: 0.7,
        });

        for await (const chunk of stream) {
            if (chunk.choices && chunk.choices.length > 0) {
                const newContent = chunk.choices[0].delta.content;
                out += newContent;
            }
        }

        // Return the response using NextResponse.json
        // console.log(out);
        out = out.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        return NextResponse.json({ message: "successful", data: out }, { status: 200 });
    } catch (error) {
        console.error('Error fetching response from Hugging Face:', error);
        return NextResponse.json({ error: 'Failed to get response from model', status: 500 });
    }

}
