"use client";

import { useState, useEffect } from "react";
import { projects } from "@/app/lib/data";
import Card3D from "./Card3D";
import type { Project } from "@/app/types";

interface CardStackProps {
  onCardSelect: (project: Project | null) => void;
  selectedProject: Project | null;
  scrollOffset: number;
}

export default function CardStack({
  onCardSelect,
  selectedProject,
  scrollOffset,
}: CardStackProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sync selectedIndex with selectedProject from parent
  useEffect(() => {
    if (selectedProject === null) {
      setSelectedIndex(null);
    }
  }, [selectedProject]);

  const handleCardClick = (index: number) => {
    if (selectedIndex === index) {
      // Deselect
      setSelectedIndex(null);
      onCardSelect(null);
    } else {
      // Select
      setSelectedIndex(index);
      onCardSelect(projects[index]);
    }
  };

  const handleClose = () => {
    setSelectedIndex(null);
    onCardSelect(null);
  };

  return (
    <group position-x={scrollOffset}>
      {projects.map((project, index) => {
        // Calculate stacked positions - overlapping layout
        const totalCards = projects.length;
        const xOffset = (index - (totalCards - 1) / 2) * 4; // Overlapping spacing
        const zOffset = -index * 0.3; // Depth stacking
        const rotationY = (index - (totalCards - 1) / 2) * 0.05; // Subtle fan effect

        return (
          <Card3D
            key={project.id}
            project={project}
            index={index}
            position={[xOffset, 0, zOffset]}
            rotation={rotationY}
            isSelected={selectedIndex === index}
            isHovered={hoveredIndex === index}
            onHover={(isHovering) => setHoveredIndex(isHovering ? index : null)}
            onClick={() => handleCardClick(index)}
            onClose={handleClose}
          />
        );
      })}
    </group>
  );
}
