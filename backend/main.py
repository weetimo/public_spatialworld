from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from image_segmentation import ImageSegmentationService, PointCoordinates, SegmentationResponse
from topic_modelling import GenerateTopics
from caption_upscaling import CaptionUpscale
from openai import OpenAI
from typing import List, Optional
import os
from PIL import Image, ImageOps
import io
import logging
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

# initialize
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,  
    allow_methods=["*"], 
    allow_headers=["*"], 
)


# intialize image segmentation
# image_segmentation_service = ImageSegmentationService()

client = OpenAI(api_key='OPENAI_API_KEY')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def validate_and_prepare_image(image: UploadFile, target_size: tuple = None) -> io.BytesIO:
    try:
        logger.info(f"Validating image: {image.filename}")
        contents = await image.read()
        image.file.seek(0)
        img = Image.open(io.BytesIO(contents))
        if img.format != 'PNG':
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            contents = buffer.getvalue()

        if target_size and (img.width != target_size[0] or img.height != target_size[1]):
            img = img.resize(target_size, resample=Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            contents = buffer.getvalue()

        if len(contents) > 4 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size must be less than 4 MB after resizing.")

        return io.BytesIO(contents)

    except Exception as e:
        logger.error(f"Error validating image: {str(e)}")
        raise HTTPException(status_code=500, detail="Invalid image format or processing error.")

# @app.post("/api/edit-image")
# async def edit_image(
#     image: UploadFile = File(...),
#     mask: Optional[UploadFile] = File(None),
#     prompt: str = Form(...),
#     size: str = Form("1024x1024")
# ):
#     try:
#         prepared_image = await validate_and_prepare_image(image)
#         if mask:
#             original_image = Image.open(prepared_image)
#             target_size = (original_image.width, original_image.height)
#             prepared_mask = await validate_and_prepare_image(mask, target_size=target_size)
#         else:
#             prepared_mask = None

#         response = client.images.edit(
#             model="dall-e-2",  # Using DALL-E-2 model
#             image=prepared_image,
#             mask=prepared_mask,
#             prompt=prompt,
#             n=1,
#             size=size
#         )
#         return JSONResponse({"success": True, "url": response.data[0].url})

#     except Exception as e:
#         logger.error(f"Error processing image: {str(e)}")
#         raise HTTPException(status_code=500, detail="Image processing failed.")


# @app.post("/api/segment/", response_model=SegmentationResponse)
# async def segment_image(coordinates: PointCoordinates):
#     try:
#         logger.info(f"Received segmentation request for coordinates: {coordinates.point}")
        
#         image_path = os.path.join(image_segmentation_service.working_dir, "input/example.webp")
#         if not os.path.exists(image_path):
#             logger.error(f"Input image not found at path: {image_path}")
#             raise HTTPException(status_code=404, detail="Input image not found")
            
#         logger.info("Processing image segmentation...")
#         encoded_mask = await image_segmentation_service.process_image(
#             image_path,
#             coordinates.point)
#         logger.info("Segmentation completed successfully")
        
#         return SegmentationResponse(
#             success=True,
#             encoded_masks=encoded_mask)
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         logger.error(f"Error during segmentation: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-topics/")
async def generate_topics(request: Request):
    try:
        logger.info("Received topic generation request")
        body = await request.json()
        prompts = body.get("prompts", [])
        if not isinstance(prompts, list) or not all(isinstance(p, str) for p in prompts):
            raise HTTPException(status_code=400, detail="Invalid input. 'prompts' should be a list of strings.")

        logger.info(f"Generating topics for {len(prompts)} prompts...")
        topics = GenerateTopics(prompts)
        logger.info("Topic generation completed")
        return {"topics": topics}

    except Exception as e:
        logger.error(f"Error generating topics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/improve-caption/")
async def improve_caption(request: Request):
    try:
        logger.info("Received caption improvement request")
        body = await request.json()
        user_prompt = body.get("prompt", "")
        
        logger.info("Processing caption improvement...")
        improved_prompt = CaptionUpscale(user_prompt)
        logger.info("Caption improvement completed")
        
        return {"improved_prompt": improved_prompt}
    except Exception as e:
        logger.error(f"Error improving caption: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/edit-image")
async def edit_image(
    image: UploadFile = File(...),
    mask: Optional[UploadFile] = File(None),
    prompt: str = Form(...),
    size: str = Form("1024x1024")
):
    try:
        width, height = map(int, size.split('x'))
        image_contents = await image.read()
        base64_image = base64.b64encode(image_contents).decode('utf-8')
        mask_contents = await mask.read() if mask else None
        base64_mask = base64.b64encode(mask_contents).decode('utf-8') if mask_contents else None
        response = requests.post(
            "https://api.getimg.ai/v1/stable-diffusion-xl/inpaint",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Bearer {os.getenv('GETIMG_API_KEY')}"
            },
            json={
                "prompt": prompt,
                "image": base64_image,
                "mask_image": base64_mask,
                "width": width,
                "height": height,
                "strength": 0.5,
                "response_format": "url",  
                "output_format": "jpeg"  
            }
        )
        
        logger.info(f"GETIMG API response status: {response.status_code}")
        logger.info(f"GETIMG API response headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            logger.error(f"GETIMG API error: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail="Image generation failed"
            )
            
        result = response.json()
        return JSONResponse({
            "success": True,
            "url": result["url"]
        })

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="Image processing failed.")
    
