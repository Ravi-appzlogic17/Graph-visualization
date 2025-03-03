import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";

const initialData = {
  nodes: [
    { id: "User", type: "person", x: 250, y: 300 },
    { id: "DB Server", type: "dbServer", x: 450, y: 200 },
    { id: "App Server", type: "server", x: 450, y: 400 },
    { id: "Workstation", type: "device", x: 100, y: 300 },
    { id: "API Gateway", type: "server", x: 650, y: 300 },
    { id: "Directory", type: "directory", x: 700, y: 150 },
    { id: "Security Group 1", type: "security", x: 50, y: 100 },
    { id: "Security Group 2", type: "security", x: 50, y: 200 },
    { id: "Security Group 3", type: "security", x: 50, y: 400 },
  ],
  links: [
    { source: "User", target: "DB Server" },
    { source: "User", target: "App Server" },
    { source: "User", target: "Workstation" },
    { source: "DB Server", target: "API Gateway" },
    { source: "App Server", target: "API Gateway" },
    { source: "API Gateway", target: "Directory" },
    { source: "User", target: "Security Group 1" },
    { source: "User", target: "Security Group 2" },
    { source: "User", target: "Security Group 3" },
  ],
};

const iconMap = {
  person: "https://cdn-icons-png.flaticon.com/128/847/847969.png",
  server: "https://cdn-icons-png.flaticon.com/128/921/921490.png",
  dbServer: "https://cdn-icons-png.flaticon.com/512/14660/14660178.png",
  database: "https://cdn-icons-png.flaticon.com/128/2991/2991112.png",
  device: "https://cdn-icons-png.flaticon.com/128/3144/3144456.png",
  directory: "https://cdn-icons-png.flaticon.com/128/2621/2621030.png",
  security: "https://cdn-icons-png.flaticon.com/128/18842/18842110.png",
};

const GraphComponent = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    // Draw links
    svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("x1", (d) => data.nodes.find((n) => n.id === d.source).x)
      .attr("y1", (d) => data.nodes.find((n) => n.id === d.source).y)
      .attr("x2", (d) => data.nodes.find((n) => n.id === d.target).x)
      .attr("y2", (d) => data.nodes.find((n) => n.id === d.target).y)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Draw nodes
    svg
      .selectAll("image")
      .data(data.nodes)
      .enter()
      .append("image")
      .attr("xlink:href", (d) => iconMap[d.type])
      .attr("width", 40)
      .attr("height", 40)
      .attr("x", (d) => d.x - 20)
      .attr("y", (d) => d.y - 20)
      .style("cursor", "pointer")
      .on("click", (event, d) => handleNodeClick(d.id));

    // Draw labels
    svg
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((d) => d.id);
  }, [data]);

  function handleNodeClick(nodeId) {
    setLoading(true);
    setTimeout(() => {
    if (nodeId === "DB Server") {
      navigate("/database-table");
      setData((prevData) => ({
        nodes: [...prevData.nodes, { id: "Database Table", type: "database", x: 600, y: 100 }],
        links: [...prevData.links, { source: "DB Server", target: "Database Table" }],
      }));
    } else if (nodeId === "API Gateway") {
      navigate("/api-dashboard");
    } else if (nodeId === "User") {
      navigate("/user-management");
      setData({
        nodes: [
          { id: "User", type: "person", x: 400, y: 250 },
          { id: "Username", type: "person", x: 600, y: 200 },
          { id: "Address", type: "person", x: 600, y: 300 },
          { id: "Phone Number", type: "person", x: 600, y: 400 },
          { id: "Email", type: "person", x: 600, y: 500 },
        ],
        links: [
          { source: "User", target: "Username" },
          { source: "User", target: "Address" },
          { source: "User", target: "Phone Number" },
          { source: "User", target: "Email" },
        ],
      });
    }
    setLoading(false);
  }, 1000);
}

  
return (
    <div>
      {loading && <div>Loading...</div>}
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphComponent;
