import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom"; 

const initialData = {
  nodes: [
    { id: "User", type: "person" },
    { id: "DB Server", type: "dbServer" },
    { id: "App Server", type: "server" },
    { id: "Workstation", type: "device" },
    { id: "API Gateway", type: "server" },
    { id: "User Interface", type: "application" },
    { id: "Database", type: "database" },
    { id: "API Endpoint", type: "endpoint" },
    { id: "Authentication", type: "security" },
  ],
  links: [
    { source: "User", target: "DB Server" },
    { source: "User", target: "App Server" },
    { source: "User", target: "Workstation" },
  ],
};

const iconMap = {
  person: "https://cdn-icons-png.flaticon.com/128/847/847969.png",
  server: "https://cdn-icons-png.flaticon.com/128/921/921490.png",
  dbServer: "https://cdn-icons-png.flaticon.com/512/14660/14660178.png ",
  device: "https://cdn-icons-png.flaticon.com/128/3144/3144456.png",
  database: "https://cdn-icons-png.flaticon.com/128/2991/2991112.png",
  application: "https://cdn-icons-png.flaticon.com/128/3616/3616933.png",
  endpoint: "https://cdn-icons-png.flaticon.com/128/2921/2921226.png",
  security: "https://cdn-icons-png.flaticon.com/128/18842/18842110.png",
};

const GraphComponent = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation(data.nodes)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3.forceLink(data.links).id((d) => d.id)
      );

    const link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    const node = svg
      .selectAll("image")
      .data(data.nodes)
      .enter()
      .append("image")
      .attr("xlink:href", (d) => iconMap[d.type] || "https://cdn-icons-png.flaticon.com/128/32/32339.png")
      .attr("width", 40)
      .attr("height", 40)
      .call(drag(simulation))
      .on("click", (event, d) => handleNodeClick(d.id));

    function drag(simulation) {
      return d3
        .drag()
        .on("start", (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("drag", (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        });
    }

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .attr("x", (d) => d.x - 20)
        .attr("y", (d) => d.y - 20);
    });

    function handleNodeClick(nodeId) {
      if (nodeId === "DB Server") {
        navigate("/database-table");
        setData({
          nodes: [
            ...initialData.nodes,
            { id: "Database Table", type: "database" },
          ],
          links: [
            ...initialData.links,
            { source: "DB Server", target: "Database Table" },
          ],
        });
      }
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default GraphComponent;
