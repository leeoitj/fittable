require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("JPG, PNG, WEBP 이미지 파일만 업로드할 수 있어요."));
    }
    cb(null, true);
  }
});

app.post("/api/analyze-meal", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "사진을 먼저 선택해 주세요." });
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: ".env 파일에 GEMINI_API_KEY를 설정해 주세요." });
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `한국어 영양 코치로서 이 음식 사진을 분석하세요. 목표: ${req.body.goal || "린매스업"}, 식사: ${req.body.meal || "점심"}, 메모: ${String(req.body.notes || "").slice(0,500)}.
JSON 객체만 반환하세요. 형식:
{"foods":[{"name":"음식명","portion":"추정량","calories":숫자,"protein":숫자,"carbs":숫자,"fat":숫자}],"total":{"calories":숫자,"protein":숫자,"carbs":숫자,"fat":숫자},"summary":"분석 설명과 불확실성","recommendations":["추천 1","추천 2","추천 3"]}
영양 수치는 사진 기반 추정치임을 명시하고, 수치는 0 이상의 숫자로 작성하세요.`;
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: [
        { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString("base64") } },
        { text: prompt }
      ],
      config: { responseMimeType: "application/json" }
    });
    let data;
    try { data = JSON.parse(response.text); }
    catch { return res.status(502).json({ error: "AI 응답을 읽지 못했어요. 다시 시도해 주세요." }); }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "분석 중 오류가 발생했어요." });
  }
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use((err, _req, res, _next) => res.status(400).json({ error: err.message || "요청 오류" }));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`FitTable 실행 중: http://localhost:${port}`));
