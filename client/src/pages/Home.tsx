// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
// import { signInWithGoogle } from '../util/firebase';
import {
  Checkbox,
  Container,
  Group,
  Title,
  SimpleGrid,
  ActionIcon,
  Modal,
  Box,
  Text,
  Button,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { PaletteDisplayCard } from "../components/PaletteDisplayCard";
import { PaletteForm } from "../components/PaletteForm";
import { API_URL } from "../environment";

export interface Palette {
  id: string;
  title: string;
  notes: string;
  tags: string[];
  colors: string[];
  textPairs: { background: string; text: string }[];
}

export default function HomePage() {
  // 1️⃣ filters (all on by default)
  const [filters, setFilters] = useState({
    minimal: true,
    bold: true,
    playful: true,
  });

  // 2️⃣ palettes loaded from Firestore
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ▶︎ delete‐confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 3️⃣ fetch & normalize once on mount
  useEffect(() => {
    fetch(`${API_URL}/api/palettes`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<any[]>;
      })
      .then((raw) => {
        const fixed: Palette[] = raw.map((doc) => ({
          id: doc.id,
          title: doc.title,
          notes: doc.notes || "",
          tags: Array.isArray(doc.tags) ? doc.tags : [],
          colors: Array.isArray(doc.colors) ? doc.colors : [],
          textPairs: Array.isArray(doc.textPairs) ? doc.textPairs : [],
        }));
        setPalettes(fixed);
      })
      .catch((err) => console.error("Failed to load palettes:", err));
  }, []);

  // toggle one filter
  const toggleFilter = (k: "minimal" | "bold" | "playful") =>
    setFilters((f) => ({ ...f, [k]: !f[k] }));

  // OR‐based filter logic
  const getFiltered = () => {
    const active = ([
      filters.minimal && "minimal",
      filters.bold && "bold",
      filters.playful && "playful",
    ] as string[]).filter(Boolean);

    if (active.length === 0) return palettes;

    return palettes.filter((p) =>
      (p.tags || []).some((tag) => active.includes(tag.toLowerCase()))
    );
  };

  // helper to close create/edit
  const closeEditor = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  // open create/edit modal
  const openEditor = (id?: string) => {
    setEditingId(id ?? null);
    setModalOpen(true);
  };

  // save (create or update)
  const handleSave = (data: Omit<Palette, "id">) => {
    const isEdit = editingId !== null;
    const url = isEdit
      ? `${API_URL}/api/palettes/${editingId}`
      : `${API_URL}/api/palettes`;
    fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<Palette>;
      })
      .then((saved) => {
        setPalettes((prev) =>
          isEdit
            ? prev.map((p) => (p.id === saved.id ? saved : p))
            : [...prev, saved]
        );
      })
      .catch((err) => console.error("Save failed:", err))
      .finally(closeEditor);
  };

  // delete via API
  const handleDelete = (id: string) => {
    fetch(`${API_URL}/api/palettes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        setPalettes((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err))
      .finally(() => setDeleteId(null));
  };

  
  // palette being edited
  const editingPalette =
    editingId !== null ? palettes.find((p) => p.id === editingId) : undefined;

  return (
    <>
      <Container fluid style={{ padding: "3rem 8rem 4rem" }}>
        <Title align="center" style={{ marginBottom: "1rem" }}>
          Color Palette Tracker
        </Title>
        <Text
          align="center"
          size="lg"
          mb="lg"
          style={{ marginBottom: "2rem" }}
        >
          Create, edit, and save color palettes for your projects. Use the
          filters to narrow down your search.
        </Text>
        {/* <Button onClick={signInWithGoogle}>Sign In</Button>; */}
        {/* Filters */}
        <Group position="left" style={{ marginBottom: "2rem" }}>
          <Checkbox
            label="Minimal"
            checked={filters.minimal}
            onChange={() => toggleFilter("minimal")}
          />
          <Checkbox
            label="Bold"
            checked={filters.bold}
            onChange={() => toggleFilter("bold")}
          />
          <Checkbox
            label="Playful"
            checked={filters.playful}
            onChange={() => toggleFilter("playful")}
          />
        </Group>

        {/* Palette Grid */}
        <SimpleGrid
          cols={3}
          spacing="4rem"
          breakpoints={[
            { maxWidth: "md", cols: 2, spacing: "2rem" },
            { maxWidth: "sm", cols: 1, spacing: "1rem" },
          ]}
        >
          {getFiltered().map((p) => (
            <Box key={p.id} sx={{ position: "relative" }}>
              <Box onClick={() => openEditor(p.id)} sx={{ cursor: "pointer" }}>
                <PaletteDisplayCard
                  title={p.title}
                  tags={p.tags}
                  colors={p.colors}
                  textPairs={p.textPairs}
                />
              </Box>
              <ActionIcon
                size="sm"
                color="red"
                onClick={() => setDeleteId(p.id)}
                sx={{ position: "absolute", bottom: 20, right: 16 }}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* + Floating button */}
      <ActionIcon
        variant="filled"
        size="xl"
        color="blue"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 10000 }}
        onClick={() => openEditor()}
      >
        <IconPlus size={24} />
      </ActionIcon>

       {/* ─── Footer ─── */}
       <Box
        component="footer"
        sx={{
          borderTop: '1px solid #eee',
          padding: '2rem 8rem',
          marginTop: '4rem',
        }}
      >
        <Text align="center" size="sm" mb="xs">
          This tracker was created by Jessica Andrews as her final project for DTI’s “Trends in Web Development” course.
        </Text>
        <Group position="center" spacing="md">
          <Button
            component="a"
            href="https://www.linkedin.com/in/jessica-andrews-a34842228/"
            target="_blank"
            variant="subtle"
            size="xs"
          >
            LinkedIn
          </Button>
          <Button
            component="a"
            href="https://jessicaachsahandre.wixsite.com/jessica-andrews-port"
            target="_blank"
            variant="subtle"
            size="xs"
          >
            Portfolio
          </Button>
          <Button
            component="a"
            href="https://docs.google.com/presentation/d/1toi0s6iXkhAQdQmfMYiTmj7HdpRJ4J9ziWlVwZCUV2A/edit?usp=sharing"
            target="_blank"
            variant="subtle"
            size="xs"
          >
            Portfolio Presentation
          </Button>
        </Group>
      </Box>

      {/* Create/Edit Palette */}
      <Modal
        opened={modalOpen}
        onClose={closeEditor}
        title={editingId ? "Edit Palette" : "Create a Palette"}
        centered
        size="lg"
        padding="lg"
      >
        <PaletteForm onSubmit={handleSave} initialData={editingPalette} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        opened={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm delete"
        centered
      >
        <Text>Are you sure you want to delete this palette?</Text>
        <Group position="right" mt="md">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => deleteId && handleDelete(deleteId)}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
