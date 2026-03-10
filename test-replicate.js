const Replicate = require("replicate");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function run() {
    console.log("Testing cuuupid/idm-vton...");
    try {
        const output = await replicate.run(
            "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
            {
                input: {
                    garm_img: "https://replicate.delivery/pbxt/Kj1d7Xy7oE4Lq9VnL8p/garment.png",
                    human_img: "https://replicate.delivery/pbxt/Kj1d7U1yW0I1j12EwQG9pWJz9RzO1kZYX2LQK0r6mQ7r/person.png",
                    garment_des: "A cool blue shirt",
                    custom_clothing: false
                }
            }
        );
        console.log("Success:", output);
    } catch (e) {
        console.error("Failed:", e.message);
    }
}

run();
