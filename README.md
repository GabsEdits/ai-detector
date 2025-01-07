<div align="center">
  <h1>AI Detector</h1>
  <p>An API (with a webapp) that detects if a text is AI-generated</p>
</div>

## Algorithm

The algorithm is based on a comprehensive analysis of the text, including character count, word count, sentence count, unique word count, and average sentence length. It calculates word frequency, identifies the most used word, and evaluates sentence lengths to determine mean and variance. The type-token ratio is computed to assess lexical diversity. Additionally, the algorithm generates bigrams and trigrams to analyze word pairings and triplets. Heuristic patterns are checked to identify common AI-generated text phrases. The AI probability is adjusted based on sentence complexity and repetition checks, resulting in a final AI probability score.

## API

The API is available at [ai-detector-api.deno.dev](https://ai-detector-api.deno.dev).

### Installation

(After cloning the repository, and installing Deno, and being in the root directory of the project)

### Running the API

```bash
deno run -N api/mod.ts
```

### Endpoints

> ![NOTE]
> Replace `:text` with the text you want to analyze.

- `/:text` - Analyze the text and return the AI probability score in JSON format.
- `/full/:text` - Return all the statistics in JSON format (including: character count, word count, sentence count, unique word count, average sentence length, word frequency, most used word, type-token ratio, bigrams, trigrams, AI probability score).

### Example

```bash
curl https://ai-detector-api.deno.dev/This%20is%20an%20example%20text%20to%20analyze%20using%20the%20API
```

## Webapp

The webapp is available at [ai-detector.gxbs.dev](https://ai-detector.gxbs.dev), and is built using [Fresh](https://fresh.deno.dev).

### Installation

(After cloning the repository, and installing Deno, and being in the root directory of the project)

```
deno i
```

### Running the Webapp

Development Server (with auto-reload):

```bash
deno run start
```

Build:

```bash
deno run build
```

## License

This project is open source and available under the [MIT License](LICENSE.txt).
