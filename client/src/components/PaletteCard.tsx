import React from 'react';
import { Card, Text, Badge, Group } from '@mantine/core';


interface PaletteCardProps {
  title: string;
  tags: string[];
}

export function PaletteCard({ title, tags }: PaletteCardProps) {
  // Mapping tag names to badge colors
  const tagColors: Record<string, string> = {
    Minimal: 'gray',
    Bold: 'red',
    Playful: 'yellow',
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text weight={500} size="lg" mb="md">
        {title}
      </Text>
      <Group spacing="xs">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            // Use the mapping object; if the tag doesn't match one in the mapping, default to blue
            color={tagColors[tag] || 'blue'}
          >
            {tag}
          </Badge>
        ))}
      </Group>
    </Card>
  );
}
