import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Search, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  RotateCcw, 
  Music, 
  FileText, 
  Printer, 
  Download, 
  Upload, 
  Sparkles, 
  Clock, 
  Volume2, 
  VolumeX,
  Save,
  Zap,
  ChevronUp,
  ChevronDown,
  Mic,
  User,
  CheckSquare
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

// ── TYPES ──
interface Section {
  label: string;
  bpm: number;
}

interface Song {
  num: string | number;
  id: string;
  title: string;
  bpm?: number[];
  sections?: Section[];
  feel?: string;
}

interface NoteItem {
  tag: "repeat" | "cut" | "timing" | "dynamics" | "general";
  text: string;
}

interface NoteGroup {
  num: string;
  id: string;
  title: string;
  items: NoteItem[];
}

interface KBCheckItem {
  num: string | number;
  title: string;
  checked: boolean;
}

// ── DEFAULT DATA ──
const DEFAULT_SONGS: Song[] = [
  {
    num: 1,
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Intro)",
    sections: [
      { label: "m.A", bpm: 120 },
    ],
    feel: "Bar A: accelerando 116→128",
  },
  {
    num: "1A",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Part 1)",
    sections: [{ label: "m.1", bpm: 145 }],
  },
  {
    num: "1B",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Part 2)",
    sections: [{ label: "m.1", bpm: 146 }],
  },
  {
    num: "1C",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Part 3)",
    sections: [
      { label: "m.1", bpm: 143 },
      { label: "m.20", bpm: 145 },
    ],
  },
  {
    num: "1D",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Part 4)",
    sections: [
      { label: "m.1", bpm: 143 },
      { label: "m.9", bpm: 146 },
    ],
  },
  {
    num: 2,
    id: "02-03",
    title: "Our Story Begins…",
    sections: [
      { label: "m.1", bpm: 175 },
    ],
  },
  {
    num: 3,
    id: "02-03",
    title: "Horton Hears a Who!",
    sections: [
      { label: "m.63", bpm: 179 },
      { label: "m.86", bpm: 138 },
      { label: "m.93", bpm: 104 },
      { label: "m.99", bpm: 172 },
    ],
  },
  {
    num: 4,
    id: "04-04c",
    title: "Biggest Blame Fool",
    sections: [],
  },
  {
    num: "4A",
    id: "04-04c",
    title: "Biggest Blame Fool (Part 2)",
    sections: [
      { label: "m.1", bpm: 160 },
      { label: "m.29", bpm: 165 },
      { label: "m.34", bpm: 167 },
    ],
  },
  {
    num: "4B",
    id: "04-04c",
    title: "Biggest Blame Fool (Part 3)",
    sections: [
      { label: "m.1", bpm: 171 },
      { label: "m.25", bpm: 167 },
      { label: "m.33", bpm: 173 },
    ],
  },
  {
    num: "4C",
    id: "04-04c",
    title: "Biggest Blame Fool (Part 4)",
    sections: [
      { label: "m.1", bpm: 171 },
      { label: "m.15", bpm: 171 },
    ],
  },
  {
    num: "4D",
    id: "04-04D",
    title: "Biggest Blame Playoff / Gertrude McFuzz",
    sections: [
      { label: "m.1", bpm: 178 },
      { label: "m.13", bpm: 175 },
    ],
  },
  {
    num: 5,
    id: "05-05D",
    title: "Here on Who (Part 1)",
    sections: [
      { label: "m.1 ♩", bpm: 162 },
      { label: "m.49 ♩", bpm: 163 },
      { label: "m.57 ♩", bpm: 167 },
      { label: "m.71 ♩", bpm: 160 },
      { label: "m.75 ♩", bpm: 154 },
      { label: "m.87 ♩", bpm: 153 },
      { label: "m.97 ♩", bpm: 155 },
    ],
    feel: "12/8 (♩.=♩ triplet)",
  },
  {
    num: "5A",
    id: "05-05D",
    title: "Here on Who (Part 2: Dance)",
    sections: [
      { label: "m.A ♩", bpm: 162 },
      { label: "m.31 ♩", bpm: 157 },
    ],
    feel: "12/8 (♩.=♩ triplet)",
  },
  {
    num: "5B",
    id: "05-05D",
    title: "Here on Who (Part 3: The War)",
    sections: [{ label: "m.1 ♩", bpm: 165 }],
    feel: "12/8 — Colla Voce mm.9–16",
  },
  {
    num: "5C",
    id: "05-05D",
    title: "Here on Who (Part 4: The Lorax)",
    sections: [
      { label: "m.1", bpm: 97 },
      { label: "m.10", bpm: 86 },
    ],
    feel: "4/4",
  },
  {
    num: "5D",
    id: "05-05D",
    title: "Here on Who (Part 5)",
    sections: [
      { label: "m.1 ♩", bpm: 103 },
      { label: "m.9 ♩", bpm: 105 },
      { label: "m.16", bpm: 105 },
    ],
    feel: "12/8 → 4/4 at m.16",
  },
  {
    num: "5E",
    id: "05E 1",
    title: "Meet JoJo the Who",
    sections: [
      { label: "m.1 ♩", bpm: 156 },
      { label: "m.5 ♩", bpm: 132 },
      { label: "m.12 ♩", bpm: 135 },
      { label: "m.20 ♩", bpm: 100 },
      { label: "m.32 ♩", bpm: 105 },
      { label: "m.35 ♩", bpm: 125 },
    ],
    feel: "12/8 (♩.=♩ triplet)",
  },
  {
    num: 6,
    id: "05E 2-07B1",
    title: "Oh, The Thinks You Can Think! (Reprise)",
    sections: [{ label: "6 m.1", bpm: 147 }],
  },
  {
    num: 7,
    id: "05E 2-07B1",
    title: "It's Possible (Part 1)",
    sections: [{ label: "m.4", bpm: 147 }],
  },
  {
    num: "7A",
    id: "05E 2-07B1",
    title: "It's Possible (Part 2: Dance)",
    sections: [{ label: "m.41", bpm: 147 }],
  },
  {
    num: "7B",
    id: "07B2",
    title: "It's Possible (Part 3)",
    sections: [{ label: "m.20", bpm: 109 }],
  },
  {
    num: 8,
    id: "08",
    title: "How to Raise a Child",
    sections: [
      { label: "m.1", bpm: 141 },
      { label: "m.28", bpm: 132 },
    ],
  },
  {
    num: 9,
    id: "09",
    title: "The Military (Verse)",
    sections: [
      { label: "m.1", bpm: 151 },
      { label: "9a m.4", bpm: 86 },
      { label: "9a m.8", bpm: 99 },
      { label: "9a m.13", bpm: 120 },
      { label: "9b m.1", bpm: 122 },
      { label: "9d m.1", bpm: 125 },
      { label: "9e m.1", bpm: 122 },
    ],
  },
  {
    num: "9A",
    id: "09",
    title: "The Military (Genghis' Verse)",
    sections: [
      { label: "9a m.4", bpm: 86 },
      { label: "9a m.8", bpm: 99 },
      { label: "9a m.13", bpm: 120 },
    ],
  },
  {
    num: "9B",
    id: "09",
    title: "The Military (Part 1)",
    sections: [
      { label: "9b m.1", bpm: 122 },
    ],
  },
  {
    num: "9C",
    id: "09",
    title: "The Military (Part 2)",
    sections: [],
  },
  {
    num: "9D",
    id: "09",
    title: "The Military (Part 3)",
    sections: [
      { label: "9d m.1", bpm: 125 },
    ],
  },
  {
    num: "9E",
    id: "09",
    title: "The Military (Playoff)",
    sections: [
      { label: "9e m.1", bpm: 122 },
    ],
  },
  {
    num: 10,
    id: "10-10B",
    title: "Alone in the Universe (Part 1)",
    sections: [
      { label: "10 m.1", bpm: 123 },
      { label: "10 m.9", bpm: 114 },
    ],
  },
  {
    num: "10A",
    id: "10-10B",
    title: "Alone in the Universe (Part 2)",
    sections: [
      { label: "10a m.1", bpm: 137 },
    ],
  },
  {
    num: "10B",
    id: "10-10B",
    title: "Alone in the Universe (Part 3)",
    sections: [
      { label: "10b m.13", bpm: 126 },
      { label: "10b m.19", bpm: 125 },
    ],
  },
  {
    num: 11,
    id: "11",
    title: "The One Feather Tail of Miss Gertrude McFuzz",
    sections: [
      { label: "m.1", bpm: 174 },
      { label: "m.12", bpm: 174 },
      { label: "m.33", bpm: 156 },
      { label: "m.54", bpm: 204 },
    ],
  },
  {
    num: 12,
    id: "12",
    title: "Amayzing Mayzie (Part 1)",
    sections: [
      { label: "m.1", bpm: 201 },
      { label: "m.85", bpm: 205 },
    ],
  },
  {
    num: "12A",
    id: "12A",
    title: "Amayzing Gertrude (Part 1)",
    sections: [
      { label: "12a m.1", bpm: 119 },
    ],
    feel: "♩.=119 (half of 238 minim)",
  },
  {
    num: "12B",
    id: "12B",
    title: "Amayzing Gertrude (Part 2)",
    sections: [
      { label: "12b m.52", bpm: 122 },
    ],
  },
  {
    num: 13,
    id: "13",
    title: "Monkey Around",
    sections: [
      { label: "13 m.1", bpm: 122 },
    ],
  },
  {
    num: 14,
    id: "14-14C",
    title: "Chasing the Whos (Part 1)",
    sections: [
      { label: "m.1", bpm: 212 },
    ],
  },
  {
    num: "14A",
    id: "14-14C",
    title: "Chasing the Whos (Part 2)",
    sections: [],
  },
  {
    num: "14B",
    id: "14-14C",
    title: "Chasing the Whos (Part 3)",
    sections: [],
  },
  {
    num: "14C",
    id: "14-14C",
    title: "Chasing the Whos (Part 4)",
    sections: [
      { label: "14c m.16", bpm: 155 },
    ],
  },
  {
    num: 15,
    id: "15",
    title: "How Lucky You Are",
    sections: [
      { label: "m.3", bpm: 140 },
    ],
  },
  {
    num: 16,
    id: "16 1",
    title: "Notice Me, Horton",
    sections: [
      { label: "m.1", bpm: 182 },
      { label: "m.20", bpm: 89 },
      { label: "m.28", bpm: 115 },
      { label: "m.85", bpm: 135 },
    ],
  },
  {
    num: "16A",
    id: "16A",
    title: "How Lucky You Are (Reprise)",
    sections: [
      { label: "m.1", bpm: 94 },
    ],
    feel: "♩ = 94",
  },
  {
    num: "16B",
    id: "16B",
    title: "Mayzie's Exit Music",
    sections: [
      { label: "16b m.1", bpm: 202 },
    ],
  },
  {
    num: 17,
    id: "17",
    title: "Finale (Part 1: Horton Sits on the Egg)",
    sections: [
      { label: "17 m.1", bpm: 186 },
      { label: "17 m.29", bpm: 182 },
    ],
  },
  {
    num: "17A",
    id: "17A",
    title: "Finale (Part 2: Horton's Dilemma / The Hunters)",
    sections: [
      { label: "17a m.5", bpm: 186 },
      { label: "17a m.19", bpm: 186 },
      { label: "17a m.30", bpm: 196 },
      { label: "17a m.50", bpm: 152 },
    ],
  },
  {
    num: "17B",
    id: "17B",
    title: "Finale (Part 3: How Lucky You Are: Reprise)",
    sections: [
      { label: "17b m.3", bpm: 142 },
    ],
  },
  {
    num: 18,
    id: "18",
    title: "Entr'acte",
    bpm: [159],
    feel: "Steady — slight decel toward end",
  },
  {
    num: "18A",
    id: "18A-18B",
    title: "Our Story Resumes... (Part 1)",
    sections: [
      { label: "T1", bpm: 185 },
      { label: "T2", bpm: 163 },
      { label: "T3", bpm: 186 },
    ],
  },
  {
    num: "18B",
    id: "18A-18B",
    title: "Our Story Resumes... (Part 2)",
    sections: [
      { label: "T4", bpm: 164 },
      { label: "T5", bpm: 125 },
    ],
    feel: "Ritard to end",
  },
  {
    num: 19,
    id: "19 1",
    title: "Egg, Nest & Tree",
    sections: [
      { label: "19 m.1", bpm: 212 },
      { label: "19 m.43", bpm: 214 },
      { label: "19 m.58", bpm: 192 },
      { label: "19 m.68", bpm: 118 },
    ],
  },
  {
    num: 20,
    id: "19 2-20B",
    title: "The Circus McGurkus (Part 1)",
    sections: [
      { label: "20 m.1a", bpm: 195 },
      { label: "20 m.1b", bpm: 151 },
    ],
  },
  {
    num: "20A",
    id: "19 2-20B",
    title: "The Circus McGurkus (Part 2)",
    sections: [
      { label: "m.9", bpm: 125 },
      { label: "m.41 ❓", bpm: 125 },
      { label: "m.45", bpm: 125 },
      { label: "m.48", bpm: 121 },
    ],
    feel: "⚠ mm.41–44: dictated or straight through?",
  },
  {
    num: "20B",
    id: "19 2-20B",
    title: "The Circus McGurkus (Part 3)",
    sections: [{ label: "20b m.1", bpm: 133 }],
  },
  {
    num: "20C",
    id: "20C-21A",
    title: "The Circus on Tour / How Lucky You Are (Rep.)",
    sections: [
      { label: "20c m.1", bpm: 150 },
      { label: "20c m.32", bpm: 145 },
    ],
  },
  {
    num: 21,
    id: "20C-21A",
    title: "Mayzie in Palm Beach",
    sections: [
      { label: "21 m.1", bpm: 200 },
      { label: "21 m.10a", bpm: 115 },
    ],
  },
  {
    num: "21A",
    id: "20C-21A",
    title: "Mayzie at the Circus",
    sections: [
      { label: "21a m.1", bpm: 120 },
      { label: "21a m.9", bpm: 153 },
      { label: "21a m.15", bpm: 137 },
    ],
  },
  {
    num: "21B",
    id: "21B",
    title: "Amayzing Horton (Part 2)",
    sections: [
      { label: "m.1", bpm: 136 },
      { label: "m.18", bpm: 158 },
      { label: "m.26", bpm: 201 },
      { label: "m.42", bpm: 126 },
    ],
  },
  {
    num: "21C",
    id: "21C-22",
    title: "Alone in the Universe (Reprise)",
    sections: [{ label: "m.1", bpm: 115 }],
  },
  {
    num: 22,
    id: "21C-22",
    title: "Solla Sollew",
    sections: [
      { label: "m.5", bpm: 112 },
      { label: "m.72", bpm: 109 },
    ],
  },
  {
    num: 23,
    id: "23-23A 1",
    title: "Green Eggs & Ham II",
    sections: [
      { label: "m.5", bpm: 113 },
      { label: "m.7", bpm: 122 },
    ],
  },
  {
    num: "23A",
    id: "23-23A 1",
    title: "Butter Battle",
    sections: [
      { label: "m.1", bpm: 122 },
      { label: "m.7", bpm: 66 },
    ],
  },
  {
    num: "23B",
    id: "23A 2-23B",
    title: "Saving Private JoJo",
    sections: [
      { label: "m.1", bpm: 61 },
      { label: "m.8 Accel.", bpm: 70 },
      { label: "m.10", bpm: 132 },
    ],
  },
  {
    num: 24,
    id: "24",
    title: "Into the Who's Christmas Pageant",
    sections: [
      { label: "m.1", bpm: 127 },
      { label: "m.11", bpm: 127 },
    ],
  },
  {
    num: "24A",
    id: "24A",
    title: "The Grinch Carved the Roast Beast",
    sections: [
      { label: "m.1", bpm: 126 },
      { label: "m.1 Rit.", bpm: 98 },
      { label: "m.2", bpm: 98 },
    ],
  },
  {
    num: "24B",
    id: "24B",
    title: "A Message from the Front / Solla Sollew (Reprise)",
    sections: [
      { label: "m.1", bpm: 120 },
      { label: "m.40", bpm: 116 },
      { label: "m.46", bpm: 113 },
    ],
  },
  {
    num: "24C",
    id: "24C",
    title: "How Sad",
    sections: [
      { label: "m.57", bpm: 119 },
      { label: "m.71", bpm: 114 },
    ],
  },
  {
    num: "24D",
    id: "24D",
    title: "A Re-enactment",
    sections: [
      { label: "m.1", bpm: 118 },
      { label: "m.9", bpm: 117 },
    ],
  },
  {
    num: 25,
    id: "25",
    title: "JoJo Alone in the Universe",
    sections: [
      { label: "m.1", bpm: 141 },
      { label: "m.8", bpm: 140 },
    ],
  },
  {
    num: 26,
    id: "26",
    title: "Havin' a Hunch",
    sections: [
      { label: "m.5", bpm: 162 },
      { label: "m.33", bpm: 163 },
      { label: "m.39", bpm: 161 },
    ],
  },
  {
    num: "26A",
    id: "26A",
    title: "Havin' a Hunch (Part 2: Nightmare Ballet)",
    sections: [
      { label: "m.1", bpm: 161 },
      { label: "m.17", bpm: 158 },
      { label: "m.39", bpm: 155 },
    ],
  },
  {
    num: "26B",
    id: "26B",
    title: "Havin' a Hunch (Part 3: Oh, the Thinks!)",
    sections: [
      { label: "m.1", bpm: 157 },
      { label: "m.10", bpm: 112 },
      { label: "m.12", bpm: 158 },
      { label: "m.22", bpm: 158 },
      { label: "m.28", bpm: 135 },
    ],
  },
  {
    num: "26C",
    id: "26C",
    title: "Havin' a Hunch (Part 4)",
    sections: [
      { label: "m.1", bpm: 164 },
      { label: "m.25", bpm: 158 },
    ],
  },
  {
    num: 27,
    id: "27",
    title: "Gertrude / Espionage",
    sections: [
      { label: "m.1", bpm: 95 },
      { label: "m.8", bpm: 84 },
    ],
  },
  {
    num: "27A",
    id: "27A",
    title: "All for You (Verse)",
    sections: [
      { label: "27a.2", bpm: 195 },
      { label: "27a.25", bpm: 195 },
      { label: "27a.35", bpm: 157 },
      { label: "27a.36", bpm: 126 },
      { label: "27a.38", bpm: 205 },
      { label: "27a.42", bpm: 209 },
      { label: "27a.42", bpm: 156 },
      { label: "27a.48", bpm: 153 },
      { label: "27a.50", bpm: 138 },
      { label: "27a.52", bpm: 119 },
    ],
  },
  {
    num: "27B",
    id: "27B",
    title: "All for You...",
    sections: [
      { label: "27b.1", bpm: 163 },
      { label: "27b.9", bpm: 158 },
      { label: "27b.15", bpm: 153 },
      { label: "27b.33", bpm: 121 },
      { label: "27b.41", bpm: 125 },
    ],
  },
  {
    num: "27C",
    id: "27C",
    title: "The Whos Return",
    sections: [
      { label: "27c.2", bpm: 85 },
      { label: "27c.6", bpm: 80 },
    ],
  },
  {
    num: 28,
    id: "28",
    title: "The People Versus Horton the Elephant (Part 1)",
    sections: [
      { label: "m.13", bpm: 200 }
    ]
  },
  {
    num: "28A",
    id: "28A",
    title: "The People Versus Horton the Elephant (Part 2)",
    sections: [
      { label: "28a.4", bpm: 200 },
      { label: "28a.22", bpm: 165 },
      { label: "28a.40", bpm: 175 }
    ]
  },
  {
    num: "28B",
    id: "28B",
    title: "The People Versus Horton the Elephant (Part 3)",
    sections: [
      { label: "28b.30", bpm: 160 },
      { label: "28b.35", bpm: 135 },
      { label: "28b.43", bpm: 115 },
      { label: "28b.57", bpm: 177 },
      { label: "28b.61", bpm: 168 },
      { label: "28b.67", bpm: 178 },
      { label: "28b.79", bpm: 177 }
    ]
  },
  {
    num: "28C",
    id: "28C",
    title: "The People Versus Horton the Elephant (Part 4)",
    sections: [
      { label: "28c.1", bpm: 261 }
    ]
  },
  {
    num: "28D",
    id: "28D",
    title: "Yopp!/Alone in the Universe (Reprise)",
    sections: [
      { label: "28d.1", bpm: 96 },
      { label: "28d.19", bpm: 210 },
      { label: "28d.45", bpm: 215 },
      { label: "28d.56", bpm: 109 }
    ]
  },
  {
    num: 29,
    id: "29",
    title: "Oh, The Thinks You Can Think! (Finale Act 2)",
    sections: [
      { label: "29.1", bpm: 99 },
      { label: "29.14", bpm: 145 }
    ]
  },
  {
    num: 30,
    id: "30",
    title: "Green Eggs And Ham (Finale Bows: Swing)",
    bpm: [196],
  },
  {
    num: 31,
    id: "31",
    title: "Exit Music",
    bpm: [147],
  },
];

