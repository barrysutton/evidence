JsOsaDAS1.001.00bplist00ÑVscript_'pconst evidenceData = {
  "032": {
    traits: {
      temporal: { name: "Spectrum Anomaly", value: 0.02 },
      material: { name: "Orbital Matter", value: 0.02 },
      structural: { name: "Diagonal Pattern", value: 0.05 },
      emergent: { name: "Nebula Formation", value: 0.02 },
      fibonacci: { name: "Fibonacci Sequence", value: 0.02 }
    },
    series: ["Fibonacci", "Time Anomalies"],
    relatedPieces: [
      { id: "009", similarity: 0.8, traits: 2 },
      { id: "004", similarity: 0.7, traits: 2 },
      { id: "035", similarity: 0.6, traits: 1 }
    ]
  },
  "009": {
    traits: {
      temporal: { name: "Lunar Time Measure", value: 0.05 },
      material: { name: "Ethereal Matter", value: 0.08 },
      structural: { name: "Void Structure", value: 0.08 },
      emergent: { name: "Celestial Pattern", value: 0.05 },
      fibonacci: { name: "Golden Spiral", value: 0.05 }
    },
    relatedPieces: [{ id: "032", similarity: 0.8, traits: 2 }]
  },
  "004": {
    traits: {
      temporal: { name: "Time Spiral", value: 0.05 },
      material: { name: "Mixed Medium Sample", value: 0.08 },
      structural: { name: "Field Disruption", value: 0.10 },
      emergent: { name: "Liminal Evidence", value: 0.05 },
      fibonacci: { name: "Primary Golden Ratio", value: 0.02 }
    },
    relatedPieces: [{ id: "032", similarity: 0.7, traits: 2 }]
  },
  "035": {
    traits: {
      temporal: { name: "Void Echo", value: 0.08 },
      material: { name: "Mist Field", value: 0.08 },
      structural: { name: "Edge Pattern", value: 0.08 },
      emergent: { name: "Infinite Space", value: 0.02 },
      fibonacci: { name: "Double Golden Points", value: 0.05 }
    },
    relatedPieces: [{ id: "032", similarity: 0.6, traits: 1 }]
  }
};

    const categoryColors = {
      temporal: '#FF0066',
      material: '#00FFFF',
      structural: '#7FFF00',
      emergent: '#FF9900',
      fibonacci: '#FFD700'
    };

    function populateCategories(pieceNumber) {
      const container = document.getElementById('categories-container');
      const piece = evidenceData[pieceNumber];
      
      if (!piece) return;

      const html = Object.entries(piece.traits)
        .map(([category, trait]) => `
          <div class="data-card">
            <div style="color: ${categoryColors[category]}; font-size: 0.875rem; margin-bottom: 0.5rem;">
              ${category.toUpperCase()}
            </div>
            <div class="metric-row">
              <span>${trait.name}</span>
              <span>${(trait.value * 100)}%</span>
            </div>
            <div class="percentage-bar">
              <div class="percentage-fill" 
                   style="width: ${100 - (trait.value * 100)}%; background: ${categoryColors[category]}">
              </div>
            </div>
          </div>
        `).join('');

      container.innerHTML = html;
    }

    function populateRelatedPieces(pieceNumber) {
      const container = document.getElementById('related-pieces');
      const piece = evidenceData[pieceNumber];
      
      if (!piece) return;

      const html = piece.relatedPieces
        .map(related => `
          <div class="related-piece">
            <div style="flex: 1">
              <div style="font-size: 0.875rem;">#${related.id}</div>
              <div style="font-size: 0.75rem; color: #999;">${related.traits} shared traits</div>
            </div>
            <div style="width: 60px; text-align: right;">
              <div style="font-size: 0.875rem;">${(related.similarity * 100).toFixed(0)}%</div>
              <div style="font-size: 0.75rem; color: #999;">similar</div>
            </div>
          </div>
        `).join('');

      container.innerHTML = html;
    }
