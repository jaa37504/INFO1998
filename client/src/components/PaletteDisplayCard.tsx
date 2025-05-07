// src/components/PaletteDisplayCard.tsx
import React from 'react';
import { Box, Badge, Text, Title } from '@mantine/core';
import { Palette } from '../pages/Home';

type PaletteDisplayProps = Omit<Palette, 'id' | 'notes'>;

export function PaletteDisplayCard({
  title,
  tags = [],
  colors = [],
  textPairs = [],
}: PaletteDisplayProps) {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: '1rem',
        width: '100%',
        height: 350,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Color Swatches */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // overflow: 'hidden',
          overflow:"scroll",
          overflowY: 'auto',   // vertical scroll only
          overflowX: 'hidden', // prevent horizontal scroll
          marginBottom: '1rem',
          height: '100%',
        }}
      >
        {colors.map((color, i) => {
          const textColor = getTextColor(color, textPairs);
          return (
            <Box
              key={i}
              sx={{
                flex: 1,
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 40,
              }}
            >
              <Text
                sx={{
                  color: textColor,
                  fontWeight: 600,
                }}
              >
                {color.toUpperCase()}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Title */}
      <Title order={4} mb="xs">
        {title}
      </Title>

      {/* Tags */}
      <Box>
        {tags.map((tag, idx) => (
          <Badge
            key={idx}
            variant="outline"
            color={getBadgeColor(tag)}
            mr={4}
            mb={4}
          >
            {tag}
          </Badge>
        ))}
      </Box>
    </Box>
  );
}

function getTextColor(
  bg: string,
  textPairs: { background: string; text: string }[]
): string {
  const pair = textPairs.find(
    (p) => p.background.toLowerCase() === bg.toLowerCase()
  );
  if (pair) return pair.text;
  return pickContrastColor(bg);
}

function pickContrastColor(hexColor: string): string {
  const c = hexColor.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance =
    0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

function getBadgeColor(tag: string): string {
  switch (tag.toLowerCase()) {
    case 'minimal':
      return 'gray';
    case 'bold':
      return 'red';
    case 'playful':
      return 'yellow';
    default:
      return 'blue';
  }
}
