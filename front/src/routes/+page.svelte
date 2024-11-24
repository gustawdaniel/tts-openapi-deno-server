<script lang="ts">
    interface Lang {
        text: string;
        value: string;
    }

    let languages: Lang[] = [
        { text: 'Polish', value: 'pl' },
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' },
        { text: 'French', value: 'fr' },
        { text: 'Italian', value: 'it' },
        { text: 'Spanish', value: 'es' },
        { text: 'Russian', value: 'ru' },
        { text: 'Japanese', value: 'ja' },
        { text: 'Chinese', value: 'zh' },
        { text: 'Norwegian', value: 'nb' },
        { text: 'Arabic', value: 'ar' },
        { text: 'Dutch', value: 'nl' },
    ];

    let selectedLanguage = "en"; // reactive variable for the selected language
    let baseUrl = "https://danielgustaw-tts.deno.dev";
    let inputText = "23";

    const setDefaultValue = (value: string) => {
        baseUrl = value;
    };

    const playAudio = async () => {
        if (!baseUrl || !inputText) {
            alert("Please set the base URL and text!");
            return;
        }

        try {
            const url = `${baseUrl}/speak/${encodeURIComponent(selectedLanguage)}/${encodeURIComponent(inputText)}`;

            console.log('url', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch the audio");
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            await audio.play();
        } catch (error) {
            console.error("Error:", error);
            alert("Error playing audio");
        }
    };
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-3 sm:p-4 md:p-8">
    <div class="max-w-lg mx-auto bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-xl space-y-6">
        <!-- Language Selector -->
        <div>
            <label class="block text-lg font-semibold text-gray-200 mb-2">Language:</label>
            <select
                    bind:value={selectedLanguage}
                    class="bg-gray-700 text-gray-300 rounded-lg p-2 w-full border border-gray-600 focus:ring-2 focus:ring-indigo-500"
            >
                {#each languages as lang}
                    <option value={lang.value}>{lang.text}</option>
                {/each}
            </select>
        </div>

        <!-- Base URL Input -->
        <div>
            <label class="block text-lg font-semibold text-gray-200 mb-2">Base URL:</label>
            <div class="flex flex-wrap md:space-x-2 space-y-2 md:space-y-0">
                <input
                        bind:value={baseUrl}
                        type="text"
                        placeholder="https://danielgustaw-tts.deno.dev"
                        class="bg-gray-700 text-gray-300 rounded-lg p-2 flex-grow border border-gray-600 focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                />
                <button
                        on:click={() => setDefaultValue("http://localhost:8000")}
                        class="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition w-full md:w-auto"
                >
                    Local
                </button>
                <button
                        on:click={() => setDefaultValue("https://danielgustaw-tts.deno.dev")}
                        class="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition w-full md:w-auto"
                >
                    Remote
                </button>
            </div>
        </div>

        <!-- Text Input -->
        <div>
            <label class="block text-lg font-semibold text-gray-200 mb-2">Text:</label>
            <textarea
                    bind:value={inputText}
                    rows="3"
                    placeholder="Enter text to synthesize..."
                    class="bg-gray-700 text-gray-300 rounded-lg p-2 w-full border border-gray-600 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
        </div>

        <!-- Play Button -->
        <div class="text-center">
            <button
                    on:click={playAudio}
                    class="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition"
            >
                ▶ Play
            </button>
        </div>
    </div>
</div>
