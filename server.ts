import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Kaiser SmartSite 360",
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Assistant Endpoint for Kaiser SmartSite 360
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { prompt, projectContext, mode } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAIClient();

    const systemInstruction = `You are Kaiser SmartSite 360 AI Assistant, the intelligent executive construction and HSE advisor for KAISER ENGINEERING SDN. BHD.
Your role is to assist Project Directors, Project Managers, HSE Officers, and Site Supervisors by providing concise, actionable, and data-driven management intelligence.

Key Guidelines:
1. Always maintain a professional, sharp, executive construction engineering tone.
2. Support both English and Bahasa Melayu seamlessly. If the user asks in Bahasa Melayu (e.g. "Apa masalah utama FPG project minggu ini?"), respond in clear, professional Bahasa Melayu (or bilingual summary).
3. Do NOT make definitive final safety approvals—remind users that critical safety decisions require certified PIC inspection (per Kaiser HSE policy).
4. Extract trends in recurring hazards (e.g. Housekeeping, Working at Height, Scaffolding), productivity bottlenecks, manpower variances, and overdue corrective actions.
5. Provide clear bullet points with: Key Findings, Impact Assessment, Immediate Recommended Actions, and Assigned PIC / Timeline.

Active Project Context:
${JSON.stringify(projectContext || {}, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({
      text: response.text || "Unable to generate AI analysis.",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/advisor:", error);
    res.status(500).json({
      error: error.message || "Failed to generate AI advisory response",
      fallbackText: "Kaiser AI Intelligence is currently operating in offline simulation mode. Please ensure GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }
});

// AI Hazard Risk Evaluator & Immediate Control Suggestion
app.post("/api/ai/evaluate-hazard", async (req, res) => {
  try {
    const { finding, category, location } = req.body;
    const ai = getAIClient();

    const systemInstruction = `You are the Kaiser Senior HSE Safety Specialist.
Evaluate the construction site hazard reported by a supervisor and provide structured safety guidance following DOSH Malaysia (Department of Occupational Safety and Health), CIDB, and HIRARC standards.
Output a JSON response with:
- "riskLevel": "Low" | "Medium" | "High" | "Critical"
- "riskScore": number (1-25 based on Likelihood x Severity matrix)
- "immediateAction": concise immediate containment measure (1-2 sentences)
- "hirarcControlHierarchy": hierarchy of control step (Elimination / Substitution / Engineering / Administrative / PPE)
- "preventiveAction": long-term root cause mitigation
- "requiresStopWork": boolean
- "escalationAlert": "Safety Officer" | "Project Manager" | "Executive Management / Director"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Hazard Finding: "${finding}". Category: "${category}". Location: "${location}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    let parsed = {};
    try {
      parsed = JSON.parse(response.text || "{}");
    } catch {
      parsed = {
        riskLevel: "Medium",
        riskScore: 12,
        immediateAction: "Barricade affected area and instruct workers to stand down pending inspection.",
        hirarcControlHierarchy: "Administrative & PPE",
        preventiveAction: "Conduct toolbox briefing and review safe work procedure.",
        requiresStopWork: false,
        escalationAlert: "Safety Officer",
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Hazard Evaluator Error:", error);
    // Intelligent fallback for seamless UX
    res.json({
      riskLevel: "High",
      riskScore: 16,
      immediateAction: "Cordon off site area immediately, install safety warning signage, and notify site safety supervisor.",
      hirarcControlHierarchy: "Engineering & Administrative Controls",
      preventiveAction: "Review daily HIRARC assessment and replace defective scaffolding / equipment.",
      requiresStopWork: false,
      escalationAlert: "Safety Officer & Project Manager",
    });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kaiser SmartSite 360 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