const DEFAULT_NOTES: NoteGroup[] = [
  {
    num: "1A",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Intro)",
    items: [],
  },
  {
    num: "2",
    id: "02-03",
    title: "Our Story Begins…",
    items: [
      {
        tag: "repeat",
        text: "bar 17-19: Play twice (subject to tech) (MORGAN)",
      },
    ]
  },
  {
    num: "4A",
    id: "04-04c",
    title: "Biggest Blame Fool (Part 2)",
    items: [
      { tag: "general", text: "bar 9: as written (MORGAN)" },
      { tag: "repeat", text: "bar 74-75: likely twice, but wait for vocal cue (MORGAN)" }
    ]
  },
  {
    num: "4B",
    id: "04-04c",
    title: "Biggest Blame Fool (Part 3)",
    items: []
  },
  {
    num: "4D",
    id: "04-04D",
    title: "Biggest Blame Playoff / Gertrude McFuzz",
    items: [
      { tag: "general", text: "bar 1-2: as written, chorus will likely need a cue in (MORGAN)" }
    ]
  },
  {
    num: "5",
    id: "05-05D",
    title: "Here on Who (Parts 1–5E)",
    items: [
      { tag: "cut", text: "m.95: no rall." },
      { tag: "timing", text: "m.96: poco rit." },
      { tag: "general", text: "5B mm.9–16: Colla Voce." },
      { tag: "timing", text: "5C m.16: poco rit." },
      {
        tag: "timing",
        text: "5D m.13: fermata on beat 3 — vocals lead back into m.14.",
      },
      { tag: "timing", text: "bar 97: wait for vocal cue (MORGAN)" }
    ],
  },
  {
    num: "8",
    id: "08",
    title: "How to Raise a Child",
    items: [
      { tag: "repeat", text: "mm.28–31: play once only — do not repeat." },
    ],
  },
  {
    num: "9",
    id: "09",
    title: "The Military (Verse)",
    items: [
      { tag: "repeat", text: "9a, bar 14: Play six times (subject to tech) (MORGAN)" },
      { tag: "timing", text: "9b, bar 17: wait for vocal cue (MORGAN)" },
      { tag: "repeat", text: "9e, bar 14: as written, four times (MORGAN)" }
    ]
  },
  {
    num: "10",
    id: "10-10B",
    title: "Alone in the Universe (Part 1–3)",
    items: [
      { tag: "timing", text: "m.14: rall." },
      { tag: "timing", text: "m.15: a tempo." },
      { tag: "repeat", text: "10, bar 1: twice (Subject to tech) (MORGAN)" }
    ],
  },
  {
    num: "16b-17b",
    id: "16B-17B",
    title: "Mayzie's Exit Music / Finale (Pt 1–3)",
    items: [
      { tag: "repeat", text: "17b, bar 47-48: Three times as written (cast has been practising it 4 times due to error in score) (MORGAN)" },
      { tag: "timing", text: "17a / m.18: NO FERMATA" },
    ]
  },
  {
    num: "19",
    id: "19 1",
    title: "Egg, Nest & Tree",
    items: [
      { tag: "repeat", text: "M1–m4: repeat twice" }
    ]
  },
  {
    num: "20A",
    id: "19 2-20B",
    title: "The Circus McGurkus (Part 2)",
    items: [
      {
        tag: "general",
        text: "mm.41–44 ❓ — TBC: dictated or played straight through?",
      },
    ],
  },
  {
    num: "23A",
    id: "23-23A 1",
    title: "Butter Battle",
    items: [
      { tag: "timing", text: "bar 3-4: wait for vocal cue (MORGAN)" }
    ]
  },
  {
    num: "23B",
    id: "23A 2-23B",
    title: "Saving Private JoJo",
    items: [
      { tag: "timing", text: "m.7: no pause on beat two. Straight through/on stick." },
      { tag: "cut", text: "Cut bars 6–7" },
      { tag: "timing", text: "Fermata on m.5" },
      { tag: "timing", text: "m.8: on cue" },
      { tag: "timing", text: "m.10: on cue" },
    ],
  },
  {
    num: "24",
    id: "24",
    title: "Into the Who's Christmas Pageant",
    items: [
      { tag: "repeat", text: "bar 1: as written, play twice (MORGAN)" },
      { tag: "general", text: "bar 15-18: as written (MORGAN)" },
      { tag: "timing", text: "M1 is a safety / vamp" },
    ],
  },
  {
    num: "24A",
    id: "24A",
    title: "The Grinch Carved the Roast Beast",
    items: [
      { tag: "repeat", text: "M1 ONLY once — no repeat" }
    ],
  },
  {
    num: "24D",
    id: "24D",
    title: "A Re-enactment",
    items: [
      { tag: "general", text: "Bar 6 is CUT — move from Bar 5 to Bar 7" },
      { tag: "timing", text: "Bar 7: on cue" },
      { tag: "general", text: "Go over transition between 24D to 25" },
      { tag: "general", text: "Rehearse tempo of 24D bar 9" },
    ],
  },
  {
    num: "27C",
    id: "27C",
    title: "The Whos Return",
    items: [
      { tag: "general", text: "Direct segue into 28" },
    ],
  },
  {
    num: "28",
    id: "28",
    title: "The People Versus Horton the Elephant (Part 1)",
    items: [
      { tag: "general", text: "bar 54-55: as written (MORGAN)" },
    ]
  },
  {
    num: "28A",
    id: "28A",
    title: "The People Versus Horton the Elephant (Part 2)",
    items: []
  },
  {
    num: "28B",
    id: "28B",
    title: "The People Versus Horton the Elephant (Part 3)",
    items: []
  },
  {
    num: "28C",
    id: "28C",
    title: "The People Versus Horton the Elephant (Part 4)",
    items: [
      { tag: "repeat", text: "bar 11-12: play 6 times (MORGAN)" },
    ]
  }
];

