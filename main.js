function(properties, context) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var apiToken = context.keys.aicado_access_token;
	var yourApiToken = context.keys.your_api_token;
    
    var webhookUrl = properties.response_webhook_url+"?api_token="+yourApiToken;
    
    
    var text1 = properties.text1;
    var text2 = properties.text2;
    var image1 = properties.image1;
    var image2 = properties.image2;
    var video1 = properties.video1;
    var video2 = properties.video2;
    var audio1 = properties.audio1;
    var audio2 = properties.audio2;



     // HTTPS check
     if(image1 && image1.indexOf("https:") === -1){
        image1 = "https:" + image1;
     }
     if(image2 && image2.indexOf("https:") === -1){
        image2 = "https:"+ image2;
     }
     if(video1 && video1.indexOf("https:") === -1){
        video1 = "https:"+video1;
     }
     if(video2 && video2.indexOf("https:") === -1){
        video1 = "https:"+video1;
     }
     if(audio1 && audio1.indexOf("https:") === -1){
        audio1 = "https:"+audio1;
     }
     if(audio2 && audio2.indexOf("https:") === -1){
        audio2 = "https:"+audio2;
     }


    var aiModels = {
        "swap_faces_in_photos": "https://run.aicado.ai/version-723fx/api/1.1/wf/swap-face",
        "text_to_image": "https://run.aicado.ai/version-723fx/api/1.1/wf/text2image-stabilityai-sdxl",
        "create_stickers": "https://run.aicado.ai/version-723fx/api/1.1/wf/face-to-sticker",//30s
        "analyze_images": "https://run.aicado.ai/version-723fx/api/1.1/wf/image-to-text",// 30s
        "correct_skin_imperfections_on_photos": "https://run.aicado.ai/version-723fx/api/1.1/wf/face-retoucher", // 30s
        "enhance_image_resolution_with_clarity_upscaler": "https://run.aicado.ai/version-723fx/api/1.1/wf/clarity-upscaler",  
        "object_remover": "https://run.aicado.ai/version-723fx/api/1.1/wf/auto-remove-anything",  //30s
        "speech_to-text": "https://run.aicado.ai/version-723fx/api/1.1/wf/speech-to-text-to-download-file",  
        "background_changer": "https://run.aicado.ai/version-723fx/api/1.1/wf/background-changer",//output 
        "dress_room": "https://run.aicado.ai/version-723fx/api/1.1/wf/oot-dress", //output  id 
        "create_video": "https://run.aicado.ai/version-723fx/api/1.1/wf/hailuo-texttovideo", //output  id 
        "text-to_speech": "https://run.aicado.ai/version-723fx/api/1.1/wf/text-to-speech",      
        "animate_photos": "https://run.aicado.ai/version-723fx/api/1.1/wf/sad-talker",      
        "swap_face_in-video": "https://run.aicado.ai/version-723fx/api/1.1/wf/change-a-face-in-a-video",      
        "talk_image": "https://run.aicado.ai/version-723fx/api/1.1/wf/image-to-text" //30s
    };


    var selectedModel = properties.select_ai2;
    var apiUrl = aiModels[selectedModel];


    if (!apiUrl) {
        return { "error": "Invalid AI Model Selected" };
    }


    var raw = {};

    switch (selectedModel) {
        case "swap_faces_in_photos":
            raw = JSON.stringify({
                "target_image": image1,
                "source_image": image2,
                "response_webhook_url": webhookUrl
            });
            break;
        case "text_to_image":
            raw = JSON.stringify({
                "target_image": image1,
                "source_image": image2,
                "response_webhook_url": webhookUrl,
                "prompt": text1,
                "num_outputs": 1,
                "num_inference_steps": 50,
                "guidance_scale": 7.5,
                "seed": null,
                "negative_prompt": "",
                "image_size": "square",
                "enable_safety_checker": true
            });
            break;
        case "create_stickers":
            raw = JSON.stringify({
                "image_url": image1,
                "prompt": text1,
                "negative_prompt": text2,
                "num_inference_steps": 18,
                "guidance_scale": 4,
                "instant_id_strength": 0.7,
                "ip_adapter_weight": 0.2,
                "ip_adapter_noise": 0.5,
                "image_size": "square_hd",
                "upscale": false,
                "upscale_steps": 10,
                "seed": null,
                "enable_safety_checker": true,
                "response_webhook_url": webhookUrl
            });
            break;
        case "analyze_images":
            raw = JSON.stringify({
                "image": image1,
                "prompt": text1,
                "response_webhook_url": webhookUrl
            });
            break;
        case "face_retoucher":
            raw = JSON.stringify({
                "image": image1,
                "prompt": text1,
                "upscale_factor": 2,
                "negative_prompt": text2,
                "creativity": 0.35,
                "resemblance": 0.6,
                "guidance_scale": 4,
                "num_inference_steps": 18,
                "enable_safety_checker": true,
                "seed": null,
                "response_webhook_url": webhookUrl
            });
            break;
        case "background_changer":
            raw = JSON.stringify({
                "prompt": text1,
                "negative_prompt": "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation",
                "image": image1,
                "sampler_name": "DPM++ SDE Karras",
                "steps": 20,
                "cfg_scale": 7,
                "denoising_strength": 0.75,
                "max_width": 1024,
                "max_height": 1024,
                "only_masked_padding_pixels": 4,
                "seed": null,
                "response_webhook_url": webhookUrl
            });
            break;
        case "create_video":
            raw = JSON.stringify({
                "prompt":text1,
                "scheduler": "DDIMScheduler",
                "num_inference_steps": 30,
                "seed": null,
                "negative_prompt": "blurry",
                "width": 768,
                "height": 768,
                "response_webhook_url": webhookUrl
            });
            break;
        case "swap_face_in-video":
            raw = JSON.stringify({
                "source": video1,
                "target": video2,
                "response_webhook_url": webhookUrl
            });
            break;
        case "sad_talker":
            raw = JSON.stringify({
                "image_url": image1,
                "upscale_factor": 2,
                "negative_prompt": "(worst quality, low quality, normal quality:2)",
                "creativity": 0.35,
                "resemblance": 0.6,
                "guidance_scale": 4,
                "num_inference_steps": 18,
                "enable_safety_checker": true,
                "seed": null,
                "response_webhook_url": webhookUrl
            });
            break;
        case "object_remover":
            raw = JSON.stringify({
                "prompt": text1,
                "image":  image1,
                "response_webhook_url": webhookUrl
            });
            break;
        case "dress_room":
            raw = JSON.stringify({
                "model_image": image1,
                "garment_image":image2,
                "steps": 20,
                "guidance_scale": 2,
                "seed": 0,
                "category": "upperbody",
                "samples": 1,
                "response_webhook_url": webhookUrl
            });
            break;
        case "background_remover":
            raw = JSON.stringify({
                "image": image1,
                "response_webhook_url": webhookUrl
            });
            break;
        case "enhance_image_resolution_with_clarity_upscaler":
            raw = JSON.stringify({
                "image": image1,
                "prompt": text1,
                "upscale_factor": 2,
                "negative_prompt": text2,
                "creativity": 0.35,
                "resemblance": 0.6,
                "guidance_scale": 4,
                "num_inference_steps": 18,
                "enable_safety_checker": true,
                "seed": null,
                "response_webhook_url": webhookUrl
            });
            break;
        case "correct_skin_imperfections_on_photos":
            raw = JSON.stringify({
                "image": image1,
                "prompt": text1,
                "upscale_factor": 2,
                "negative_prompt": text2,
                "creativity": 0.35,
                "resemblance": 0.6,
                "guidance_scale": 4,
                "num_inference_steps": 18,
                "enable_safety_checker": true,
                "seed": null,
                "response_webhook_url": webhookUrl
            });
            break;
        case "speech_to_text":
            raw = JSON.stringify({
                "audio_path": audio1,
                "model_name": "large-v2",
                "format": "srt",
                "language": "en",
                "youtube_urls": [
                    "https://youtube.com"
                ],
                "create_file_on_server": false,
                "response_webhook_url": webhookUrl
            });
            break;
        case "talk_image":
            raw = JSON.stringify({
                "image": image1,
                "prompt": text1,
                "top_p": 1,
                "temperature": 0.7,
                "max_tokens": 1024,
                "response_webhook_url": webhookUrl
            });
            break;
        case "text_to_speech":
            raw = JSON.stringify({
                "model": "tt1-1",//"model": "google-text-to-speech",
                "input": text1,
                "voice": "onyx",
                "speed": "1",
                "response_format": "mp3",
                "response_webhook_url": webhookUrl
            });
            break;
        default:
            console.log("Error: AI model not found.");
            return;
    }

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    return fetch(apiUrl + "?api_token=" + apiToken, requestOptions)
        .then(response => response.json())
        .then(result => {

            // run_id değerini kontrol et ve döndür

            if (result.response && result.response.run_id) {
                return { result: result.response.run_id};
            } else {
                return { result: JSON.stringify({ "status": "error", "message": result }) };
            }

        })
        .catch(error => {
            return { result: JSON.stringify({ "status": "error", "message": error.message }) };
        });


}