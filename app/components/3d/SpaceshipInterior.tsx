'use client';

import { Capsule, Project } from '@/app/types';
import { capsules, projects } from '@/app/lib/data';
import Rocket3D from './Rocket3D';

interface SpaceshipInteriorProps {
  selectedCapsuleId: string | null;
  hoveredCapsuleId: string | null;
  onCapsuleSelect: (capsuleId: string) => void;
  onCapsuleHover: (capsuleId: string | null) => void;
  onCapsuleEnter: (capsuleId: string) => void;
}

export default function SpaceshipInterior({
  selectedCapsuleId,
  hoveredCapsuleId,
  onCapsuleSelect,
  onCapsuleHover,
  onCapsuleEnter,
}: SpaceshipInteriorProps) {
  return (
    <group>
      {capsules.map((capsule) => {
        // Find associated project
        const project = projects.find((p) => p.id === capsule.projectId);

        return (
          <Rocket3D
            key={capsule.id}
            rocket={capsule}
            project={project}
            isSelected={selectedCapsuleId === capsule.id}
            isHovered={hoveredCapsuleId === capsule.id}
            onSelect={() => onCapsuleSelect(capsule.id)}
            onHover={(hovered) => onCapsuleHover(hovered ? capsule.id : null)}
            onEnter={() => onCapsuleEnter(capsule.id)}
          />
        );
      })}
    </group>
  );
}
