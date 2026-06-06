import React, { useState, useEffect, useRef } from "react";
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
  Save
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

// ── DEFAULT DATA ──
const DEFAULT_SONGS: Song[] = [
  { num: 1, id: "31", title: "Exit Music" },
  {
    num: "1A",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Intro)",
    sections: [{ label: "m.17", bpm: 176 }],
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
      { label: "m.63", bpm: 179 },
      { label: "m.86", bpm: 138 },
      { label: "m.93", bpm: 104 },
      { label: "m.99", bpm: 172 },
    ],
  },
  { num: 3, id: "02-03", title: "Horton Hears a Who!" },
  { num: 4, id: "04-04c", title: "Biggest Blame Fool" },
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
    num: 10,
    id: "08",
    title: "How to Raise a Child",
    sections: [
      { label: "m.1", bpm: 141 },
      { label: "m.28", bpm: 132 },
    ],
  },
  {
    num: 11,
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
    num: 12,
    id: "09A-09E",
    title: "The Military (Ghengis' Verse) / The Military Ploff",
  },
  {
    num: 13,
    id: "10-10B",
    title: "Alone in the Universe (Pt 1–3)",
    sections: [
      { label: "10 m.1", bpm: 123 },
      { label: "10 m.9", bpm: 114 },
      { label: "10a m.1", bpm: 137 },
      { label: "10b m.13", bpm: 126 },
      { label: "10b m.19", bpm: 125 },
    ],
  },
  { num: 14, id: "11-12", title: "Gertrude McFuzz / Amayzing Mayzie (Pt 1)" },
  { num: 15, id: "12A 1", title: "Amayzing Gertrude (Pt 1) — Part 1" },
  { num: 16, id: "12A 2", title: "Amayzing Gertrude (Pt 1) — Part 2" },
  { num: 17, id: "12B 1", title: "Amayzing Gertrude (Pt 2)" },
  { num: 18, id: "12B 2-13", title: "Amayzing Gertrude Pt 2 / Monkey Around" },
  { num: 19, id: "14-14C", title: "Chasing the Whos (Pt 1–4)" },
  { num: 20, id: "15", title: "How Lucky You Are" },
  { num: 21, id: "16 1", title: "Notice Me, Horton — Part 1" },
  { num: 22, id: "16-2", title: "Notice Me, Horton — Part 2" },
  { num: 23, id: "16A", title: "How Lucky You Are (Reprise)" },
  { num: 24, id: "16B-17B", title: "Mayzie's Exit Music / Finale (Pt 1–3)" },
  {
    num: 25,
    id: "18",
    title: "Entr'acte",
    bpm: [159],
    feel: "Steady — slight decel toward end",
  },
  {
    num: "18A",
    id: "18A-18B",
    title: "Our Story Resumes… (Part 1)",
    sections: [
      { label: "T1", bpm: 185 },
      { label: "T2", bpm: 163 },
      { label: "T3", bpm: 186 },
    ],
  },
  {
    num: "18B",
    id: "18A-18B",
    title: "Our Story Resumes… (Part 2)",
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
  { num: 24, id: "24-24A", title: "Into the Who's Christmas Pageant" },
  {
    num: 35,
    id: "24B 1",
    title: "A Message from the Front / Solla Sollew (Reprise)",
  },
  { num: 36, id: "24B 2-26C", title: "Message from the Front / Havin' a Hunch" },
  { num: 37, id: "27 1", title: "Gertrude Espionage — Part 1" },
  { num: 38, id: "27 2", title: "Gertrude Espionage — Part 2" },
  { num: 39, id: "27A-27B", title: "All for You (Verse) / All for You" },
  { num: 40, id: "27C", title: "The Whos Return" },
  { num: 41, id: "28-28B 1", title: "People vs Horton (Pt 1–3)" },
  { num: 42, id: "28B 2-28C", title: "People vs Horton (Pt 3–4)" },
  { num: 43, id: "28D", title: "Yopp / Alone in the Universe (Reprise)" },
  {
    num: 44,
    id: "29",
    title: "Oh, the Thinks You Can Think (Finale Act 2)",
  },
  { num: 45, id: "30", title: "Green Eggs and Ham (Final Bows)" },
];

