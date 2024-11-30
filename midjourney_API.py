#MJ API functions
import requests
import json

import yaml

with open('midjourney_API_config.yaml', 'r') as config_file:
    config = yaml.safe_load(config_file)
    API_KEY = config['API_KEY']
 
def inpaint_image(origin_task_id, prompt, mask, skip_prompt_check=False):
    url = "https://api.midjourneyapi.xyz/mj/v2/inpaint"
    
    payload = json.dumps({
        "origin_task_id": origin_task_id,
        "prompt": prompt,
        "skip_prompt_check": skip_prompt_check,
        "mask": mask
    })
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xx
        
        response_json = response.json()
        task_id = response_json.get('task_id')
        if not task_id:
            raise ValueError("No task_id found in the response")
        return task_id
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while making the request: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON response: {e}")
        return None
    except ValueError as e:
        print(f"Error in response content: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

# Example usage:
# result = inpaint_image(
#     api_key='YOUR_API_KEY',
#     origin_task_id='1d536e18-c8a8-4ac5-9c4b-ae5895cc1f29',
#     prompt='mirror',
#     mask='mask'
# )
# print(result)

def fetch_task_result(task_id):
    endpoint = "https://api.midjourneyapi.xyz/mj/v2/fetch"
    
    data = {
        "task_id": task_id
    }
    
    try:
        response = requests.post(endpoint, json=data, headers={'X-API-Key': API_KEY})
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
        
        response_json = response.json()
        if response_json['status'] == 'finished':
            return response_json['task_result']['image_url']
        elif response_json['status'] == 'processing':
            print("Task is still processing. Please try again later.")
            return None
        else:
            print(f"Unexpected status: {response_json['status']}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while making the request: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON response: {e}")
        return None
    except KeyError as e:
        print(f"Expected key not found in the response: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

# Example usage:
# result = fetch_task_result("c0295660-4710-4b09-8fc4-73ed09b114ec")
# print(result["status_code"])
# print(result["response"])

import time

def inpaint_and_fetch_result(origin_task_id, prompt, mask, skip_prompt_check=False, max_attempts=30, delay=10):
    # Initiate the inpainting task
    task_id = inpaint_image(origin_task_id, prompt, mask, skip_prompt_check)
    if not task_id:
        print("Failed to initiate inpainting task.")
        return None

    # Periodically check for the result
    for attempt in range(max_attempts):
        result = fetch_task_result(task_id)
        if result:
            return result
        elif result is None:
            print(f"Attempt {attempt + 1}/{max_attempts}: Task still processing. Waiting {delay} seconds...")
            time.sleep(delay)
    
    print(f"Timeout reached after {max_attempts} attempts.")
    return None

# Example usage:
# result = inpaint_and_fetch_result(
#     origin_task_id='1d536e18-c8a8-4ac5-9c4b-ae5895cc1f29',
#     prompt='mirror',
#     mask='mask',
#     max_attempts=60,
#     delay=5
# )
# if result:
#     print(f"Inpainting completed. Image URL: {result}")
# else:
#     print("Inpainting failed or timed out.")

