
import { GoogleGenAI } from "@google/genai";

// It's assumed that process.env.API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const SUNO_V5_GUIDE = `
# The Complete Guide to Writing Custom Lyrics for Suno v5

## Character Limits & Technical Requirements
- Lyrics Field: 5,000 characters
- Style Description Field: 1,000 characters
- Title: 100 characters

## Understanding Meta Tags & Brackets
Meta tags are bracketed instructions [like this] to control the AI. Use square brackets [] for all tags. Place tags before the section they control.

Example:
[Intro]
[Mood: Dark, Intense]

## Song Structure Tags
- [Intro], [Verse], [Verse 1], [Pre-Chorus], [Chorus], [Post-Chorus], [Bridge], [Break], [Drop], [Solo], [Outro], [End]
- Common Structures:
  - Pop/Rock: [Intro] [Verse 1] [Chorus] [Verse 2] [Chorus] [Bridge] [Chorus] [Outro]
  - Rap: [Intro] [Verse 1] (16 bars) [Hook/Chorus] (8 bars) [Verse 2] (16 bars) [Hook/Chorus] [Outro]
  - EDM: [Intro] [Build-Up] [Drop] [Break] [Build-Up] [Drop] [Outro]

## Vocal Tags & Delivery
- Gender/Range: [Vocalist: Male], [Vocalist: Female], [Vocalist: Alto], [Vocalist: Tenor], etc.
- Style: [Vocal Style: Raspy], [Vocal Style: Smooth], [Vocal Style: Whisper], [Vocal Style: Powerful], [Spoken Word]
- Effects: [Vocal Effect: Reverb], [Vocal Effect: Delay], [Vocal Effect: Autotuned], [Vocal Effect: Layered]
- Harmonies: Use (parentheses) for background vocals in lyrics. e.g., "I'm walking alone (walking alone, oh yeah)"

## Style Description Guidelines
The style description is a 1,000-character narrative paragraph. It defines: Genre, Mood, Instrumentation, Production Style, Vocal Characteristics, Tempo, and Era.

Structure as a flowing paragraph, not a list.
Example: "Driving alternative rock anthem with soaring electric guitars, punchy live drums, and warm analog bass. Energetic and uplifting mood with anthemic vocal melodies. Crisp modern production balanced with organic grit. Dynamic build from intimate verses to explosive choruses. Stadium-ready sound with radio-friendly hooks."

**IMPORTANT RULE: Do not use artist names.** The Suno AI does not copy specific artists. Instead of writing "in the style of Queen," describe their sound: "Elaborate 70s stadium rock with layered vocal harmonies, operatic structures, powerful piano, and theatrical, glam-rock aesthetics." Your goal is to describe the *sound*, not name the artist.

## Genre-Specific Lyric Writing

### Rap & Hip-Hop
- Structure: 16-bar verses, 8-bar hooks.
- Rhyme: Use multi-syllable rhymes, internal rhymes. Avoid simple AABB schemes.
- Flow: Use varied cadences like triplet flow.
- Content: Use metaphors, similes, and storytelling. Avoid generic "I'm a great rapper" lines.

### Rock & Metal
- Emotion: Focus on conflict, struggle, anger, triumph.
- Imagery: Use powerful, visceral, and visual language (fire, storms, battles).
- Structure: 8-12 bar verses, 8-16 bar anthemic choruses. Choruses should be memorable and singable.

### Pop
- Simplicity: Clear, universal themes (love, heartbreak, empowerment).
- Catchiness: Repetitive, memorable hooks and simple language.
- Structure: Verse-Chorus-Verse-Chorus-Bridge-Chorus. 8-bar verses/choruses.

### Country & Folk
- Storytelling: Narrative focus, personal experiences, vivid details of places and life.

