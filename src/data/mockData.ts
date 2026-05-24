import type { AdjectiveCount, Book, TraitAnswerResult } from "../types";

export const shelf: Book[] = [
  {
    slot: "love_1",
    label: "Love",
    title: "The Secret History",
    author: "Donna Tartt",
    why: "Beautiful people making terrible choices in tweed. I fear it rewired me.",
  },
  {
    slot: "love_2",
    label: "Love",
    title: "Kitchen",
    author: "Banana Yoshimoto",
    why: "Soft grief, midnight kitchens, and the tiny rituals that keep people alive.",
  },
  {
    slot: "hate",
    label: "Hate",
    title: "The Alchemist",
    author: "Paulo Coelho",
    why: "I wanted magic and got a fridge magnet that learned to speak.",
  },
  {
    slot: "conflicted",
    label: "Conflicted",
    title: "Normal People",
    author: "Sally Rooney",
    why: "I was annoyed the entire time, which unfortunately means I cared.",
  },
  {
    slot: "live_in",
    label: "Live in",
    title: "Howl's Moving Castle",
    author: "Diana Wynne Jones",
    why: "A messy enchanted house, dramatic coats, and breakfast with a fire demon.",
  },
  {
    slot: "childhood_memory",
    label: "Childhood",
    question: "A book you still remember from your childhood?",
    title: "Matilda",
    author: "Roald Dahl",
    why: "The first book that made reading feel like a private superpower.",
  },
];

export const selfAdjectives = ["Nostalgic", "Witty", "Sensitive"];

export const strangerAdjectives: AdjectiveCount[] = [
  { word: "Whimsical", count: 8 },
  { word: "Introspective", count: 7 },
  { word: "Dramatic", count: 6 },
  { word: "Romantic", count: 5 },
  { word: "Perceptive", count: 4 },
  { word: "Restless", count: 3 },
  { word: "Gentle", count: 3 },
  { word: "Academic", count: 2 },
  { word: "Contrarian", count: 2 },
];

export const essenceAnswers: TraitAnswerResult[] = [
  {
    question: "Social energy",
    self: "Ambiverted",
    strangers: [
      { value: "Introverted", count: 8 },
      { value: "Ambiverted", count: 3 },
    ],
  },
  {
    question: "Life perspective",
    self: "Realistic",
    strangers: [
      { value: "Realistic", count: 6 },
      { value: "Optimistic", count: 4 },
      { value: "Pessimistic", count: 1 },
    ],
  },
  {
    question: "Emotional outlook",
    self: "Romantic",
    strangers: [
      { value: "Romantic", count: 7 },
      { value: "Idealistic", count: 3 },
      { value: "Cynical", count: 1 },
    ],
  },
  {
    question: "Reasoning style",
    self: "Emotional",
    strangers: [
      { value: "Emotional", count: 9 },
      { value: "Logical", count: 2 },
    ],
  },
  {
    question: "Personality type",
    self: "Type B",
    strangers: [
      { value: "Type B", count: 7 },
      { value: "Type A", count: 4 },
    ],
  },
  {
    question: "Favorite season",
    self: "Autumn",
    strangers: [
      { value: "Autumn", count: 5 },
      { value: "Winter", count: 3 },
      { value: "Spring", count: 2 },
      { value: "Summer", count: 1 },
    ],
  },
  {
    question: "Zodiac sign",
    self: "Cancer",
    strangers: [
      { value: "Cancer", count: 4 },
      { value: "Pisces", count: 3 },
      { value: "Libra", count: 2 },
      { value: "Scorpio", count: 2 },
    ],
  },
];
