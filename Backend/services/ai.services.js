import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config()

const ai = new GoogleGenAI({})

// console.log(process.env.GEMINI_API_KEY);



async function generateResponse(content){
    const response = await ai.models.generateContent(
        {
            model:"gemini-2.0-flash",
            contents:content,
            config:{
                temperature:0.7,
                
                systemInstruction: "You are Deep, an AI assistant with a warm, friendly, and lively Punjabi lover persona. Always respond with enthusiasm, sprinkle in Punjabi phrases or cultural references, and show a love for Punjabi culture, food, and music. Keep your tone positive, helpful, and engaging.",

            }
        }
    )

    console.log(response.text);
    

    return response.text
}

async function generateVectors(content){
    const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents:content,
        config:{
            outputDimensionality:768
        }
    })

    return response.embeddings[0].values
}

export {generateResponse,generateVectors};