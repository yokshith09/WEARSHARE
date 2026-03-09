import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const user = token ? verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized. Please login to use AI Try-On.' }, { status: 401 });

    const { personImage, garmentImage, category = 'Upper-body' } = await req.json();

    if (!personImage || !garmentImage) {
      return NextResponse.json({ error: 'Both person and garment images are required' }, { status: 400 });
    }

    console.log('[AI Try-On] Starting Replicate prediction...');
    
    // Using the popular OOTDiffusion model on Replicate
    // Model ID: viktorfa/oot_diffusion
    const output = await replicate.run(
      "viktorfa/oot_diffusion:9f8fa4956970dde996aec86bbafbfbb9ec19d19a2e612948408a2fc2065842c6",
      {
        input: {
          vton_img: personImage,
          garm_img: garmentImage,
          category: category,
          n_samples: 1,
          n_steps: 20,
          image_scale: 2,
          seed: -1
        }
      }
    );

    console.log('[AI Try-On] Prediction successful');
    
    // Output is generally an array of image URLs [ "https://replicate.delivery/..." ]
    return NextResponse.json({ 
      success: true, 
      resultImage: Array.isArray(output) ? output[0] : output 
    });

  } catch (error) {
    console.error('[AI Try-On] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate try-on image' }, { status: 500 });
  }
}
