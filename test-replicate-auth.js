const Replicate = require("replicate");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function run() {
    console.log("Testing basic replicate.models.get()...");
    try {
        const model = await replicate.models.get("stability-ai", "sdxl");
        console.log("Success! API key works and has access to models.");
    } catch (e) {
        console.error("Failed:", e.message);
    }
}

run();