@app.post("/api/img2img")
async def img2img(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):
    try:
        logger.info(f"Received img2img request with prompt: {prompt}")
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        if img.format != 'PNG':
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            contents = buffer.getvalue()
        
        base64_image = base64.b64encode(contents).decode('utf-8')
        logger.info(f"Image size: {len(base64_image)}")
        logger.info(f"Image dimensions: {img.size}")
        
        api_key = os.getenv('GETIMG_API_KEY')
        if not api_key:
            logger.error("GETIMG_API_KEY not found")
            return JSONResponse(
                status_code=500,
                content={"error": "GETIMG API key not configured"}
            )
        
        payload = {
            "prompt": prompt,
            "image": base64_image,
            "strength": 0.5,
            "response_format": "url"
        }
        logger.info("Making request to GETIMG API")
        logger.info(f"Headers: {{'Authorization': 'Bearer ***', 'Content-Type': 'application/json'}}")
        logger.info(f"Payload keys: {list(payload.keys())}")
        
        response = requests.post(
            "https://api.getimg.ai/v1/stable-diffusion-xl/image-to-image",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Bearer {api_key}"
            },
            json=payload
        )
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        try:
            result = response.json()
            logger.info(f"Response content: {result}")
            if "error" in result:
                return JSONResponse(
                    status_code=500,
                    content={"error": f"GETIMG API error: {result['error']}"}
                )
            
            if "url" not in result:
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "No URL in response",
                        "received_keys": list(result.keys()),
                        "response": result
                    }
                )
            
            return JSONResponse(
                status_code=200,
                content={"success": True, "url": result["url"]}
            )
            
        except ValueError as e:
            logger.error(f"Failed to parse response as JSON: {response.text}")
            return JSONResponse(
                status_code=500,
                content={"error": f"Invalid JSON response: {response.text[:500]}"}
            )
            
    except Exception as e:
        logger.error(f"Error in img2img endpoint: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Server error: {str(e)}"}
        )
        
@app.post("/api/analyze-image")
async def analyze_image(request: Request):
    try:
        body = await request.json()
        image_url = body.get("image_url")
        
        if not image_url:
            raise HTTPException(status_code=400, detail="Image URL is required")
            
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this image in the context of urban redevelopment. What category would this fall under? Choose from: Public Space Enhancement, Infrastructure Modernization, Sustainable Development, Cultural Preservation, or Mixed-Use Development. Provide just the category name."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url,
                                "detail": "low"  # can be "low", "high", or "auto"
                            }
                        }
                    ]
                }
            ],
            max_tokens=100
        )
        
        logger.info(f"Vision API Response: {response}")
        category = response.choices[0].message.content.strip()
        return JSONResponse({"category": category})
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, workers=4, reload=True)
    
# run server with uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 (where workers creates 4 parallel worker processes. Each worker can handle multiple requests)
