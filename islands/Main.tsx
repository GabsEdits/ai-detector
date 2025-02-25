import { useEffect, useRef, useState } from "preact/hooks";
import Input from "./Input.tsx";

export default function Main() {
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleInputChange = async (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    const text = target.value;

    try {
      const url = "https://ai-detector-api.deno.dev/";
      const response = await fetch(
        `${url}ai-probability/${encodeURIComponent(text)}`,
      );
      const data = await response.json();
      setProgress(data.aiProbability);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleClearText = () => {
    setProgress(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const radius = canvas.width / 2;
    const lineWidth = 12;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius - lineWidth / 2, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isDarkMode ? "#3f3f46" : "#d1d5db"; // dark:border-zinc-800 or gray-300
    ctx.stroke();

    // Draw progress arc
    const endAngle = (progress / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(
      radius,
      radius,
      radius - lineWidth / 2,
      -Math.PI / 2,
      endAngle - Math.PI / 2,
    );
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = progress < 60 ? "#16a34a" : "#dc2626"; // green-600 or red-600
    ctx.stroke();
  }, [progress, isDarkMode]);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div class={`flex flex-col py-10 gap-4 ${isDarkMode ? "dark" : ""}`}>
      <h1 class="text-3xl font-serif text-center">AI Detector</h1>

      <Input onChange={handleInputChange} onClear={handleClearText} />

      <div class="flex flex-col gap-6 items-center justify-center bg-zinc-100 dark:bg-zinc-900 py-9 rounded-2xl">
        <div class="relative size-48">
          <canvas
            ref={canvasRef}
            width="192"
            height="192"
            class="absolute inset-0"
          >
          </canvas>

          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class={`text-4xl font-serif font-bold ${
                progress < 60 ? "text-green-600" : "text-red-600"
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>
        <p class="text-3xl font-serif font-bold ml-4">likely AI-generated</p>
      </div>
    </div>
  );
}