const DEFAULT_BAND_REHEARSAL_NOTES: NoteGroup[] = [
  {
    num: "11",
    id: "11",
    title: "The One Feather Tail of Miss Gertrude McFuzz",
    items: [
      { tag: "general", text: "The one feather tail of Miss Gertrude McFuzz" },
    ],
  },
  {
    num: "12",
    id: "12",
    title: "Amayzing Mayzie (Part 1)",
    items: [
      { tag: "general", text: "Amayzing Mayzie — transitioning from song 11 bar 54" },
    ],
  },
];

const DEFAULT_DANIELE_NOTES: NoteGroup[] = [
  {
    num: "2",
    id: "02-03",
    title: "Our Story Begins…",
    items: [
      { tag: "general", text: "m.98 → m.99: practise transition" },
    ],
  },
  {
    num: "4B",
    id: "04-04c",
    title: "Biggest Blame Fool (Part 3)",
    items: [
      { tag: "general", text: "4B bar 43 → 4C bar 1: practise transition" },
    ],
  },
  {
    num: "9",
    id: "09",
    title: "The Military (Verse)",
    items: [
      { tag: "general", text: "9a, bar 12 → bar 13: practise tempo transition" },
    ],
  },
  {
    num: "16B",
    id: "16B",
    title: "Mayzie's Exit Music",
    items: [
      { tag: "general", text: "16B → Song 17: practise transition" },
    ],
  },
  {
    num: "17A",
    id: "17A",
    title: "Finale (Part 2: Horton's Dilemma / The Hunters)",
    items: [
      { tag: "general", text: "17a m.30/34: go over tempo, rehearse it" },
      { tag: "general", text: "17a bar 19: get comfortable bringing in" },
    ],
  },
  {
    num: "28",
    id: "28",
    title: "The People Versus Horton the Elephant (Part 1)",
    items: [
      { tag: "general", text: "Need to go over all tempos" },
      { tag: "general", text: "m.54: investigate 2x repeat" },
    ],
  },
  {
    num: "28A",
    id: "28A",
    title: "The People Versus Horton the Elephant (Part 2)",
    items: [
      { tag: "general", text: "Need to go over all tempos" },
    ],
  },
  {
    num: "28B",
    id: "28B",
    title: "The People Versus Horton the Elephant (Part 3)",
    items: [
      { tag: "general", text: "Need to go over all tempos" },
    ],
  },
  {
    num: "28C",
    id: "28C",
    title: "The People Versus Horton the Elephant (Part 4)",
    items: [
      { tag: "general", text: "Need to go over all tempos" },
    ],
  },
];

const DEFAULT_KB_CHECK: KBCheckItem[] = [
  { num: 1, title: "Oh, the Thinks You Can Think! (Intro)", checked: true },
  { num: "1A", title: "Oh, the Thinks You Can Think! (Part 1)", checked: true },
  { num: "1B", title: "Oh, the Thinks You Can Think! (Part 2)", checked: true },
  { num: "1C", title: "Oh, the Thinks You Can Think! (Part 3)", checked: false },
  { num: "1D", title: "Oh, the Thinks You Can Think! (Part 4)", checked: false },
  { num: 2, title: "Our Story Begins…", checked: false },
  { num: 3, title: "Horton Hears a Who!", checked: false },
  { num: 4, title: "Biggest Blame Fool", checked: false },
  { num: "4A", title: "Biggest Blame Fool (Part 2)", checked: false },
  { num: "4B", title: "Biggest Blame Fool (Part 3)", checked: false },
  { num: "4C", title: "Biggest Blame Fool (Part 4)", checked: false },
  { num: "4D", title: "Biggest Blame Playoff / Gertrude McFuzz", checked: false },
  { num: 5, title: "Here on Who (Part 1)", checked: false },
  { num: "5A", title: "Here on Who (Part 2: Dance)", checked: false },
  { num: "5B", title: "Here on Who (Part 3: The War)", checked: false },
  { num: "5C", title: "Here on Who (Part 4: The Lorax)", checked: false },
  { num: "5D", title: "Here on Who (Part 5)", checked: false },
  { num: "5E", title: "Meet JoJo the Who", checked: false },
  { num: 6, title: "Oh, the Thinks You Can Think! (Reprise)", checked: false },
  { num: 7, title: "It's Possible (Part 1)", checked: false },
  { num: "7A", title: "It's Possible (Part 2: Dance)", checked: false },
  { num: "7B", title: "It's Possible (Part 3)", checked: false },
  { num: 8, title: "How to Raise a Child", checked: false },
  { num: 9, title: "The Military (Verse)", checked: false },
  { num: "9A", title: "The Military (Genghis' Verse)", checked: false },
  { num: "9B", title: "The Military (Part 1)", checked: false },
  { num: "9C", title: "The Military (Part 2)", checked: false },
  { num: "9D", title: "The Military (Part 3)", checked: false },
  { num: "9E", title: "The Military (Playoff)", checked: false },
  { num: 10, title: "Alone in the Universe (Part 1)", checked: false },
  { num: "10A", title: "Alone in the Universe (Part 2)", checked: false },
  { num: "10B", title: "Alone in the Universe (Part 3)", checked: false },
  { num: 11, title: "The One Feather Tail of Miss Gertrude McFuzz", checked: false },
  { num: 12, title: "Amayzing Mayzie (Part 1)", checked: false },
  { num: "12A", title: "Amayzing Gertrude (Part 1)", checked: false },
  { num: "12B", title: "Amayzing Gertrude (Part 2)", checked: false },
  { num: 13, title: "Monkey Around", checked: false },
  { num: 14, title: "Chasing the Whos (Part 1)", checked: false },
  { num: "14A", title: "Chasing the Whos (Part 2)", checked: false },
  { num: "14B", title: "Chasing the Whos (Part 3)", checked: false },
  { num: "14C", title: "Chasing the Whos (Part 4)", checked: false },
  { num: 15, title: "How Lucky You Are", checked: false },
  { num: 16, title: "Notice Me, Horton", checked: false },
  { num: "16A", title: "How Lucky You Are (Reprise)", checked: false },
  { num: "16B", title: "Mayzie's Exit Music", checked: false },
  { num: 17, title: "Finale (Part 1: Horton Sits on the Egg)", checked: false },
  { num: "17A", title: "Finale (Part 2: Horton's Dilemma / The Hunters)", checked: false },
  { num: "17B", title: "Finale (Part 3: How Lucky You Are: Reprise)", checked: false },
  { num: 18, title: "Entr'acte", checked: false },
  { num: "18A", title: "Our Story Resumes... (Part 1)", checked: false },
  { num: "18B", title: "Our Story Resumes... (Part 2)", checked: false },
  { num: 19, title: "Egg, Nest & Tree", checked: false },
  { num: 20, title: "The Circus McGurkus (Part 1)", checked: false },
  { num: "20A", title: "The Circus McGurkus (Part 2)", checked: false },
  { num: "20B", title: "The Circus McGurkus (Part 3)", checked: false },
  { num: "20C", title: "The Circus on Tour / How Lucky You Are (Rep.)", checked: false },
  { num: 21, title: "Mayzie in Palm Beach", checked: false },
  { num: "21A", title: "Mayzie at the Circus", checked: false },
  { num: "21B", title: "Amayzing Horton (Part 2)", checked: false },
  { num: "21C", title: "Alone in the Universe (Reprise)", checked: false },
  { num: 22, title: "Solla Sollew", checked: false },
  { num: 23, title: "Green Eggs & Ham II", checked: false },
  { num: "23A", title: "Butter Battle", checked: false },
  { num: "23B", title: "Saving Private JoJo", checked: false },
  { num: 24, title: "Into the Who's Christmas Pageant", checked: false },
  { num: "24A", title: "The Grinch Carved the Roast Beast", checked: false },
  { num: "24B", title: "A Message from the Front / Solla Sollew (Reprise)", checked: false },
  { num: "24C", title: "How Sad", checked: false },
  { num: "24D", title: "A Re-enactment", checked: false },
  { num: 25, title: "JoJo Alone in the Universe", checked: false },
  { num: 26, title: "Havin' a Hunch", checked: false },
  { num: "26A", title: "Havin' a Hunch (Part 2: Nightmare Ballet)", checked: false },
  { num: "26B", title: "Havin' a Hunch (Part 3: Oh, the Thinks!)", checked: false },
  { num: "26C", title: "Havin' a Hunch (Part 4)", checked: false },
  { num: 27, title: "Gertrude / Espionage", checked: false },
  { num: "27A", title: "All for You (Verse)", checked: false },
  { num: "27B", title: "All for You", checked: false },
  { num: "27C", title: "The Whos Return", checked: false },
  { num: 28, title: "The People Versus Horton the Elephant (Part 1)", checked: false },
  { num: "28A", title: "The People Versus Horton the Elephant (Part 2)", checked: false },
  { num: "28B", title: "The People Versus Horton the Elephant (Part 3)", checked: false },
  { num: "28C", title: "The People Versus Horton the Elephant (Part 4)", checked: false },
  { num: "28D", title: "Yopp!/Alone in the Universe (Reprise)", checked: false },
  { num: 29, title: "Oh, The Thinks You Can Think! (Finale Act 2)", checked: false },
  { num: 30, title: "Green Eggs And Ham (Finale Bows: Swing)", checked: false },
  { num: 31, title: "Exit Music", checked: false },
];

