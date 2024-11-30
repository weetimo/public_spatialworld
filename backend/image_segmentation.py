from fastapi import HTTPException
from pydantic import BaseModel
import os
import sys
import torch
import subprocess
from typing import List, Tuple, Optional
import base64
import asyncio
from PIL import Image
import io
import numpy as np

class PointCoordinates(BaseModel):
    point: List[int]

class SegmentationResponse(BaseModel):
    success: bool
    encoded_masks: str

class ImageSegmentationService:
    def __init__(self):
        self.model = None
        self.device = None
        self.FastSAMPrompt = None
        self.working_dir = None
        self.initialize_service()

    def set_working_directory(self) -> str:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        if os.path.basename(script_dir) != 'backend':
            parent_dir = os.path.dirname(script_dir)
            working_dir = os.path.join(parent_dir, 'backend')
            if not os.path.exists(working_dir):
                raise Exception(f"Error: backend directory not found at {working_dir}")
        else:
            working_dir = script_dir

        os.chdir(working_dir)
        return working_dir

    def install_requirements(self, working_dir: str) -> None:
        try:
            fastsam_path = os.path.join(working_dir, 'FastSAM')
            if not os.path.exists(fastsam_path):
                subprocess.check_call(['git', 'clone', 'https://github.com/CASIA-IVA-Lab/FastSAM.git', fastsam_path])

            fastsam_requirements = os.path.join(fastsam_path, 'requirements.txt')
            if os.path.exists(fastsam_requirements):
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', fastsam_requirements])

            if fastsam_path not in sys.path:
                sys.path.append(fastsam_path)

        except subprocess.CalledProcessError as e:
            raise Exception(f"Error during installation: {e}")

    def initialize_service(self):
        try:
            self.working_dir = self.set_working_directory()
            self.install_requirements(self.working_dir)

            from FastSAM.fastsam import FastSAM, FastSAMPrompt

            checkpoint_path = os.path.join(self.working_dir, "FastSAM.pt")
            if not os.path.exists(checkpoint_path):
                raise Exception(f"Error: FastSAM checkpoint not found at {checkpoint_path}")

            self.device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
            self.model = FastSAM(checkpoint_path)
            self.FastSAMPrompt = FastSAMPrompt
        except Exception as e:
            raise Exception(f"Failed to initialize Image Segmentation Service: {str(e)}")

    async def process_image(self, image_path: str, point_coords: List[int]) -> Tuple[str, List[List[bool]]]:
        try:
            # Process the image
            results = self.model(
                source=image_path,
                device=self.device,
                retina_masks=True,
                imgsz=1024,
                conf=0.5,
                iou=0.6
            )

            prompt_process = self.FastSAMPrompt(image_path, results, device=self.device)
            masks = prompt_process.point_prompt(points=[point_coords], pointlabel=[1])

            mask_uint8 = (masks[0] * 255).astype(np.uint8)  # assuming you're using the first mask

            # Encode the mask array to base64
            mask_bytes = mask_uint8.tobytes()
            encoded_mask = base64.b64encode(mask_bytes).decode('utf-8')

            # masks_list = masks.tolist()  # Convert the mask to a list if needed
            return encoded_mask

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during image processing: {str(e)}")

# image_segmentation_service = ImageSegmentationService()

# image_path = "/Users/weimingchin/Desktop/term 7/Spatial Design/spatialworld/backend/input/example.jpg"
# point_coords = [150, 200]  # Example coordinates
# # Use asyncio.run to call the async function
# encoded_mask, masks_list = asyncio.run(image_segmentation_service.process_image(image_path, point_coords))

# # Print or use the results as needed
# print("Encoded Mask:", encoded_mask)
# print("Masks List:", masks_list)
