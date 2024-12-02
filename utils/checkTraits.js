const json = require('../data/evidence.json'); // Adjust the path if needed

console.log("Starting to check traits..."); // Log to confirm the script starts

// Looking for traits < 0.02
for (let pieceNum = 1; pieceNum <= 36; pieceNum++) {
    const id = pieceNum.toString().padStart(3, '0');
    const piece = json[id];
    
    console.log(`Checking Piece ${id}...`); // Log to confirm each piece is being processed

    Object.entries(piece.traits).forEach(([category, trait]) => {
        console.log(`Trait in ${category}: ${trait.name}, Value: ${trait.value}`); // Log trait details
        if (trait.value > 0 && trait.value < 0.02) {
            console.log(`Ultra-rare Trait Found! Piece ${id}, ${category}: ${trait.name} = ${trait.value}`);
        }
    });
}