function createRarityMap() {
 const container = d3.select("#visualization");
 container.html("");

 // Get actual container dimensions
 const containerWidth = container.node().getBoundingClientRect().width;
 const containerHeight = containerWidth;

 const svg = container
   .append("svg")
   .attr("width", containerWidth)
   .attr("height", containerHeight)
   .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
   .style("background", "rgba(17, 17, 17, 0.2)")
   .style("display", "block")
   .style("margin", "0 auto");

 // Create links array for connections
 const links = [];
 Object.entries(evidenceData).forEach(([pieceNum, piece]) => {
   if (piece.relatedPieces) {
     piece.relatedPieces.forEach(related => {
       links.push({
         source: pieceNum,
         target: related.id,
         strength: related.similarity
       });
     });
   }
 });

 // Create nodes with enhanced data
 const nodes = Array.from({ length: 36 }, (_, i) => {
   const pieceNum = (i + 1).toString().padStart(3, '0');
   const piece = evidenceData[pieceNum];
   
   let radius = 5;
   if (piece) {
     const ultraRareCount = Object.values(piece.traits || {})
       .filter(trait => trait.value === 0.02).length;
     radius = 5 + (ultraRareCount * 3);
   }

   let color = '#666';
   if (piece && piece.traits) {
     const dominantTrait = Object.entries(piece.traits)
       .sort((a, b) => a[1].value - b[1].value)[0];
     if (dominantTrait) {
       color = categoryColors[dominantTrait[0]];
     }
   }

   return {
     id: pieceNum,
     radius: radius,
     color: color,
     isHighlighted: pieceNum === '032',
     traits: piece ? piece.traits : {},
     relatedPieces: piece ? piece.relatedPieces : []
   };
 });

 // Create link elements
 const link = svg.append("g")
   .attr("class", "links")
   .selectAll("line")
   .data(links)
   .join("line")
   .attr("stroke", "#333")
   .attr("stroke-width", d => d.strength)
   .attr("opacity", 0.3);

 // Create node elements
 const node = svg.append("g")
   .attr("class", "nodes")
   .selectAll("g")
   .data(nodes)
   .join("g")
   .on("mouseover", handleMouseOver)
   .on("mouseout", handleMouseOut)
   .on("click", handleClick);

 // Add circles to nodes
 node.append("circle")
   .attr("r", d => d.radius)
   .attr("fill", d => d.color)
   .attr("stroke", d => d.isHighlighted ? "#fff" : "none")
   .attr("stroke-width", 2);

 // Add labels to nodes
 node.append("text")
   .text(d => `#${d.id}`)
   .attr("text-anchor", "middle")
   .attr("dy", d => d.radius + 10)
   .attr("fill", "#999")
   .style("font-size", "10px");

 // Add tooltip
 const tooltip = container.append("div")
   .attr("class", "tooltip")
   .style("position", "absolute")
   .style("visibility", "hidden")
   .style("background", "rgba(0, 0, 0, 0.8)")
   .style("padding", "10px")
   .style("border-radius", "4px")
   .style("color", "white")
   .style("font-size", "12px")
   .style("pointer-events", "none")
   .style("z-index", "100");

 function handleMouseOver(event, d) {
   // Highlight connected nodes
   node.selectAll("circle")
     .attr("opacity", n => {
       if (!d.relatedPieces) return 1;
       const isConnected = d.relatedPieces.some(r => r.id === n.id);
       return isConnected || n.id === d.id ? 1 : 0.3;
     });

   // Highlight connections
   link
     .attr("opacity", l => {
       return (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1;
     });

   // Show tooltip
   let tooltipContent = `<strong>#${d.id}</strong><br>`;
   if (d.traits) {
     tooltipContent += Object.entries(d.traits)
       .map(([category, trait]) => `${category}: ${trait.name} (${trait.value * 100}%)`)
       .join("<br>");
   }

   tooltip
     .html(tooltipContent)
     .style("visibility", "visible")
     .style("left", (event.pageX + 10) + "px")
     .style("top", (event.pageY - 10) + "px");
 }

 function handleMouseOut() {
   node.selectAll("circle").attr("opacity", 1);
   link.attr("opacity", 0.3);
   tooltip.style("visibility", "hidden");
 }

 function handleClick(event, d) {
   console.log(`Clicked piece #${d.id}`);
   // Add any click interaction logic here
 }

 // Force simulation
 const simulation = d3.forceSimulation(nodes)
   .force("link", d3.forceLink(links).id(d => d.id).strength(0.5))
   .force("charge", d3.forceManyBody().strength(-150))
   .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
   .force("collide", d3.forceCollide().radius(d => d.radius * 3))
   .force("x", d3.forceX(containerWidth / 2).strength(0.1))
   .force("y", d3.forceY(containerHeight / 2).strength(0.1));

 // Update positions on tick
 simulation.on("tick", () => {
   link
     .attr("x1", d => d.source.x)
     .attr("y1", d => d.source.y)
     .attr("x2", d => d.target.x)
     .attr("y2", d => d.target.y);

   node.attr("transform", d => `translate(${d.x},${d.y})`);
 });
}

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      populateCategories('032');
      populateRelatedPieces('032');
      createRarityMap();
    });
    const imageData = {
  "1": {
    "Temporal Evidence": "Chronological Fragment (15%)",
    "Material Analysis": "Film Specimen (12%)",
    "Structural Analysis": "Grid Analysis A (15%)",
    "Emergent Phenomena": "Echo Pattern (12%)",
    "Fibonacci Sequence": "None"
  },
  "2": {
    "Temporal Evidence": "Present State Record (10%)",
    "Material Analysis": "Digital Residue (15%)",
    "Structural Analysis": "Void Formation (10%)",
    "Emergent Phenomena": "Matrix Evidence (12%)",
    "Fibonacci Sequence": "None"
  },
  // Add the rest of your images here...
};

function searchImage() {
  const input = document.getElementById("searchInput").value.trim();
  const imageNumber = parseInt(input, 10);

  const data = imageData[imageNumber];

  if (data) {
    // Dynamically display the image (replace with actual image paths if available)
    document.getElementById("image-display").innerHTML = `
      <img src="path/to/image${imageNumber}.jpg" alt="Evidence ${imageNumber}" />
    `;

    // Dynamically display the attributes
    const attributesHtml = Object.entries(data)
      .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
      .join("");

    document.getElementById("attributes-display").innerHTML = attributesHtml;
  } else {
    alert("No data found for this image number.");
  }
}                              '†jscr  úÞÞ­