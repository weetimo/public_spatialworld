import os
import sys
import torch
import cv2
import matplotlib.pyplot as plt
import numpy as np
import subprocess

def set_working_directory():
    """Set the working directory to image-segmentation"""
    # Get the absolute path to image-segmentation directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if os.path.basename(script_dir) != 'image-segmentation':
        parent_dir = os.path.dirname(script_dir)
        working_dir = os.path.join(parent_dir, 'image-segmentation')
        if not os.path.exists(working_dir):
            print(f"Error: image-segmentation directory not found at {working_dir}")
            sys.exit(1)
    else:
        working_dir = script_dir

    # Change to the working directory
    os.chdir(working_dir)
    print(f"Working directory set to: {os.getcwd()}")
    return working_dir

def install_requirements(working_dir):
    """Install required packages and FastSAM repository"""
    try:
        # Clone FastSAM repository if it doesn't exist
        fastsam_path = os.path.join(working_dir, 'FastSAM')
        if not os.path.exists(fastsam_path):
            print(f"Cloning FastSAM repository to {fastsam_path}")
            subprocess.check_call(['git', 'clone', 'https://github.com/CASIA-IVA-Lab/FastSAM.git', fastsam_path])

        # Install FastSAM requirements
        fastsam_requirements = os.path.join(fastsam_path, 'requirements.txt')
        if os.path.exists(fastsam_requirements):
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', fastsam_requirements])

        # Add FastSAM directory to Python path
        if fastsam_path not in sys.path:
            sys.path.append(fastsam_path)
            print(f"Added {fastsam_path} to Python path")

    except subprocess.CalledProcessError as e:
        print(f"Error during installation: {e}")
        sys.exit(1)

def main():
    # Set working directory
    working_dir = set_working_directory()

    # Install requirements if needed
    install_requirements(working_dir)

    # Import FastSAM after installation and path setup
    try:
        from FastSAM.fastsam import FastSAM, FastSAMPrompt
    except ImportError as e:
        print(f"Error importing FastSAM: {e}")
        print("Current Python path:")
        for path in sys.path:
            print(path)
        sys.exit(1)

    # Define paths
    FAST_SAM_CHECKPOINT_PATH = os.path.join(working_dir, "FastSAM.pt")
    IMAGE_PATH = os.path.join(working_dir, "input/example.webp")
    OUTPUT_DIR = os.path.join(working_dir, "output")
    OUTPUT_PATH = os.path.join(OUTPUT_DIR, "output_2.png")

    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Check if required files exist
    if not os.path.exists(FAST_SAM_CHECKPOINT_PATH):
        print(f"Error: FastSAM checkpoint not found at {FAST_SAM_CHECKPOINT_PATH}")
        sys.exit(1)

    if not os.path.exists(IMAGE_PATH):
        print(f"Error: Input image not found at {IMAGE_PATH}")
        sys.exit(1)

    # Set device
    DEVICE = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {DEVICE}")

    try:
        # Initialize FastSAM
        fast_sam = FastSAM(FAST_SAM_CHECKPOINT_PATH)

        # Define point coordinates
        point = [1000, 1000]

        # Process image
        results = fast_sam(
            source=IMAGE_PATH,
            device=DEVICE,
            retina_masks=True,
            imgsz=1024,
            conf=0.5,
            iou=0.6
        )

        # Process prompt and generate masks
        prompt_process = FastSAMPrompt(IMAGE_PATH, results, device=DEVICE)
        masks = prompt_process.point_prompt(points=[point], pointlabel=[1])

        # Save output
        prompt_process.plot(
            annotations=masks,
            output_path=OUTPUT_PATH
        )

        print(f"Processing complete. Output saved to: {OUTPUT_PATH}")
        print("Masks shape:", masks.shape)

    except Exception as e:
        print(f"Error during processing: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()


