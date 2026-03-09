async function testTryOn() {
  try {
    const { client } = await import('@gradio/client');
    console.log("Connecting to levihsu/OOTDiffusion...");
    const app = await client("levihsu/OOTDiffusion");
    console.log("Connected.");
    
    const res1 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
    const personBlob = await res1.blob();
    
    console.log("Predicting...");
    const result = await app.predict("/process_dc", [
        personBlob, // vton_img
        personBlob, // garm_img
        "Upper-body", // category
        1, // n_samples
        20, // n_steps
        2.0, // image_scale
        1337, // seed
    ]);
    
    console.log("Result:", result.data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testTryOn();
