"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function ForceGraph({ data, selectedId, width = 928, height = 600 }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up color scale

    // Add a black background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "black");

    // Add simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => (d.value * 10) + 15));
      if (selectedId) {
        simulation.force(
          "attract-related",
          d3.forceRadial(150, width / 2, height / 2).strength(0.5)
        );
      }

    // Add links
    const link = svg.append("g")
    .attr("stroke", "gray")
    .attr("stroke-opacity", 0.4) // Minimal visibility
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke-width", 1); // Thin links

    // Add nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .on("mouseover", (event, d) => {
        // Highlight related nodes
        link.attr("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.2));
        node.select("circle").attr("opacity", n => (n.id === d.id || data.links.some(l => l.source.id === d.id && l.target.id === n.id) ? 1 : 0.2));
      })
      .on("mouseout", () => {
        // Reset styles
        link.attr("stroke-opacity", 0.6);
        node.select("circle").attr("opacity", 1);
      });

// Add the image as a pattern fill
node.filter(d => d.background).append("defs")
  .append("pattern")
  .attr("id", d => d.id) // Unique ID for each image
  .attr("patternUnits", "objectBoundingBox")
  .attr("width", 1)
  .attr("height", 1)
  .append("image")
  .attr("xlink:href", d => d.imageUrl || "")
  .attr("width", 30) // Match circle diameter
  .attr("height", 30) // Match circle diameter
  .attr("preserveAspectRatio", "xMidYMid slice") // Ensure proper scaling
  .attr("x", 0)
  .attr("y", 0);

// Append circular nodes with the pattern fill
node.append("circle")
  .filter(d => d.background) // Only apply to background nodes
  .attr("r", 15) // Adjust radius size if needed
  .attr("fill", d => `url(#${d.id})`) // Use the image as a pattern fill
  .attr("opacity", 0.5); // Set default opacity

// Add hoverable numbers
node.append("text")
.text(d => `#${d.id}`)
.attr("text-anchor", "middle")
.attr("dy", d => {
  if (d.main) return 70; // Position below main
  if (d.related) return 50; // Position below related
  return 30; // Position below background
})
.attr("fill", "white")
.style("font-size", "12px")
.style("opacity", 0) // Hidden by default
.on("mouseover", function () {
  d3.select(this).style("opacity", 1); // Show on hover
})
.on("mouseout", function () {
  d3.select(this).style("opacity", 0); // Hide on hover
});

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  }, [data]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}