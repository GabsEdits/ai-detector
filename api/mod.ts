import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.use("*", (c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set("Access-Control-Allow-Methods", "GET, POST");
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return next();
});

function analyzeText(text: string) {
  const charactersCount = text.length;
  const words = text.split(/\s+/).filter(Boolean);
  const wordsCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((sentence) =>
    sentence.trim() !== ""
  );
  const sentencesCount = sentences.length;
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
  const uniqueWordCount = uniqueWords.size;
  const averageSentenceLength = sentencesCount > 0
    ? wordsCount / sentencesCount
    : 0;

  const wordFrequency = words.reduce((acc, word) => {
    const lowerWord = word.toLowerCase();
    acc[lowerWord] = (acc[lowerWord] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedWordEntry = Object.entries(wordFrequency).reduce((a, b) =>
    b[1] > a[1] ? b : a
  );

  const sentenceLengths = sentences.map((sentence) =>
    sentence.split(/\s+/).filter(Boolean).length
  );
  const meanSentenceLength =
    sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length || 0;
  const varianceSentenceLength = sentenceLengths.reduce(
        (a, b) => a + Math.pow(b - meanSentenceLength, 2),
        0,
      ) / sentenceLengths.length || 0;

  const typeTokenRatio = wordsCount > 0 ? uniqueWordCount / wordsCount : 0;

  const nGrams = (n: number) => {
    const nGrams: Record<string, number> = {};
    for (let i = 0; i <= words.length - n; i++) {
      const gram = words.slice(i, i + n).join(" ");
      nGrams[gram] = (nGrams[gram] || 0) + 1;
    }
    return nGrams;
  };
  const bigrams = nGrams(2);
  const trigrams = nGrams(3);

  const heuristicPatterns = [
    /in conclusion/i,
    /it is important to note/i,
    /as mentioned above/i,
    /thus/i,
    /moreover/i,
  ];
  const heuristicMatches = heuristicPatterns.some((pattern) =>
    pattern.test(text)
  );
  let aiProbability = heuristicMatches ? 41 : 9;

  const sentenceComplexity = varianceSentenceLength > 5 ? 6 : -4;
  const repetitionCheck = checkRepetition(text) ? 5 : -4;
  aiProbability += sentenceComplexity + repetitionCheck;
  aiProbability = Math.max(0, Math.min(100, aiProbability));

  return {
    charactersCount,
    wordsCount,
    sentencesCount,
    uniqueWordCount,
    averageSentenceLength,
    mostUsedWord: mostUsedWordEntry[0],
    meanSentenceLength,
    varianceSentenceLength,
    typeTokenRatio,
    bigrams,
    trigrams,
    heuristicMatches,
    aiProbability,
  };
}

function getTextParam(c: { req: { param: (arg: string) => string } }) {
  return decodeURIComponent(c.req.param("text"));
}

function checkRepetition(text: string): boolean {
  const words = text.split(/\s+/);
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }
  return [...wordCounts.values()].some((count) => count > 2);
}

app.get("/full/:text", (c) => {
  const text = getTextParam(c);
  const analysis = analyzeText(text);
  return c.json(analysis);
});

app.get("/summary/:text", (c) => {
  const text = getTextParam(c);
  const analysis = analyzeText(text);
  return c.json({
    charactersCount: analysis.charactersCount,
    wordsCount: analysis.wordsCount,
    sentencesCount: analysis.sentencesCount,
    uniqueWordCount: analysis.uniqueWordCount,
  });
});

app.get("/ai-probability/:text", (c) => {
  const text = getTextParam(c);
  const analysis = analyzeText(text);
  return c.json({ aiProbability: analysis.aiProbability });
});

app.post("/analyze", async (c) => {
  const { text } = await c.req.json();
  const analysis = analyzeText(text);
  return c.json(analysis);
});

app.notFound((c) => c.text("Not Found", 404));

Deno.serve({ port: 8001 }, app.fetch);

export { app };