const DEFAULT_NOTES: NoteGroup[] = [
  {
    num: "1A",
    id: "01-01D",
    title: "Oh, The Thinks You Can Think! (Intro)",
    items: [
      {
        tag: "repeat",
        text: "Measures 17–18 are played TWO times only — not five.",
      },
    ],
  },
  {
    num: "4A–4C",
    id: "04-04c",
    title: "Biggest Blame Fool (Parts 2–4)",
    items: [
      { tag: "repeat", text: "4A mm.74–75: play twice only." },
      { tag: "cut", text: "4C m.19: remove the poco rall — no rall." },
    ],
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
    ],
  },
  {
    num: "10",
    id: "08",
    title: "How to Raise a Child",
    items: [
      { tag: "repeat", text: "mm.28–31: play once only — do not repeat." },
    ],
  },
  {
    num: "13",
    id: "10-10B",
    title: "Alone in the Universe (Pt 1–3)",
    items: [
      { tag: "timing", text: "m.14: rall." },
      { tag: "timing", text: "m.15: a tempo." },
    ],
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
    num: "23B",
    id: "23A 2-23B",
    title: "Saving Private JoJo",
    items: [
      {
        tag: "timing",
        text: "m.7: no pause on beat two. Straight through/on stick.",
      },
    ],
  },
];

const Index = () => {
  const { toast } = useToast();

  // ── STATE ──
  // Changed storage keys to v4 to force load the updated default lists
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem("seussical_songs_v4");
    return saved ? JSON.parse(saved) : DEFAULT_SONGS;
  });

  const [notes, setNotes] = useState<NoteGroup[]>(() => {
    const saved = localStorage.getItem("seussical_notes_v4");
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "logged" | "pending">("all");
  const [activeTab, setActiveTab] = useState<"tempos" | "notes" | "metronome" | "tap-tempo">("tempos");
  
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

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("seussical_songs_v4", JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem("seussical_notes_v4", JSON.stringify(notes));
  }, [notes]);

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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime); // 1000Hz click
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04); // short click

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error("Failed to play metronome click:", e);
    }
  };

  useEffect(() => {
    if (isMetronomePlaying) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      playClick();
      setFlash(true);
      const flashTimeout = setTimeout(() => setFlash(false), 80);

      const interval = window.setInterval(() => {
        playClick();
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }, intervalMs);

      intervalRef.current = interval;
      return () => {
        clearInterval(interval);
        clearTimeout(flashTimeout);
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isMetronomePlaying, metronomeBpm, isMuted]);

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
      localStorage.removeItem("seussical_songs_v4");
      localStorage.removeItem("seussical_notes_v4");
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

  // ── PRINT HANDLER ──
  const handlePrint = () => {
    window.print();
  };

  // ── RENDER BPM CELL ──
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
                  <span className="font-mono text-[10px] text-[#7a7a94] w-16 shrink-0 tracking-wider">
                    {sec.label}
                  </span>
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
      );
    }

    // Sequential multi-tempo
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {s.bpm.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#2a2a38] text-xs">›</span>}
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
              className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-full border border-opacity-30 bg-opacity-10 hover:bg-opacity-20 transition-all cursor-pointer"
              style={{
                color: ["#e8c547", "#7eb8f7", "#f07a5a", "#5ecb8a", "#c084fc"][i % 5],
                borderColor: ["#e8c547", "#7eb8f7", "#f07a5a", "#5ecb8a", "#c084fc"][i % 5],
                backgroundColor: ["#e8c547", "#7eb8f7", "#f07a5a", "#5ecb8a", "#c084fc"][i % 5] + "11",
              }}
            >
              T{i + 1} {b}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#e8e8f0] font-sans relative overflow-x-hidden selection:bg-[#e8c547] selection:text-[#0e0e12]">
      {/* Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-[1020px] mx-auto px-4 py-12 md:px-8 relative z-10">
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
        <div className="flex gap-1 border-b border-[#2a2a38] mb-8 print:hidden">
          <button
            onClick={() => setActiveTab("tempos")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all ${
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
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all ${
              activeTab === "notes"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1.5" />
            Notes
          </button>
          <button
            onClick={() => setActiveTab("metronome")}
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all ${
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
            className={`font-mono text-xs tracking-wider uppercase px-4 py-3 border-b-2 transition-all ${
              activeTab === "tap-tempo"
                ? "text-[#e8c547] border-[#e8c547]"
                : "text-[#7a7a94] border-transparent hover:text-[#e8e8f0]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
            Tap Tempo
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
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#1e1e27] border-b-2 border-[#2a2a38]">
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4 w-16 text-center">
                        #
                      </th>
                      <th className="font-mono text-[10px] tracking-widest uppercase text-[#7a7a94] p-4 w-28">
                        Track
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
                        <td colSpan={6} className="p-8 text-center text-[#7a7a94] font-mono text-sm">
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
                            <td className="p-4">
                              <span className="font-mono text-xs text-[#7eb8f7] bg-[#7eb8f7]/10 px-2 py-0.5 rounded">
                                {s.id}
                              </span>
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
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <Button
                onClick={() => setIsAddingNote(true)}
                className="bg-[#7eb8f7] text-[#0e0e12] hover:bg-[#6aa4e3] rounded-lg text-xs font-mono uppercase tracking-wider h-9"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Note
              </Button>
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
            <div className="space-y-6">
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
                            {item.text}
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
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;