## Writing Human-Like, Authentic Lyrics
- Write from experience: Base lyrics on real emotions and events.
- Use specific, concrete imagery: Instead of "I'm sad," write "Coffee gone cold, your side of the bed untouched for weeks."
- Avoid AI clichés: "neon lights," "whispers in the dark," "symphony of," "kaleidoscope."
- Use conversational language: Write like you speak, using contractions.
- Show, don't tell: Don't explain the emotion ("I'm heartbroken"), show it with imagery ("I can't get out of bed / Your ghost is in my head").
`;

export async function generateSongContent(songDescription: string): Promise<{ lyrics: string; styleDescription: string }> {
  const model = 'gemini-2.5-pro';

  const prompt = `
CONTEXT:
---
${SUNO_V5_GUIDE}
---

TASK:
You are an expert songwriter and a master of the Suno v5 AI music generation platform. Your task is to generate lyrics and a style description based on the user's song idea, strictly following all the rules, guidelines, and best practices detailed in the context document provided above.

USER'S SONG IDEA:
"${songDescription}"

INSTRUCTIONS:
1.  Analyze the user's song idea. If a genre is not specified, infer the most appropriate genre and style that fits the description.
2.  Generate the **Lyrics**.
    - The lyrics must be complete with appropriate structural meta tags like [Intro], [Verse 1], [Chorus], [Bridge], [Outro].
    - The total character count for the lyrics should generally be between 1,000 and 5,000 characters (including spaces and tags).
    - **Adapt lyric length to the genre**:
        - For lyric-heavy genres like **Rap/Hip-Hop**, aim for longer, denser verses, pushing towards the upper end of the character limit.
        - For instrumental-focused genres like **Phonk, Dubstep, or EDM**, lyrics should be sparse and powerful, often less than 500 characters. Focus on using instrumental and effect tags like \`[Drop]\`, \`[Beat Switch]\`, \`[Synth Solo]\`, \`[Vocal Chop]\`, \`[808 Cowbell Melody]\` to structure the track.
    - Include other relevant meta tags for vocal style, mood, or effects where appropriate.
    - The lyrics themselves must be authentic, human-like, and avoid AI clichés as described in the guide.
    - Adhere to the genre-specific writing style (e.g., 16-bar verses for rap, conflict-driven themes for rock).
3.  Generate the **Style Description**.
    - It must be a single, flowing narrative paragraph. DO NOT use bullet points or lists.
    - **The total length must NOT exceed 1,000 characters, including spaces.**
    - It must describe the genre, mood, instrumentation, production, and overall sonic vision as detailed in the "Style Description Guidelines" section of the guide.
    - **Crucially, if the user mentions a specific artist, band, show, or copyrighted entity, DO NOT use their name in the style description.** Instead, analyze their signature sound, vocal style, instrumentation, and production techniques, and describe those qualities. For example, if the user says "in the style of The Beatles," describe it as "60s British invasion rock with jangly guitars, melodic basslines, three-part vocal harmonies, and a vintage, lo-fi production style," not "A song in the style of The Beatles." This is because the target platform (Suno) does not copy artists. Your job is to translate the *essence* of the requested style into descriptive terms the AI can understand.
4.  Provide the output as a single, valid JSON object with two keys: "lyrics" and "styleDescription". The value for each key must be a string. Ensure the JSON is well-formed.

EXAMPLE OUTPUT FORMAT:
{
  "lyrics": "[Intro]\\n[Mood: Melancholic]\\n...\\n[Chorus]\\n...",
  "styleDescription": "Driving alternative rock anthem with electric guitars that soar and crunch..."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      }
    });
    
    const rawText = response.text.trim();
    // Clean potential markdown code block fences
    const cleanedText = rawText.replace(/^```json\s*|```$/g, '');
    
    const jsonResponse = JSON.parse(cleanedText);

    if (jsonResponse.lyrics && jsonResponse.styleDescription) {
        return {
            lyrics: jsonResponse.lyrics,
            styleDescription: jsonResponse.styleDescription,
        };
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate song content from the AI model.");
  }
}
