import {HfInference} from "@huggingface/inference"


const HF_TOKEN = process.env.HF_TOKEN;

export const inferece = new HfInference(HF_TOKEN);