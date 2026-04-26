require('dotenv').config();
const db = require('./db');
const { OpenAI } = require('openai');
const openai = new OpenAI();

const products = [
    // --- CLUSTER 1: SPACE & EXPLORATION (The "NASA" Cluster) ---
    { name: "Galactic Explorer Station", description: "Advanced orbital base with glowing control panels and space rovers for discovering alien life.", price: 85.00 },
    { name: "Mars Rover Technician Kit", description: "A hands-on robotics set to build and program a remote-controlled planetary explorer.", price: 55.00 },
    { name: "Star Map Projector", description: "A rotating night light that projects real constellations and galaxies onto the ceiling.", price: 29.00 },
    { name: "Astronaut Training Suit", description: "A realistic white flight jumpsuit with NASA-style patches and a soft helmet.", price: 45.00 },
    { name: "Saturn V Rocket Model", description: "A multi-stage scale model of the historic moon mission rocket with detachable stages.", price: 65.00 },

    // --- CLUSTER 2: NATURE & BIOLOGY (The "Science/Outdoor" Cluster) ---
    { name: "T-Rex Fossil Dig Kit", description: "An archaeological adventure where you use brushes and chisels to uncover prehistoric bones.", price: 24.50 },
    { name: "Backyard Safari Insect Habitat", description: "A mesh viewing cage with a magnifying glass for studying bugs and butterflies.", price: 18.00 },
    { name: "Bonsai Tree Building Set", description: "A peaceful botanical project that creates a miniature cherry blossom tree for home decor.", price: 49.99 },
    { name: "Underwater Camera Drone", description: "A waterproof remote-controlled submarine with a 1080p camera for exploring ponds.", price: 120.00 },

    // --- CLUSTER 3: STEALTH & ADVENTURE (The "Spy/Tactical" Cluster) ---
    { name: "Night Vision Spy Goggles", description: "Tactical headgear with green-tinted lenses and LED beams for secret missions in darkness.", price: 35.00 },
    { name: "Invisible Ink Message Set", description: "UV light pens and secret notebooks for encoding classified intelligence between agents.", price: 12.00 },
    { name: "Motion Sensor Room Guard", description: "A high-tech alarm system that alerts you when intruders enter your secret base.", price: 22.50 },
    { name: "Walkie-Talkie Pro Range", description: "Long-distance two-way radios with encrypted channels for field communications.", price: 39.00 },

    // --- CLUSTER 4: CREATIVE & CULINARY (The "Chef/Artist" Cluster) ---
    { name: "Master Chef Junior Pizza Set", description: "Real kitchen tools scaled for kids to learn the art of dough tossing and artisanal toppings.", price: 30.00 },
    { name: "Electric Pottery Wheel", description: "A motorized spinning wheel with air-dry clay and sculpting tools for making vases.", price: 55.00 },
    { name: "Digital Animation Tablet", description: "A pressure-sensitive drawing surface for creating 2D cartoons and digital paintings.", price: 89.00 },
    { name: "Tie-Dye Master Workshop", description: "A complete kit with vibrant pigments and rubber bands for creating custom apparel.", price: 25.00 },

    // --- CLUSTER 5: FANTASY & MAGIC (The "Roleplay" Cluster) ---
    { name: "Wizarding Wand & Spellbook", description: "An interactive wooden staff that reacts with light and sound to specific ancient gestures.", price: 42.00 },
    { name: "Dragon Scale Armor Set", description: "Foam-padded breastplate and shield with realistic textures for epic medieval battles.", price: 34.00 },
    { name: "Enchanted Forest Play Tent", description: "A pop-up canopy with hanging vines and fairy lights for imaginative storytelling.", price: 48.00 }
];


/**
 * Iterates through products, generates embeddings, and inserts into Postgres
 */
async function seedDatabase() {
    for (const product of products) {
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: `${product.name} ${product.description}`,
        });

        await db.query(
            'INSERT INTO products (name, description, price, embedding) VALUES ($1, $2, $3, $4)',
            [product.name, product.description, product.price, JSON.stringify(embedding.data[0].embedding)]
        );
    }
    console.log("Database Seeded!");
}

seedDatabase();