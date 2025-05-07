// src/components/PaletteForm.tsx
import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Checkbox,
  Title,
  Box
} from '@mantine/core';
import { PaletteDisplayCard } from './PaletteDisplayCard'; 
import { Palette } from '../pages/Home';

interface PaletteFormProps {
  onSubmit: (data: Omit<Palette, 'id'>) => void;
  initialData?: Palette;
}

export function PaletteForm({ onSubmit, initialData }: PaletteFormProps) {
  // pull in or default any missing arrays/strings
  const initTags = initialData?.tags ?? [];
  const initColors = initialData?.colors ?? [];
  const initTextPairs = initialData?.textPairs ?? [];

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [tags, setTags] = useState({
    minimal: initTags.includes('Minimal'),
    bold: initTags.includes('Bold'),
    playful: initTags.includes('Playful'),
  });
  const [colors, setColors] = useState<string[]>(initColors);
  const [textPairs, setTextPairs] = useState<{ background: string; text: string }[]>(initTextPairs);

  // whenever initialData changes (i.e. open Edit vs Create), reset form
  useEffect(() => {
    // normalize all incoming tags to lowercase
    const lowerTags = (initialData?.tags ?? []).map((tag) => tag.toLowerCase());
  
    setTitle(initialData?.title  ?? '');
    setNotes(initialData?.notes  ?? '');
    setTags({
      minimal: lowerTags.includes('minimal'),
      bold:    lowerTags.includes('bold'),
      playful: lowerTags.includes('playful'),
    });
    setColors(initialData?.colors    ?? []);
    setTextPairs(initialData?.textPairs ?? []);
  }, [initialData]);

  const handleAddColor = () => {
    setColors((prev) => [...prev, '']);
  };

  const handleColorChange = (index: number, newColor: string) => {
    setColors((prev) => {
      const updated = [...prev];
      updated[index] = newColor;
      return updated;
    });
  };

  const handleAddTextPair = () => {
    setTextPairs((prev) => [...prev, { background: '', text: '' }]);
  };

  const handleTextPairChange = (
    index: number,
    key: 'background' | 'text',
    value: string
  ) => {
    setTextPairs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeTags = (Object.keys(tags) as (keyof typeof tags)[])
      .filter((k) => tags[k])
      .map((k) => {
        // map state keys back to your tag strings
        if (k === 'minimal') return 'Minimal';
        if (k === 'bold') return 'Bold';
        return 'Playful';
      });

    onSubmit({
      title,
      notes,
      tags: activeTags,
      colors,
      textPairs,
    });
  };

  const activeTags = (Object.keys(tags) as (keyof typeof tags)[])
    .filter((k) => tags[k])
    .map((k) => {
      if (k === 'minimal') return 'Minimal';
      if (k === 'bold') return 'Bold';
      return 'Playful';
    });

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <Title order={4} mb="sm">Palette Information</Title>
      <TextInput
        label="Palette Title"
        placeholder="My Awesome Palette"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        mb="md"
        required
      />
      <Textarea
        label="Notes"
        placeholder="Brief notes about this palette..."
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        mb="md"
      />

      <Title order={5} mb="xs">Tags</Title>
      <Group mb="md">
        <Checkbox
          label="Minimal"
          checked={tags.minimal}
          onChange={(e) => setTags({ ...tags, minimal: e.currentTarget.checked })}
        />
        <Checkbox
          label="Bold"
          checked={tags.bold}
          onChange={(e) => setTags({ ...tags, bold: e.currentTarget.checked })}
        />
        <Checkbox
          label="Playful"
          checked={tags.playful}
          onChange={(e) => setTags({ ...tags, playful: e.currentTarget.checked })}
        />
      </Group>

      <Title order={5} mb="xs">Colors</Title>
      {colors.map((color, i) => (
        <TextInput
          key={i}
          placeholder="#ff0000"
          value={color}
          onChange={(e) => handleColorChange(i, e.currentTarget.value)}
          mb="xs"
        />
      ))}
      <Button variant="outline" size="xs" onClick={handleAddColor} mb="md">
        + Add Color
      </Button>

      <Title order={5} mt="md" mb="xs">Text Pairs</Title>
      {textPairs.map((pair, i) => (
        <Group key={i} mb="xs">
          <TextInput
            placeholder="Background color"
            value={pair.background}
            onChange={(e) => handleTextPairChange(i, 'background', e.currentTarget.value)}
          />
          <TextInput
            placeholder="Text color"
            value={pair.text}
            onChange={(e) => handleTextPairChange(i, 'text', e.currentTarget.value)}
          />
        </Group>
      ))}
      <Button variant="outline" size="xs" onClick={handleAddTextPair} mb="md">
        + Add Text Pair
      </Button>

      <Title order={5} mb="xs">Preview</Title>
      <Box mb="md">
        <PaletteDisplayCard
          title={title || 'Untitled Palette'}
          tags={activeTags}
          colors={colors}
          textPairs={textPairs}
        />
      </Box>

      <Box mt="md">
        <Button type="submit" fullWidth>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </Box>
    </form>
  );
}