const Index = () => {
  const { toast } = useToast();

  // ── STATE ──
  // Changed storage keys to v58 to force load the updated default lists
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem("seussical_songs_v58");
    return saved ? JSON.parse(saved) : DEFAULT_SONGS;
  });

  const [notes, setNotes] = useState<NoteGroup[]>(() => {
    const saved = localStorage.getItem("seussical_notes_v58");
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [bandRehearsal, setBandRehearsal] = useState<NoteGroup[]>(() => {
    const saved = localStorage.getItem("seussical_band_rehearsal_v1");
    return saved ? JSON.parse(saved) : DEFAULT_BAND_REHEARSAL_NOTES;
  });

  const [danieleNotes, setDanieleNotes] = useState<NoteGroup[]>(() => {
    const saved = localStorage.getItem("seussical_daniele_v1");
    return saved ? JSON.parse(saved) : DEFAULT_DANIELE_NOTES;
  });

  const [kbCheck, setKbCheck] = useState<KBCheckItem[]>(() => {
    const saved = localStorage.getItem("seussical_kbcheck_v1");
    return saved ? JSON.parse(saved) : DEFAULT_KB_CHECK;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "logged" | "pending">("all");
  const [activeTab, setActiveTab] = useState<"tempos" | "notes" | "band-rehearsal" | "daniele" | "kb-check" | "metronome" | "tap-tempo" | "performance">("performance");
  
  // Metronome State
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [flash, setFlash] = useState(false);

  // Tap Tempo State
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [tapBpm, setTapBpm] = useState<number | null>(null);

  // Editing State
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editBpmType, setEditBpmType] = useState<"none" | "single" | "sequential" | "sections">("none");
  const [editSingleBpm, setEditSingleBpm] = useState<string>("");
  const [editSeqBpm, setEditSeqBpm] = useState<string>("");
  const [editSections, setEditSections] = useState<Section[]>([]);
  const [editFeel, setEditFeel] = useState("");

  // New Song State
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [newSongNum, setNewSongNum] = useState("");
  const [newSongId, setNewSongId] = useState("");
  const [newSongTitle, setNewSongTitle] = useState("");

  // New Note State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteSongNum, setNewNoteSongNum] = useState("");
  const [newNoteSongId, setNewNoteSongId] = useState("");
  const [newNoteSongTitle, setNewNoteSongTitle] = useState("");
  const [newNoteTag, setNewNoteTag] = useState<NoteItem["tag"]>("general");
  const [newNoteText, setNewNoteText] = useState("");

  // Performance Mode State
  const [performanceIndex, setPerformanceIndex] = useState(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevPlayingRef = useRef(false);

  // Performance Entries (flattened)
  interface PerformanceEntry {
    songNum: string | number;
    songId: string;
    songTitle: string;
    sectionLabel: string;
    bpm: number | null;
    feel?: string;
    notes: NoteItem[];
  }

  const performanceEntries = useMemo<PerformanceEntry[]>(() => {
    const entries: PerformanceEntry[] = [];
    for (const song of songs) {
      const matchedNotes = notes.find((n) => n.id === song.id && String(n.num) === String(song.num));
      if (song.sections && song.sections.length > 0) {
        for (const sec of song.sections) {
          entries.push({
            songNum: song.num,
            songId: song.id,
            songTitle: song.title,
            sectionLabel: sec.label,
            bpm: sec.bpm,
            feel: song.feel,
            notes: matchedNotes?.items || [],
          });
        }
      } else if (song.bpm && song.bpm.length > 0) {
        if (song.bpm.length === 1) {
          entries.push({
            songNum: song.num,
            songId: song.id,
            songTitle: song.title,
            sectionLabel: "♩",
            bpm: song.bpm[0],
            feel: song.feel,
            notes: matchedNotes?.items || [],
          });
        } else {
          song.bpm.forEach((b, i) => {
            entries.push({
              songNum: song.num,
              songId: song.id,
              songTitle: song.title,
              sectionLabel: `T${i + 1}`,
              bpm: b,
              feel: song.feel,
              notes: matchedNotes?.items || [],
            });
          });
        }
      } else {
        entries.push({
          songNum: song.num,
          songId: song.id,
          songTitle: song.title,
          sectionLabel: "",
          bpm: null,
          feel: song.feel,
          notes: matchedNotes?.items || [],
        });
      }
    }
    return entries;
  }, [songs, notes]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("seussical_songs_v58", JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem("seussical_notes_v58", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("seussical_band_rehearsal_v1", JSON.stringify(bandRehearsal));
  }, [bandRehearsal]);

  useEffect(() => {
    localStorage.setItem("seussical_daniele_v1", JSON.stringify(danieleNotes));
  }, [danieleNotes]);

  useEffect(() => {
    localStorage.setItem("seussical_kbcheck_v1", JSON.stringify(kbCheck));
  }, [kbCheck]);

  // ── METRONOME ENGINE ──
  const playClick = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.error("Failed to play metronome click:", e);
    }
  };

  const metronomeBpmRef = useRef(metronomeBpm);
  metronomeBpmRef.current = metronomeBpm;

  useEffect(() => {
    const justStarted = isMetronomePlaying && !prevPlayingRef.current;
    prevPlayingRef.current = isMetronomePlaying;

    if (isMetronomePlaying) {
      if (justStarted) {
        playClick();
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }

      const tick = () => {
        playClick();
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      };

      let nextTickTime = performance.now() + (60 / metronomeBpmRef.current) * 1000;
      let animId: number;

      const schedule = () => {
        const now = performance.now();
        if (now >= nextTickTime) {
          tick();
          nextTickTime = now + (60 / metronomeBpmRef.current) * 1000;
        }
        animId = requestAnimationFrame(schedule);
      };
      animId = requestAnimationFrame(schedule);

      return () => {
        cancelAnimationFrame(animId);
      };
    } else {
      setFlash(false);
    }
  }, [isMetronomePlaying, isMuted]);

  // ── TAP TEMPO ENGINE ──
  const handleTap = () => {
    const now = Date.now();
    const newTimes = [...tapTimes, now].slice(-5); // Keep last 5 taps
    setTapTimes(newTimes);

    if (newTimes.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setTapBpm(calculatedBpm);
      setMetronomeBpm(calculatedBpm);
    }
  };

  const resetTap = () => {
    setTapTimes([]);
    setTapBpm(null);
  };

  // Keyboard listener for Tap Tempo (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === "tap-tempo" && e.code === "Space") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, tapTimes]);

  useEffect(() => {
    if (activeTab !== "performance") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        setIsMetronomePlaying(false);
        setActiveTab("tempos");
      } else if (e.code === "ArrowUp" || e.code === "ArrowLeft") {
        e.preventDefault();
        setPerformanceIndex((prev) => Math.max(0, prev - 1));
      } else if (e.code === "ArrowDown" || e.code === "ArrowRight") {
        e.preventDefault();
        setPerformanceIndex((prev) => Math.min(performanceEntries.length - 1, prev + 1));
      } else if (e.code === "Space") {
        e.preventDefault();
        const currentEntry = performanceEntries[performanceIndex];
        if (currentEntry?.bpm) {
          if (isMetronomePlaying) {
            setIsMetronomePlaying(false);
          } else {
            setMetronomeBpm(currentEntry.bpm);
            setIsMetronomePlaying(true);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, performanceIndex, performanceEntries.length, isMetronomePlaying]);

  useEffect(() => {
    if (isMetronomePlaying && activeTab === "performance") {
      const currentEntry = performanceEntries[performanceIndex];
      if (currentEntry?.bpm) {
        setMetronomeBpm(currentEntry.bpm);
      }
    }
  }, [performanceIndex]);

  // ── HELPERS ──
  const isLogged = (s: Song) => {
    return !!(s.bpm || s.sections);
  };

  // ── FILTERED SONGS ──
  const filteredSongs = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.num.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const loggedStatus = isLogged(s);
    if (filter === "logged") return matchesSearch && loggedStatus;
    if (filter === "pending") return matchesSearch && !loggedStatus;
    return matchesSearch;
  });

  // Stats
  const totalCount = filteredSongs.length;
  const loggedCount = filteredSongs.filter(isLogged).length;
  const pendingCount = totalCount - loggedCount;
  const overallLogged = songs.filter(isLogged).length;
  const overallTotal = songs.length;
  const completionPct = overallTotal ? Math.round((overallLogged / overallTotal) * 100) : 0;

  // ── EDIT SONG HANDLERS ──
  const startEditSong = (song: Song) => {
    setEditingSong(song);
    setEditFeel(song.feel || "");
    if (song.sections) {
      setEditBpmType("sections");
      setEditSections(song.sections);
      setEditSingleBpm("");
      setEditSeqBpm("");
    } else if (song.bpm) {
      if (song.bpm.length === 1) {
        setEditBpmType("single");
        setEditSingleBpm(song.bpm[0].toString());
        setEditSeqBpm("");
      } else {
        setEditBpmType("sequential");
        setEditSeqBpm(song.bpm.join(", "));
        setEditSingleBpm("");
      }
      setEditSections([]);
    } else {
      setEditBpmType("none");
      setEditSingleBpm("");
      setEditSeqBpm("");
      setEditSections([]);
    }
  };

  const saveSongEdit = () => {
    if (!editingSong) return;

    const updatedSongs = songs.map((s) => {
      if (s.num === editingSong.num && s.id === editingSong.id && s.title === editingSong.title) {
        const updated: Song = { ...s, feel: editFeel || undefined };
        
        if (editBpmType === "none") {
          delete updated.bpm;
          delete updated.sections;
        } else if (editBpmType === "single") {
          const val = parseInt(editSingleBpm);
          if (!isNaN(val)) {
            updated.bpm = [val];
            delete updated.sections;
          }
        } else if (editBpmType === "sequential") {
          const vals = editSeqBpm
            .split(",")
            .map((v) => parseInt(v.trim()))
            .filter((v) => !isNaN(v));
          if (vals.length > 0) {
            updated.bpm = vals;
            delete updated.sections;
          }
        } else if (editBpmType === "sections") {
          if (editSections.length > 0) {
            updated.sections = editSections;
            delete updated.bpm;
          }
        }
        return updated;
      }
      return s;
    });

    setSongs(updatedSongs);
    setEditingSong(null);
    toast({
      title: "Song Updated",
      description: `Successfully updated tempos for "${editingSong.title}"`,
    });
  };

  const addSectionRow = () => {
    setEditSections([...editSections, { label: "m.1", bpm: 120 }]);
  };

  const removeSectionRow = (index: number) => {
    setEditSections(editSections.filter((_, i) => i !== index));
  };

  const updateSectionRow = (index: number, field: keyof Section, value: string | number) => {
    const updated = editSections.map((sec, i) => {
      if (i === index) {
        return { ...sec, [field]: field === "bpm" ? parseInt(value as string) || 0 : value };
      }
      return sec;
    });
    setEditSections(updated);
  };

  // ── ADD NEW SONG ──
  const handleAddSong = () => {
    if (!newSongNum || !newSongId || !newSongTitle) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields to add a new song.",
        variant: "destructive",
      });
      return;
    }

    const newSong: Song = {
      num: newSongNum,
      id: newSongId,
      title: newSongTitle,
    };

    setSongs([...songs, newSong]);
    setNewSongNum("");
    setNewSongId("");
    setNewSongTitle("");
    setIsAddingSong(false);
    toast({
      title: "Song Added",
      description: `"${newSongTitle}" has been added to the tracklist.`,
    });
  };

  const handleDeleteSong = (songToDelete: Song) => {
    if (confirm(`Are you sure you want to delete "${songToDelete.title}"?`)) {
      setSongs(songs.filter((s) => s !== songToDelete));
      toast({
        title: "Song Deleted",
        description: `"${songToDelete.title}" was removed.`,
      });
    }
  };

  // ── ADD NEW NOTE ──
  const handleAddNote = () => {
    if (!newNoteSongNum || !newNoteText) {
      toast({
        title: "Missing Fields",
        description: "Please provide a song number and note text.",
        variant: "destructive",
      });
      return;
    }

    const noteItem: NoteItem = {
      tag: newNoteTag,
      text: newNoteText,
    };

    // Check if group already exists
    const existingGroupIndex = notes.findIndex((n) => n.num === newNoteSongNum);

    if (existingGroupIndex > -1) {
      const updatedNotes = [...notes];
      updatedNotes[existingGroupIndex].items.push(noteItem);
      setNotes(updatedNotes);
    } else {
      const newGroup: NoteGroup = {
        num: newNoteSongNum,
        id: newNoteSongId || "TBC",
        title: newNoteSongTitle || "Custom Song",
        items: [noteItem],
      };
      setNotes([...notes, newGroup]);
    }

    setNewNoteText("");
    setIsAddingNote(false);
    toast({
      title: "Note Added",
      description: "Successfully added note to the list.",
    });
  };

  const handleDeleteNote = (groupIndex: number, itemIndex: number) => {
    const updatedNotes = [...notes];
    updatedNotes[groupIndex].items.splice(itemIndex, 1);
    
    // If group is empty, remove the group
    if (updatedNotes[groupIndex].items.length === 0) {
      updatedNotes.splice(groupIndex, 1);
    }
    
    setNotes(updatedNotes);
    toast({
      title: "Note Deleted",
      description: "Note removed successfully.",
    });
  };

  // ── RESET TO DEFAULT ──
  const resetToDefault = () => {
    if (confirm("Are you sure you want to reset all data to Carey Grammar 2026 defaults? This will overwrite your local changes.")) {
      setSongs(DEFAULT_SONGS);
      setNotes(DEFAULT_NOTES);
      localStorage.removeItem("seussical_songs_v58");
      localStorage.removeItem("seussical_notes_v58");
      toast({
        title: "Data Reset",
        description: "Restored Carey Grammar 2026 defaults.",
      });
    }
  };

  // ── EXPORT / IMPORT ──
  const exportData = () => {
    const dataStr = JSON.stringify({ songs, notes }, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `seussical_tempos_backup_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.songs && parsed.notes) {
            setSongs(parsed.songs);
            setNotes(parsed.notes);
            toast({
              title: "Import Successful",
              description: "Successfully loaded songs and notes from backup.",
            });
          } else {
            throw new Error("Invalid file format");
          }
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Could not parse backup file. Make sure it is a valid JSON backup.",
            variant: "destructive",
          });
        }
      };
    }
  };

  // ── KB CHECK HANDLER ──
  const toggleKBCheck = (idx: number) => {
    setKbCheck(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  // ── PRINT HANDLER ──
  const handlePrint = () => {
    window.print();
  };

  // ── RENDER BPM CELL ──
  // Jump straight into Performance mode at a specific song + metronome mark
  const startPerformanceAt = (song: Song, sectionLabel: string) => {
    const idx = performanceEntries.findIndex(
      (e) =>
        String(e.songId) === String(song.id) &&
        String(e.songNum) === String(song.num) &&
        e.sectionLabel === sectionLabel
    );
    if (idx < 0) return;
    setIsMetronomePlaying(false);
    setPerformanceIndex(idx);
    setActiveTab("performance");
  };

  const renderBpmCell = (s: Song) => {
    if (s.sections) {
      const vals = s.sections.map((x) => x.bpm);
      const mn = Math.min(...vals);
      const mx = Math.max(...vals);
      const range = mx - mn || 1;

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-1">
            {s.sections.map((sec, idx) => {
              const pct = ((sec.bpm - mn) / range) * 60 + 30;
              return (
                <div key={idx} className="flex items-center gap-2 group/sec">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startPerformanceAt(s, sec.label);
                    }}
                    title={`Start performance from ${sec.label}`}
                    className="font-mono text-[10px] text-[#7a7a94] w-16 shrink-0 tracking-wider text-left flex items-center gap-1 hover:text-[#e8c547] transition-colors cursor-pointer group/lbl"
                  >
                    <Play className="w-2.5 h-2.5 shrink-0 fill-current opacity-40 md:opacity-0 md:group-hover/lbl:opacity-100 transition-opacity" />
                    {sec.label}
                  </button>
                  <div className="flex-1 h-1 bg-[#2a2a38] rounded overflow-hidden max-w-[80px]">
                    <div
                      className="h-full rounded bg-[#e8c547] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMetronomeBpm(sec.bpm);
                      setIsMetronomePlaying(true);
                      toast({
                        title: "Metronome Set",
                        description: `Playing ${sec.bpm} BPM (${sec.label})`,
                      });
                    }}
                    className="font-serif text-base font-bold text-[#e8c547] hover:underline text-right w-10 shrink-0 cursor-pointer"
                  >
                    {sec.bpm}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (!s.bpm) {
      return <span className="font-mono text-sm text-[#2a2a38]">—</span>;
    }

    if (s.bpm.length === 1) {
      const bpmVal = s.bpm[0];
      return (
        <div className="flex items-center gap-2 group/lbl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startPerformanceAt(s, "♩");
            }}
            title="Start performance here"
            className="text-[#7a7a94] hover:text-[#e8c547] transition-colors cursor-pointer shrink-0"
          >
            <Play className="w-3 h-3 fill-current opacity-40 md:opacity-0 md:group-hover/lbl:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMetronomeBpm(bpmVal);
              setIsMetronomePlaying(true);
              toast({
                title: "Metronome Set",
                description: `Playing ${bpmVal} BPM`,
              });
            }}
            className="font-serif text-2xl font-bold text-[#e8c547] hover:underline cursor-pointer"
          >
            {bpmVal}
          </button>
        </div>
      );
    }

    // Sequential multi-tempo
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {s.bpm.map((b, i) => {
          const color = ["#e8c547", "#7eb8f7", "#f07a5a", "#5ecb8a", "#c084fc"][i % 5];
          return (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-[#2a2a38] text-xs">›</span>}
              <span
                className="inline-flex items-center gap-1 rounded-full border border-opacity-30 bg-opacity-10 px-2 py-0.5 group/lbl"
                style={{ color, borderColor: color, backgroundColor: color + "11" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startPerformanceAt(s, `T${i + 1}`);
                  }}
                  title={`Start performance from T${i + 1}`}
                  className="cursor-pointer shrink-0 hover:opacity-100"
                >
                  <Play className="w-2.5 h-2.5 fill-current opacity-40 md:opacity-0 md:group-hover/lbl:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMetronomeBpm(b);
                    setIsMetronomePlaying(true);
                    toast({
                      title: "Metronome Set",
                      description: `Playing T${i + 1} (${b} BPM)`,
                    });
                  }}
                  className="font-mono text-[11px] font-medium hover:underline cursor-pointer"
                >
                  T{i + 1} {b}
                </button>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#e8e8f0] font-sans relative overflow-x-hidden selection:bg-[#e8c547] selection:text-[#0e0e12]">
      {activeTab === "performance" ? (
        (() => {
          const entry = performanceEntries[performanceIndex] || performanceEntries[0];
          if (!entry) return null;
          const totalEntries = performanceEntries.length;
          const currentIndex = Math.max(0, Math.min(performanceIndex, totalEntries - 1));
          const currentEntry = performanceEntries[currentIndex];

          const goUp = () => {
            setPerformanceIndex(Math.max(0, currentIndex - 1));
          };
          const goDown = () => {
            setPerformanceIndex(Math.min(totalEntries - 1, currentIndex + 1));
          };
          const togglePlay = () => {
            if (isMetronomePlaying) {
              setIsMetronomePlaying(false);
            } else {
              if (currentEntry.bpm) {
                setMetronomeBpm(currentEntry.bpm);
                setIsMetronomePlaying(true);
              }
            }
          };

          const tagColors: Record<string, { bg: string; text: string; border: string }> = {
            repeat: { bg: "rgba(126,184,247,0.1)", text: "#7eb8f7", border: "rgba(126,184,247,0.3)" },
            cut: { bg: "rgba(240,122,90,0.1)", text: "#f07a5a", border: "rgba(240,122,90,0.3)" },
            timing: { bg: "rgba(232,197,71,0.1)", text: "#e8c547", border: "rgba(232,197,71,0.3)" },
            dynamics: { bg: "rgba(94,203,138,0.1)", text: "#5ecb8a", border: "rgba(94,203,138,0.3)" },
            general: { bg: "rgba(122,122,148,0.1)", text: "#7a7a94", border: "rgba(122,122,148,0.3)" },
          };

          return (
            <div
              className="fixed inset-0 bg-[#0e0e12] z-50 flex flex-col landscape:flex-row select-none"
              style={{
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingLeft: "env(safe-area-inset-left)",
                paddingRight: "env(safe-area-inset-right)",
              }}
            >
              <button
                onClick={() => { setIsMetronomePlaying(false); setActiveTab("tempos"); }}
                style={{
                  top: "max(0.75rem, env(safe-area-inset-top))",
                  right: "max(0.75rem, env(safe-area-inset-right))",
                }}
                className="absolute z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#16161c] border border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0] hover:bg-[#1e1e27] active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={goUp}
                disabled={currentIndex === 0}
                className="flex-1 landscape:flex-none landscape:w-24 flex items-center justify-center bg-[#0e0e12] hover:bg-[#1a1a24] active:bg-[#22222e] transition-colors disabled:opacity-20 disabled:cursor-not-allowed border-r-0 landscape:border-r border-[#2a2a38]"
              >
                <div className="flex flex-col items-center gap-2">
                  <ChevronUp className="w-12 h-12 text-[#7a7a94]" />
                  <span className="font-mono text-[10px] text-[#7a7a94] uppercase tracking-widest">Up</span>
                </div>
              </button>

              <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 landscape:py-4 gap-2 landscape:gap-[2vh] min-h-0 overflow-hidden">
                <h2 className="font-serif text-3xl landscape:text-[9vh] font-black text-[#e8e8f0] text-center leading-tight whitespace-nowrap truncate max-w-full">
                  {currentEntry.songNum} · {currentEntry.songTitle}
                </h2>

                {currentEntry.sectionLabel && (
                  <p className="font-mono text-lg landscape:text-[4vh] text-[#e8c547] tracking-wider whitespace-nowrap">
                    {currentEntry.sectionLabel}
                  </p>
                )}

                {currentEntry.bpm ? (
                  <div className="text-center flex items-baseline justify-center opacity-80">
                    <span className="font-serif text-5xl landscape:text-[7vh] font-bold text-[#e8c547] leading-none">
                      {currentEntry.bpm}
                    </span>
                    <span className="font-mono text-sm landscape:text-[2.4vh] text-[#7a7a94] ml-1.5">BPM</span>
                  </div>
                ) : (
                  <span className="font-serif text-3xl landscape:text-[6vh] text-[#2a2a38] font-black italic">Pending</span>
                )}

                {currentEntry.feel && (
                  <p className="font-mono text-xs landscape:text-[2.4vh] text-[#e8c547]/70 tracking-wider whitespace-nowrap">
                    {currentEntry.feel}
                  </p>
                )}

                {currentEntry.notes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-w-lg justify-center mt-1">
                    {currentEntry.notes.map((note, idx) => {
                      const colors = tagColors[note.tag] || tagColors.general;
                      return (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] leading-none whitespace-nowrap" style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                          <span className="font-mono font-bold uppercase tracking-wider text-[9px]">{note.tag}</span>
                          <span>
                            {note.text.split("(MORGAN)").map((part, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && (
                                  <span className="inline-flex items-center px-1 py-0 rounded-full text-[9px] font-mono font-bold bg-[#f07a5a]/20 text-[#f07a5a] border border-[#f07a5a]/30 mx-0.5 align-middle">
                                    M
                                  </span>
                                )}
                                {part}
                              </React.Fragment>
                            ))}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {currentEntry.bpm && (
                  <button
                    onClick={togglePlay}
                    className={`mt-2 w-24 h-24 landscape:w-[18vh] landscape:h-[18vh] rounded-full flex items-center justify-center transition-all shadow-lg shadow-[#e8c547]/10 ${
                      isMetronomePlaying && metronomeBpm === currentEntry.bpm
                        ? "bg-[#e8c547] text-[#0e0e12] hover:bg-[#d4b33b] active:scale-95"
                        : "bg-[#16161c] border-[3px] border-[#e8c547] text-[#e8c547] hover:bg-[#e8c547]/10 active:scale-95"
                    }`}
                  >
                    {isMetronomePlaying && metronomeBpm === currentEntry.bpm ? (
                      <Pause className="w-10 h-10 landscape:w-[8vh] landscape:h-[8vh]" />
                    ) : (
                      <Play className="w-10 h-10 ml-1 landscape:w-[8vh] landscape:h-[8vh]" />
                    )}
                  </button>
                )}

                {currentIndex < totalEntries - 1 && (() => {
                  const next = performanceEntries[currentIndex + 1];
                  return (
                    <div className="flex items-center gap-2 mt-1 px-3 py-1.5 landscape:px-4 landscape:py-2 rounded-lg bg-[#16161c] border border-[#2a2a38]">
                      <span className="font-mono text-[10px] landscape:text-[1.8vh] font-bold uppercase tracking-widest text-[#7a7a94]">Next</span>
                      <span className="font-mono text-[11px] landscape:text-[2vh] text-[#e8e8f0] whitespace-nowrap">
                        {next.songNum} · {next.songTitle}{next.sectionLabel ? ` · ${next.sectionLabel}` : ""}{next.bpm ? ` · ${next.bpm}` : " · Pending"}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <button
                onClick={goDown}
                disabled={currentIndex === totalEntries - 1}
                className="flex-1 landscape:flex-none landscape:w-24 flex items-center justify-center bg-[#0e0e12] hover:bg-[#1a1a24] active:bg-[#22222e] transition-colors disabled:opacity-20 disabled:cursor-not-allowed border-t landscape:border-t-0 border-l-0 landscape:border-l border-[#2a2a38]"
              >
                <div className="flex flex-col items-center gap-2">
                  <ChevronDown className="w-12 h-12 text-[#7a7a94]" />
                  <span className="font-mono text-[10px] text-[#7a7a94] uppercase tracking-widest">Down</span>
                </div>
              </button>
            </div>
          );
        })()
      ) : (
      <>
        {/* ── HEADER ── */}
        <header className="mb-10 border-b border-[#2a2a38] pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#e8c547] mb-2">
              Carey Grammar · 2026
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight leading-none mb-3">
              Seussical <span className="text-[#e8c547]">Tempos</span>
            </h1>
            <p className="text-xs md:text-sm text-[#7a7a94] font-mono tracking-wide">
              MD Reference · Daniele Buatti · Updated: {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-[#16161c] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0] hover:bg-[#1e1e27] rounded-lg text-xs font-mono"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="bg-[#16161c] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0] hover:bg-[#1e1e27] rounded-lg text-xs font-mono"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Backup
            </Button>
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center h-9 px-3 text-xs font-mono rounded-lg border border-[#2a2a38] bg-[#16161c] text-[#7a7a94] hover:text-[#e8e8f0] hover:bg-[#1e1e27] transition-colors">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Restore
              </span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="bg-[#16161c] border-[#2a2a38] text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg text-xs font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
        </header>

        {/* ── PROGRESS BAR ── */}
        <div className="mb-8 bg-[#16161c] border border-[#2a2a38] rounded-xl p-4 print:hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs text-[#7a7a94]">Overall Progress</span>
            <span className="font-mono text-xs text-[#e8c547] font-bold">{completionPct}% Complete</span>
          </div>
          <Progress value={completionPct} className="h-2 bg-[#2a2a38]" />
          <p className="font-mono text-[11px] text-[#7a7a94] mt-2">
            {overallLogged} of {overallTotal} tracks logged with tempo details
          </p>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 border-b border-[#2a2a38] mb-8 print:hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1">
          <button
            onClick={() => setActiveTab("tempos")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "tempos"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <Music className="w-3.5 h-3.5 inline mr-1.5" />
            Tempos
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "notes"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1.5" />
            Notes
          </button>
          <button
            onClick={() => setActiveTab("band-rehearsal")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "band-rehearsal"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <Mic className="w-3.5 h-3.5 inline mr-1.5" />
            Band Rehearsal
          </button>
          <button
            onClick={() => setActiveTab("daniele")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "daniele"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <User className="w-3.5 h-3.5 inline mr-1.5" />
            Daniele
          </button>
          <button
            onClick={() => setActiveTab("kb-check")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "kb-check"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 inline mr-1.5" />
            KB Check
          </button>
          <button
            onClick={() => setActiveTab("metronome")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "metronome"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <Clock className="w-3.5 h-3.5 inline mr-1.5" />
            Metronome
          </button>
          <button
            onClick={() => setActiveTab("tap-tempo")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === "tap-tempo"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
            Tap Tempo
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all shrink-0 whitespace-nowrap ${
              (activeTab as string) === "performance"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1.5" />
            Performance
          </button>
        </div>

        {/* ── TAB CONTENT: TEMPOS ── */}
        {activeTab === "tempos" && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center justify-between print:hidden">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a94]" />
                <Input
                  type="text"
                  placeholder="Search song, track ID, or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#16161c] border-[#2a2a38] text-[#e8e8f0] placeholder-[#7a7a94] focus-visible:ring-[#e8c547] rounded-lg"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className={`rounded-lg text-xs font-mono uppercase tracking-wider h-9 ${
                    filter === "all"
                      ? "bg-[#e8c547] text-[#0e0e12] hover:bg-[#d4b33b]"
                      : "bg-[#16161c] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                  }`}
                >
                  All
                </Button>
                <Button
                  variant={filter === "logged" ? "default" : "outline"}
                  onClick={() => setFilter("logged")}
                  className={`rounded-lg text-xs font-mono uppercase tracking-wider h-9 ${
                    filter === "logged"
                      ? "bg-[#e8c547] text-[#0e0e12] hover:bg-[#d4b33b]"
                      : "bg-[#16161c] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                  }`}
                >
                  Logged
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  onClick={() => setFilter("pending")}
                  className={`rounded-lg text-xs font-mono uppercase tracking-wider h-9 ${
                    filter === "pending"
                      ? "bg-[#e8c547] text-[#0e0e12] hover:bg-[#d4b33b]"
                      : "bg-[#16161c] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                  }`}
                >
                  Pending
                </Button>

                <Button
                  onClick={() => setIsAddingSong(true)}
                  className="bg-[#7eb8f7] text-[#0e0e12] hover:bg-[#6aa4e3] rounded-lg text-xs font-mono uppercase tracking-wider h-9 ml-2"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Song
                </Button>
              </div>
            </div>

            {/* Add Song Form */}
            {isAddingSong && (
              <div className="mb-6 bg-[#16161c] border border-[#7eb8f7]/30 rounded-xl p-5 relative print:hidden">
                <h3 className="font-serif text-lg font-bold text-[#7eb8f7] mb-4">Add New Song</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Song # (e.g. 1A, 5)</label>
                    <Input
                      value={newSongNum}
                      onChange={(e) => setNewSongNum(e.target.value)}
                      placeholder="e.g. 1A"
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Track ID (e.g. 01-01D)</label>
                    <Input
                      value={newSongId}
                      onChange={(e) => setNewSongId(e.target.value)}
                      placeholder="e.g. 01-01D"
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Song Title</label>
                    <Input
                      value={newSongTitle}
                      onChange={(e) => setNewSongTitle(e.target.value)}
                      placeholder="e.g. Oh, The Thinks You Can Think!"
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingSong(false)}
                    className="border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSong}
                    className="bg-[#7eb8f7] text-[#0e0e12] hover:bg-[#6aa4e3]"
                  >
                    Add Song
                  </Button>
                </div>
              </div>
            )}

            {/* Song Editor Form */}
            {editingSong && (
              <div className="mb-6 bg-[#1e1e27] border border-[#e8c547]/40 rounded-xl p-5 relative print:hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-xs text-[#e8c547] bg-[#e8c547]/10 px-2 py-0.5 rounded mr-2">
                      Track {editingSong.id}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#e8e8f0] inline-block">
                      Edit Tempos: {editingSong.title}
                    </h3>
                  </div>
                  <button onClick={() => setEditingSong(null)} className="text-[#7a7a94] hover:text-[#e8e8f0]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* BPM Type Selector */}
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1.5">Tempo Type</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "none", label: "Pending / None" },
                        { id: "single", label: "Single BPM" },
                        { id: "sequential", label: "Sequential (T1 → T2)" },
                        { id: "sections", label: "Labelled Sections" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setEditBpmType(t.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                            editBpmType === t.id
                              ? "bg-[#e8c547] text-[#0e0e12] border-[#e8c547]"
                              : "bg-[#16161c] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Single BPM Input */}
                  {editBpmType === "single" && (
                    <div>
                      <label className="block text-xs font-mono text-[#7a7a94] mb-1">BPM Value</label>
                      <Input
                        type="number"
                        value={editSingleBpm}
                        onChange={(e) => setEditSingleBpm(e.target.value)}
                        placeholder="e.g. 145"
                        className="bg-[#16161c] border-[#2a2a38] text-[#e8e8f0] max-w-[150px]"
                      />
                    </div>
                  )}

                  {/* Sequential BPM Input */}
                  {editBpmType === "sequential" && (
                    <div>
                      <label className="block text-xs font-mono text-[#7a7a94] mb-1">
                        BPM Values (comma separated)
                      </label>
                      <Input
                        type="text"
                        value={editSeqBpm}
                        onChange={(e) => setEditSeqBpm(e.target.value)}
                        placeholder="e.g. 159, 163, 125"
                        className="bg-[#16161c] border-[#2a2a38] text-[#e8e8f0] max-w-md"
                      />
                    </div>
                  )}

                  {/* Labelled Sections Input */}
                  {editBpmType === "sections" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-[#7a7a94]">Sections & Tempos</label>
                      {editSections.map((sec, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={sec.label}
                            onChange={(e) => updateSectionRow(idx, "label", e.target.value)}
                            placeholder="Label (e.g. m.17)"
                            className="bg-[#16161c] border-[#2a2a38] text-[#e8e8f0] max-w-[150px]"
                          />
                          <Input
                            type="number"
                            value={sec.bpm || ""}
                            onChange={(e) => updateSectionRow(idx, "bpm", e.target.value)}
                            placeholder="BPM"
                            className="bg-[#16161c] border-[#2a2a38] text-[#e8e8f0] max-w-[100px]"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeSectionRow(idx)}
                            className="border-[#2a2a38] text-red-400 hover:text-red-300 hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSectionRow}
                        className="border-[#2a2a38] text-[#7eb8f7] hover:bg-[#7eb8f7]/10"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
                      </Button>
                    </div>
                  )}

                  {/* Feel / Style Input */}
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Feel / Style Notes</label>
                    <Input
                      type="text"
                      value={editFeel}
                      onChange={(e) => setEditFeel(e.target.value)}
                      placeholder="e.g. 12/8 (♩.=♩ triplet)"
                      className="bg-[#16161c] border-[#2a2a38] text-[#e8e8f0] max-w-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingSong(null)}
                    className="border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveSongEdit}
                    className="bg-[#e8c547] text-[#0e0e12] hover:bg-[#d4b33b]"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Table Wrap */}
            <div className="border border-[#2a2a38] rounded-xl overflow-hidden bg-[#16161c]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#1e1e27] border-b-2 border-[#2a2a38]">
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4 w-16 text-center">
                        #
                      </th>
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4">
                        Song Title
                      </th>
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4 w-64">
                        BPM
                      </th>
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4 w-52 hidden md:table-cell">
                        Feel / Style
                      </th>
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4 w-24 text-right print:hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a38]">
                    {filteredSongs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#7a7a94] font-mono text-sm">
                          No songs found matching your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredSongs.map((s, idx) => {
                        const logged = isLogged(s);
                        return (
                          <tr
                            key={`${s.num}-${s.id}-${idx}`}
                            className="hover:bg-[#1e1e27]/50 transition-colors group"
                          >
                            <td className="p-4 text-center font-mono text-xs text-[#7a7a94]">
                              <div className="flex items-center justify-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    logged ? "bg-[#5ecb8a]" : "bg-[#2a2a38] border border-[#7a7a94]"
                                  }`}
                                />
                                {s.num}
                              </div>
                            </td>
                            <td className="p-4 font-medium text-[#e8e8f0]">
                              {s.title}
                            </td>
                            <td className="p-4">
                              {renderBpmCell(s)}
                            </td>
                            <td className="p-4 text-xs text-[#7a7a94] italic hidden md:table-cell">
                              {s.feel || ""}
                            </td>
                            <td className="p-4 text-right print:hidden">
                              <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditSong(s)}
                                  className="w-8 h-8 text-[#7a7a94] hover:text-[#e8c547] hover:bg-[#2a2a38]"
                                  title="Edit Tempos"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSong(s)}
                                  className="w-8 h-8 text-[#7a7a94] hover:text-red-400 hover:bg-red-950/20"
                                  title="Delete Song"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-3 gap-4 mt-8 border-t border-[#2a2a38] pt-6">
              <div className="text-center md:text-left">
                <span className="font-serif text-2xl md:text-4xl font-bold text-[#e8c547] block">
                  {totalCount}
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#7a7a94]">
                  Tracks Shown
                </span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-serif text-2xl md:text-4xl font-bold text-[#5ecb8a] block">
                  {loggedCount}
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#7a7a94]">
                  BPM Logged
                </span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-serif text-2xl md:text-4xl font-bold text-[#7a7a94] block">
                  {pendingCount}
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#7a7a94]">
                  Pending
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: NOTES ── */}
        {activeTab === "notes" && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="font-serif text-xl font-bold text-[#e8e8f0]">Performance Notes</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="border-[#7a7a94] text-[#7a7a94] hover:text-[#e8e8f0] hover:border-[#e8e8f0] rounded-lg text-xs font-mono uppercase tracking-wider h-9"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print
                </Button>
                <Button
                  onClick={() => setIsAddingNote(true)}
                  className="bg-[#7eb8f7] text-[#0e0e12] hover:bg-[#6aa4e3] rounded-lg text-xs font-mono uppercase tracking-wider h-9"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Note
                </Button>
              </div>
            </div>

            {/* Add Note Form */}
            {isAddingNote && (
              <div className="mb-6 bg-[#16161c] border border-[#7eb8f7]/30 rounded-xl p-5 relative print:hidden">
                <h3 className="font-serif text-lg font-bold text-[#7eb8f7] mb-4">Add Performance Note</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Song # (e.g. 1A, 5)</label>
                    <Input
                      value={newNoteSongNum}
                      onChange={(e) => {
                        setNewNoteSongNum(e.target.value);
                        // Auto-fill title and ID if song exists
                        const matched = songs.find((s) => s.num.toString() === e.target.value);
                        if (matched) {
                          setNewNoteSongId(matched.id);
                          setNewNoteSongTitle(matched.title);
                        }
                      }}
                      placeholder="e.g. 1A"
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Track ID (Auto-filled)</label>
                    <Input
                      value={newNoteSongId}
                      onChange={(e) => setNewNoteSongId(e.target.value)}
                      placeholder="e.g. 01-01D"
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Song Title (Auto-filled)</label>
                    <Input
                      value={newNoteSongTitle}
                      onChange={(e) => setNewNoteSongTitle(e.target.value)}
                      placeholder="e.g. Oh, The Thinks You Can Think!"
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Tag Type</label>
                    <select
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-md border border-[#2a2a38] bg-[#0e0e12] text-[#e8e8f0] text-sm focus:outline-none focus:ring-1 focus:ring-[#e8c547]"
                    >
                      <option value="general">General</option>
                      <option value="repeat">Repeat</option>
                      <option value="cut">Cut</option>
                      <option value="timing">Timing</option>
                      <option value="dynamics">Dynamics</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#7a7a94] mb-1">Note Text</label>
                    <Input
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="e.g. Measures 17–18 are played TWO times only."
                      className="bg-[#0e0e12] border-[#2a2a38] text-[#e8e8f0]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingNote(false)}
                    className="border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddNote}
                    className="bg-[#7eb8f7] text-[#0e0e12] hover:bg-[#6aa4e3]"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-6 print-notes-target">
              <h2 className="hidden print:block font-sans text-2xl font-bold text-black mb-4">Seussical — Performance Notes</h2>
              {notes.map((group, groupIdx) => (
                <div
                  key={`${group.num}-${groupIdx}`}
                  className="bg-[#16161c] border border-[#2a2a38] rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a38] bg-[#1e1e27]">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-2xl font-bold text-[#e8c547]">
                        {group.num}
                      </span>
                      <div>
                        <span className="font-mono text-[10px] text-[#7eb8f7] bg-[#7eb8f7]/10 px-2 py-0.5 rounded mr-2">
                          {group.id}
                        </span>
                        <span className="text-sm font-medium text-[#e8e8f0]">
                          {group.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="p-5 space-y-3">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start justify-between gap-4 group/note">
                        <div className="flex gap-3 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e8c547] shrink-0 mt-2" />
                          <Badge
                            variant="outline"
                            className="font-mono text-[9px] uppercase tracking-wider shrink-0 mt-0.5"
                            style={{
                              color:
                                item.tag === "timing"
                                  ? "#7eb8f7"
                                  : item.tag === "repeat"
                                  ? "#e8c547"
                                  : item.tag === "cut"
                                  ? "#f07a5a"
                                  : item.tag === "dynamics"
                                  ? "#5ecb8a"
                                  : "#7a7a94",
                              borderColor:
                                item.tag === "timing"
                                  ? "rgba(126,184,247,0.3)"
                                  : item.tag === "repeat"
                                  ? "rgba(232,197,71,0.3)"
                                  : item.tag === "cut"
                                  ? "rgba(240,122,90,0.3)"
                                  : item.tag === "dynamics"
                                  ? "rgba(94,203,138,0.3)"
                                  : "rgba(122,122,148,0.3)",
                              backgroundColor:
                                item.tag === "timing"
                                  ? "rgba(126,184,247,0.06)"
                                  : item.tag === "repeat"
                                  ? "rgba(232,197,71,0.06)"
                                  : item.tag === "cut"
                                  ? "rgba(240,122,90,0.06)"
                                  : item.tag === "dynamics"
                                  ? "rgba(94,203,138,0.06)"
                                  : "transparent",
                            }}
                          >
                            {item.tag}
                          </Badge>
                          <span className="text-sm text-[#e8e8f0] leading-relaxed">
                            {item.text.split("(MORGAN)").map((part, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#f07a5a]/20 text-[#f07a5a] border border-[#f07a5a]/30 mx-0.5 align-middle">
                                    MORGAN
                                  </span>
                                )}
                                {part}
                              </React.Fragment>
                            ))}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(groupIdx, itemIdx)}
                          className="w-7 h-7 text-[#7a7a94] hover:text-red-400 hover:bg-red-950/20 opacity-0 group-hover/note:opacity-100 transition-opacity shrink-0 print:hidden"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: BAND REHEARSAL ── */}
        {activeTab === "band-rehearsal" && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="font-serif text-xl font-bold text-[#e8e8f0]">Band Rehearsal Notes</h2>
            </div>

            <div className="space-y-6">
              {bandRehearsal.map((group, groupIdx) => (
                <div key={`${group.num}-${groupIdx}`} className="bg-[#16161c] border border-[#2a2a38] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2a2a38] bg-[#1a1a24]">
                    <span className="text-2xl font-bold text-[#e8c547] font-mono">{group.num}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#7eb8f7]/20 text-[#7eb8f7] border border-[#7eb8f7]/30">
                      {group.id}
                    </span>
                    <span className="text-sm text-[#e8e8f0]">{group.title}</span>
                  </div>
                  <ul className="p-5 space-y-3">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start justify-between gap-4 group/note">
                        <div className="flex gap-3 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e8c547] shrink-0 mt-2" />
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono uppercase tracking-wider shrink-0 mt-0.5"
                            style={{
                              color: item.tag === "timing" ? "#7eb8f7" : item.tag === "repeat" ? "#e8c547" : item.tag === "cut" ? "#f07a5a" : item.tag === "dynamics" ? "#5ecb8a" : "#7a7a94",
                              borderColor: item.tag === "timing" ? "#7eb8f740" : item.tag === "repeat" ? "#e8c54740" : item.tag === "cut" ? "#f07a5a40" : item.tag === "dynamics" ? "#5ecb8a40" : "#7a7a9440",
                              backgroundColor: item.tag === "timing" ? "#7eb8f710" : item.tag === "repeat" ? "#e8c54710" : item.tag === "cut" ? "#f07a5a10" : item.tag === "dynamics" ? "#5ecb8a10" : "#7a7a9410",
                            }}
                          >
                            {item.tag}
                          </Badge>
                          <span className="text-sm text-[#e8e8f0] leading-relaxed">{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: DANIELE ── */}
        {activeTab === "daniele" && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="font-serif text-xl font-bold text-[#e8e8f0]">Daniele Notes</h2>
            </div>

            <div className="space-y-6">
              {danieleNotes.map((group, groupIdx) => (
                <div key={`${group.num}-${groupIdx}`} className="bg-[#16161c] border border-[#2a2a38] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2a2a38] bg-[#1a1a24]">
                    <span className="text-2xl font-bold text-[#e8c547] font-mono">{group.num}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#7eb8f7]/20 text-[#7eb8f7] border border-[#7eb8f7]/30">
                      {group.id}
                    </span>
                    <span className="text-sm text-[#e8e8f0]">{group.title}</span>
                  </div>
                  <ul className="p-5 space-y-3">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start justify-between gap-4 group/note">
                        <div className="flex gap-3 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e8c547] shrink-0 mt-2" />
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono uppercase tracking-wider shrink-0 mt-0.5"
                            style={{
                              color: item.tag === "timing" ? "#7eb8f7" : item.tag === "repeat" ? "#e8c547" : item.tag === "cut" ? "#f07a5a" : item.tag === "dynamics" ? "#5ecb8a" : "#7a7a94",
                              borderColor: item.tag === "timing" ? "#7eb8f740" : item.tag === "repeat" ? "#e8c54740" : item.tag === "cut" ? "#f07a5a40" : item.tag === "dynamics" ? "#5ecb8a40" : "#7a7a9440",
                              backgroundColor: item.tag === "timing" ? "#7eb8f710" : item.tag === "repeat" ? "#e8c54710" : item.tag === "cut" ? "#f07a5a10" : item.tag === "dynamics" ? "#5ecb8a10" : "#7a7a9410",
                            }}
                          >
                            {item.tag}
                          </Badge>
                          <span className="text-sm text-[#e8e8f0] leading-relaxed">{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: KB CHECK ── */}
        {activeTab === "kb-check" && (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="font-serif text-xl font-bold text-[#e8e8f0]">
                KB Check
                <span className="text-sm font-mono text-[#7a7a94] ml-3">
                  {kbCheck.filter(k => k.checked).length} / {kbCheck.length}
                </span>
              </h2>
            </div>

            <div className="space-y-1">
              {kbCheck.map((item, idx) => (
                <button
                  key={`${item.num}-${idx}`}
                  onClick={() => toggleKBCheck(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    item.checked
                      ? "bg-[#5ecb8a]/10 border border-[#5ecb8a]/30"
                      : "bg-[#16161c] border border-[#2a2a38] hover:border-[#7a7a94]"
                  }`}
                >
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    item.checked
                      ? "bg-[#5ecb8a] border-[#5ecb8a]"
                      : "border-[#7a7a94]"
                  }`}>
                    {item.checked && (
                      <Check className="w-3 h-3 text-[#0e0e12]" />
                    )}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#e8c547] w-10 shrink-0">
                    {item.num}
                  </span>
                  <span className={`text-sm ${item.checked ? "text-[#5ecb8a]" : "text-[#e8e8f0]"}`}>
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: METRONOME ── */}
        {activeTab === "metronome" && (
          <div className="max-w-md mx-auto bg-[#16161c] border border-[#2a2a38] rounded-2xl p-8 text-center relative overflow-hidden">
            {/* Visual Flash Ring */}
            <div
              className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-all duration-75 ${
                flash ? "border-[#e8c547] opacity-100 scale-[0.99]" : "border-transparent opacity-0 scale-100"
              }`}
            />

            <h2 className="font-serif text-2xl font-bold text-[#e8e8f0] mb-6">Interactive Metronome</h2>

            {/* BPM Display */}
            <div className="mb-8 relative inline-block">
              <div
                className={`w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center border-4 transition-all duration-75 ${
                  flash
                    ? "border-[#e8c547] bg-[#e8c547]/10 scale-105"
                    : "border-[#2a2a38] bg-[#0e0e12]"
                }`}
              >
                <span className="font-serif text-5xl font-black text-[#e8c547] leading-none">
                  {metronomeBpm}
                </span>
                <span className="font-mono text-[10px] text-[#7a7a94] uppercase tracking-widest mt-1">
                  BPM
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Slider */}
              <div className="px-4">
                <input
                  type="range"
                  min="40"
                  max="250"
                  value={metronomeBpm}
                  onChange={(e) => setMetronomeBpm(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#2a2a38] rounded-lg appearance-none cursor-pointer accent-[#e8c547]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#7a7a94] mt-2">
                  <span>40 BPM</span>
                  <span>120 BPM</span>
                  <span>250 BPM</span>
                </div>
              </div>

              {/* Quick Adjustments */}
              <div className="flex justify-center gap-2">
                {[-10, -5, -1, 1, 5, 10].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    onClick={() => setMetronomeBpm(Math.max(40, Math.min(250, metronomeBpm + val)))}
                    className="bg-[#0e0e12] border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0] hover:bg-[#1e1e27] font-mono text-xs px-2.5 h-8"
                  >
                    {val > 0 ? `+${val}` : val}
                  </Button>
                ))}
              </div>

              {/* Play / Pause & Mute */}
              <div className="flex justify-center items-center gap-4 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full border-[#2a2a38] ${
                    isMuted ? "text-red-400 bg-red-950/10" : "text-[#7a7a94] hover:text-[#e8e8f0]"
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isMetronomePlaying
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-[#e8c547] hover:bg-[#d4b33b] text-[#0e0e12]"
                  }`}
                >
                  {isMetronomePlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: TAP TEMPO ── */}
        {activeTab === "tap-tempo" && (
          <div className="max-w-md mx-auto bg-[#16161c] border border-[#2a2a38] rounded-2xl p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-[#e8e8f0] mb-2">Tap Tempo</h2>
            <p className="text-xs text-[#7a7a94] font-mono mb-6">
              Tap the button or press <kbd className="px-1.5 py-0.5 bg-[#2a2a38] rounded text-[#e8e8f0]">Spacebar</kbd> to calculate BPM
            </p>

            {/* Tap Button */}
            <button
              onClick={handleTap}
              className="w-48 h-48 rounded-full mx-auto mb-6 flex flex-col items-center justify-center border-4 border-dashed border-[#7eb8f7] hover:border-solid hover:bg-[#7eb8f7]/5 active:scale-95 transition-all cursor-pointer"
            >
              <span className="font-serif text-5xl font-black text-[#7eb8f7] leading-none">
                {tapBpm || "—"}
              </span>
              <span className="font-mono text-[10px] text-[#7a7a94] uppercase tracking-widest mt-2">
                {tapBpm ? "Calculated BPM" : "Tap Here"}
              </span>
            </button>

            {/* Tap Stats */}
            <div className="space-y-4">
              <p className="text-xs text-[#7a7a94] font-mono">
                {tapTimes.length > 0
                  ? `Registered ${tapTimes.length} taps. Keep tapping to refine.`
                  : "No taps registered yet."}
              </p>

              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={resetTap}
                  className="border-[#2a2a38] text-[#7a7a94] hover:text-[#e8e8f0] font-mono text-xs"
                >
                  Reset Taps
                </Button>

                {tapBpm && (
                  <Button
                    onClick={() => {
                      setMetronomeBpm(tapBpm);
                      setActiveTab("metronome");
                      toast({
                        title: "Tempo Applied",
                        description: `Set metronome to ${tapBpm} BPM`,
                      });
                    }}
                    className="bg-[#7eb8f7] text-[#0e0e12] hover:bg-[#6aa4e3] font-mono text-xs"
                  >
                    Use in Metronome
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
      )}
      {activeTab !== "performance" && <MadeWithDyad />}
    </div>
  );
};

export default Index;