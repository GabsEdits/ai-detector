import { useEffect } from "preact/hooks";

export default function Input(
  { onChange, onClear }: { onChange: (event: Event) => void, onClear: () => void },
) {
  const useHumanSampleText = () => {
    const humanSampleText =
      "It was a quiet afternoon, with only the sound of birds chirping in the distance. I walked through the park, watching people go by. Some were jogging, others were sitting on benches, lost in their own thoughts. I noticed a couple of children playing with a frisbee near the pond, their laughter filling the air. The breeze was cool, and the trees rustled gently. I felt at peace, surrounded by the simplicity of nature. There was no rush, just a quiet moment to enjoy the world as it was. I sat on a bench for a while, watching the clouds drift by, my mind clear and calm.";

    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = humanSampleText;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    console.log("Sample text added to textarea");
  };

  const useAISampleText = () => {
    const aiSampleText =
      "In conclusion, it is important to note that the impact of artificial intelligence (AI) on modern society is profound. AI has the potential to change industries in unprecedented ways, with the potential for both positive and negative consequences. As mentioned above, AI can be used for a variety of applications, including healthcare, education, and entertainment. However, it is important to consider the ethical implications of AI as it continues to advance. The ethical concerns surrounding AI are numerous, including issues related to privacy, bias, and job displacement. In order to fully understand the implications of AI, it is necessary to conduct further research and analysis. This analysis will help policymakers make informed decisions about the future of AI. As AI becomes more integrated into our daily lives, it is crucial that we address these concerns to ensure that AI benefits society as a whole. Therefore, we must continue to monitor the development of AI to ensure that it is used responsibly.";

    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = aiSampleText;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    console.log("Sample text added to textarea");
  };

  const handleFileUpload = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const textarea = document.querySelector("textarea");
        if (textarea && e.target) {
          textarea.value = e.target.result as string;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }
      };
      reader.readAsText(file);
    }
  };

  const clearText = () => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = "";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    console.log("Textarea cleared");
    onClear();
  };

  useEffect(() => {
    const humanButton = document.getElementById("use-human-sample-text");
    const aiButton = document.getElementById("use-ai-sample-text");
    const fileInput = document.getElementById("file-input");
    const clearButton = document.getElementById("clear-text");

    if (humanButton) {
      humanButton.addEventListener("click", useHumanSampleText);
    }

    if (aiButton) {
      aiButton.addEventListener("click", useAISampleText);
    }

    if (fileInput) {
      fileInput.addEventListener("change", handleFileUpload);
    }

    if (clearButton) {
      clearButton.addEventListener("click", clearText);
    }

    return () => {
      if (humanButton) {
        humanButton.removeEventListener("click", useHumanSampleText);
      }

      if (aiButton) {
        aiButton.removeEventListener("click", useAISampleText);
      }

      if (fileInput) {
        fileInput.removeEventListener("change", handleFileUpload);
      }

      if (clearButton) {
        clearButton.removeEventListener("click", clearText);
      }
    };
  }, []);

  return (
    <div class="flex flex-col gap-1 items-center justify-center w-full rounded-2xl overflow-hidden">
      <textarea
        class="dark:border-gray-700 h-52 p-5 bg-zinc-100 dark:bg-zinc-900 w-full resize-none"
        placeholder="Enter your text here"
        onInput={onChange}
      >
      </textarea>

      <div class="flex flex-col items-center justify-center gap-4 w-full bg-zinc-100 dark:bg-zinc-900 p-4">
        <div class="flex flex-row items-center justify-center gap-4 w-full">
          <button
            class="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full font-bold"
            id="use-human-sample-text"
          >
            Use Human Sample Text
          </button>
          <button
            class="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full font-bold"
            id="use-ai-sample-text"
          >
            Use AI Sample Text
          </button>
        </div>
        <hr class="w-full border-zinc-300 dark:border-zinc-800" />
        <div class="flex flex-row items-center justify-center gap-4 w-96">
          <label
            class="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full flex justify-center items-center cursor-pointer gap-2"
            htmlFor="file-input"
          >
            <span class="material-symbols-outlined">upload_file</span>
            Upload Text File
          </label>
          <input
            type="file"
            id="file-input"
            class="hidden"
            accept=".txt"
          />
          <button
            class="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full flex justify-center items-center gap-2"
            id="clear-text"
          >
            <span class="material-symbols-outlined">mop</span>
            Clear Text
          </button>
        </div>
      </div>
    </div>
  );
}
