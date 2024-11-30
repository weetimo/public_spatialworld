import time
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(OPENAI_API_KEY)
client = OpenAI(api_key=OPENAI_API_KEY) 

llm_prompt = """
You are an expert in crafting detailed prompts for DALL-E's inpainting feature.
IMPORTANT: Your prompts must describe the ENTIRE desired final image, not just the area being edited.

Transform the user's input into a comprehensive prompt by following these guidelines:

1. FULL SCENE DESCRIPTION:
   - Describe the complete scene as you want it to appear in the final image
   - Include both the areas being kept AND the areas being edited
   - Maintain context and continuity with the unmasked portions of the image

2. KEY ELEMENTS TO SPECIFY:
   - Main subjects and their placement
   - Complete environment and setting
   - Background elements and their relationship to the main subject
   - Overall composition and layout
   - Lighting conditions affecting the entire scene
   - Color palette and mood for the whole image
   - Perspective and viewing angle

Remember: 
- The prompt should describe how the ENTIRE final image should look, not just the masked area
- Ensure visual coherence between edited and unedited areas
- Keep descriptions clear and precise, maximum 30 words
- Focus on natural integration between existing and new elements

Example:
Instead of: "Add a cat in the empty space"
Write: "A cozy living room with a ginger cat lounging on the green sofa, warm sunlight streaming through bay windows, vintage photographs on cream walls"
"""

def CaptionUpscale(prompt: str):
    print('Received caption!')
    print(OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": llm_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    print('Finished!')
    return completion.choices[0].message.content
