import { GoogleGenAI } from "@google/genai";
import { NDAFormData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNDADocument = async (data: NDAFormData): Promise<string> => {
  const { type, partyA, partyB, purpose, effectiveDate, duration, jurisdiction, clauses, country } = data;

  const optionalClauses = [];
  if (clauses.nonCompete) optionalClauses.push("Non-Compete Clause");
  if (clauses.nonSolicitation) optionalClauses.push("Non-Solicitation Clause");
  if (clauses.ipOwnership) optionalClauses.push("Intellectual Property Ownership Clause");
  if (clauses.dataProtection) optionalClauses.push("Data Protection and Privacy Clause");

  const prompt = `
    Draft a professional, legally binding Non-Disclosure Agreement (NDA) with the following specifications:

    1. **Type**: ${type} NDA.
    2. **Party A** (Disclosing/Receiving or Mutual): ${partyA}
    3. **Party B** (Disclosing/Receiving or Mutual): ${partyB}
    4. **Purpose** of Disclosure: ${purpose}
    5. **Effective Date**: ${effectiveDate}
    6. **Term**: Confidentiality obligations last for ${duration} years.
    7. **Country**: ${country}
    8. **Governing Law/Jurisdiction**: ${jurisdiction} (Ensure it complies with the laws of ${country}).
    9. **Additional Clauses to Include**: ${optionalClauses.join(', ') || "None"}

    **Format Requirements**:
    - Use a standard legal document layout with clearly numbered sections (1., 2., 3., etc.).
    - Use CAPS for section headers.
    - Start with a preamble identifying the parties, date, and location (${country}).
    - **Country-Specific Nuances**: Ensure terminology and legal references are appropriate for ${country}.
      - If Country is India: Explicitly reference the **Indian Contract Act, 1872** and, if applicable, the Information Technology Act, 2000. Use Indian English spelling (e.g., 'authorised').
    - End with signature blocks for both parties.
    - Ensure the tone is formal, precise, and authoritative.
    - Do NOT include any conversational filler before or after the document. Start directly with the Title.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are HYRON AI, an expert legal AI assistant. Your task is to draft precise legal documents tailored to specific countries and jurisdictions, with a focus on Indian Law when applicable. Do not provide legal advice, simply generate the document structure requested.",
        temperature: 0.3, 
      }
    });

    return response.text || "Error: No text generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate NDA. Please check your connection and try again.");
  }
};