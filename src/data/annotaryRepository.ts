import { bookQuestions } from "../constants/books";
import { traitQuestions } from "../constants/traits";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type {
  AdjectiveCount,
  Book,
  BookSlot,
  DescriptionInput,
  EssenceResults,
  ProfileReveal,
  ProfileToDescribe,
  ReportReason,
  ShelfBookInput,
  ShelfSetupInput,
  TraitAnswerResult,
  TraitAnswers,
} from "../types";

const bookSlotOrder: BookSlot[] = [
  "love_1",
  "love_2",
  "hate",
  "conflicted",
  "live_in",
  "childhood_memory",
];

const bookLabels: Record<BookSlot, string> = {
  love_1: "Love",
  love_2: "Love",
  hate: "Hate",
  conflicted: "Conflicted",
  live_in: "Live in",
  childhood_memory: "Childhood",
};

const completedShelfRequests = new Map<string, Promise<boolean>>();
const shelfRequests = new Map<string, Promise<Book[]>>();

type BookRow = {
  slot: BookSlot;
  title: string;
  author: string;
  why: string;
};

type ProfileRow = {
  id: string;
  self_answers: Record<string, string> | null;
  self_adjectives: string[] | null;
};

type AccountStatusRow = {
  profile_complete: boolean;
  is_banned: boolean | null;
};

type ProfileRevealRow = {
  self_answers: Record<string, string> | null;
  self_adjectives: string[] | null;
};

type NextProfileRow = {
  id: string;
};

type TraitCountRow = {
  trait_key: string;
  answer: string;
  count: number;
};

async function getCurrentUserId() {
  const user = await getCurrentUser();

  return user?.id ?? null;
}

async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

function getUsernameFromUser(user: User) {
  const username = user.user_metadata?.username;

  return typeof username === "string" && username.trim()
    ? username.trim().toLowerCase()
    : null;
}

function toBook(row: BookRow): Book {
  return {
    slot: row.slot,
    label: bookLabels[row.slot],
    question: bookQuestions[row.slot],
    title: row.title,
    author: row.author,
    why: row.why,
  };
}

function sortBooks(books: Book[]) {
  return [...books].sort(
    (a, b) => bookSlotOrder.indexOf(a.slot) - bookSlotOrder.indexOf(b.slot),
  );
}

function prepareShelfBooks(userId: string, books: ShelfBookInput[]) {
  if (books.length !== bookSlotOrder.length) {
    throw new Error("Please fill out all six book prompts.");
  }

  const preparedBooks = books.map((book) => ({
    profile_id: userId,
    slot: book.slot,
    title: book.title.trim(),
    author: book.author.trim(),
    why: book.why.trim(),
  }));

  const hasEmptyField = preparedBooks.some(
    (book) => !book.title || !book.author || !book.why,
  );

  if (hasEmptyField) {
    throw new Error("Every book needs a title, author, and short note.");
  }

  return preparedBooks;
}

async function fetchMyShelf(userId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("slot,title,author,why")
    .eq("profile_id", userId);

  if (error) {
    throw error;
  }

  if (!data.length) {
    return [];
  }

  return sortBooks((data as BookRow[]).map(toBook));
}

export async function getMyShelf(knownUserId?: string): Promise<Book[]> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    return [];
  }

  const pendingRequest = shelfRequests.get(userId);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = fetchMyShelf(userId).finally(() => {
    shelfRequests.delete(userId);
  });

  shelfRequests.set(userId, request);

  return request;
}

async function ensureProfileIsNotBanned(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if ((profile as { is_banned?: boolean } | null)?.is_banned) {
    throw new Error("This account has been permanently banned.");
  }
}

async function fetchCompletedShelf(userId: string): Promise<boolean> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("profile_complete,is_banned")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if ((profile as AccountStatusRow | null)?.is_banned) {
    return true;
  }

  if (!profile?.profile_complete) {
    return false;
  }

  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("slot")
    .eq("profile_id", userId)
    .limit(bookSlotOrder.length);

  if (booksError) {
    throw booksError;
  }

  return (books ?? []).length >= bookSlotOrder.length;
}

export async function getMyAccountStatus(
  knownUserId?: string,
): Promise<{ shelfComplete: boolean; banned: boolean }> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    return { shelfComplete: false, banned: false };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("profile_complete,is_banned")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const typedProfile = profile as AccountStatusRow | null;

  if (typedProfile?.is_banned) {
    return { shelfComplete: true, banned: true };
  }

  if (!typedProfile?.profile_complete) {
    return { shelfComplete: false, banned: false };
  }

  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("slot")
    .eq("profile_id", userId)
    .limit(bookSlotOrder.length);

  if (booksError) {
    throw booksError;
  }

  return {
    shelfComplete: (books ?? []).length >= bookSlotOrder.length,
    banned: false,
  };
}

export async function hasCompletedShelf(
  knownUserId?: string,
): Promise<boolean> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    return false;
  }

  const pendingRequest = completedShelfRequests.get(userId);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = fetchCompletedShelf(userId).finally(() => {
    completedShelfRequests.delete(userId);
  });

  completedShelfRequests.set(userId, request);

  return request;
}

export async function saveMyShelf(input: ShelfSetupInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be logged in to save your shelf.");
  }

  const userId = user.id;
  const { books, selfAnswers, selfAdjectives } = input;
  const username = getUsernameFromUser(user);

  await ensureProfileIsNotBanned(userId);

  if (selfAdjectives.length !== 3) {
    throw new Error("Please choose exactly three adjectives.");
  }

  const preparedBooks = prepareShelfBooks(userId, books);

  const { error: profileStartError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      username,
      self_answers: selfAnswers,
      self_adjectives: selfAdjectives,
      profile_complete: false,
      is_discoverable: false,
    },
    { onConflict: "id" },
  );

  if (profileStartError) {
    throw profileStartError;
  }

  const { error: deleteError } = await supabase
    .from("books")
    .delete()
    .eq("profile_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  const { error: booksError } = await supabase
    .from("books")
    .insert(preparedBooks);

  if (booksError) {
    throw booksError;
  }

  const { error: profileCompleteError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        username,
        self_answers: selfAnswers,
        self_adjectives: selfAdjectives,
        profile_complete: true,
        is_discoverable: true,
      },
      { onConflict: "id" },
    );

  if (profileCompleteError) {
    throw profileCompleteError;
  }
}

export async function updateMyShelfBooks(
  books: ShelfBookInput[],
  knownUserId?: string,
) {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to edit your shelf.");
  }

  await ensureProfileIsNotBanned(userId);

  const preparedBooks = prepareShelfBooks(userId, books);

  const { error: deleteError } = await supabase
    .from("books")
    .delete()
    .eq("profile_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  const { error: booksError } = await supabase
    .from("books")
    .insert(preparedBooks);

  if (booksError) {
    throw booksError;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      profile_complete: true,
      is_discoverable: true,
    })
    .eq("id", userId);

  if (profileError) {
    throw profileError;
  }
}

export async function updateMySelfPortrait(
  input: { selfAnswers: TraitAnswers; selfAdjectives: string[] },
  knownUserId?: string,
) {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to edit your essence.");
  }

  await ensureProfileIsNotBanned(userId);

  if (input.selfAdjectives.length !== 3) {
    throw new Error("Please choose exactly three adjectives.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      self_answers: input.selfAnswers,
      self_adjectives: input.selfAdjectives,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function getProfileToDescribe(
  knownUserId?: string,
): Promise<ProfileToDescribe | null> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    return null;
  }

  const { data: profiles, error: profilesError } = await supabase.rpc(
    "get_next_profile_to_describe",
    { viewer_id: userId },
  );

  if (profilesError) {
    throw profilesError;
  }

  const nextProfile = (profiles as NextProfileRow[] | null)?.[0] ?? null;

  if (!nextProfile) {
    return null;
  }

  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("slot,title,author,why")
    .eq("profile_id", nextProfile.id);

  if (booksError) {
    throw booksError;
  }

  return {
    id: nextProfile.id as string,
    books: sortBooks((books as BookRow[]).map(toBook)),
  };
}

export async function getMySelfProfile(
  knownUserId?: string,
): Promise<{ answers: TraitAnswers | null; adjectives: string[] } | null> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("self_answers,self_adjectives")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const typed = data as ProfileRow;

  return {
    answers: (typed.self_answers as TraitAnswers | null) ?? null,
    adjectives: typed.self_adjectives ?? [],
  };
}

export async function getEssenceResults(
  knownUserId?: string,
): Promise<EssenceResults> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to view your essence.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,self_answers,self_adjectives")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    throw new Error("Could not load your profile.");
  }

  const typedProfile = profile as ProfileRow;

  const { data: traitCounts, error: traitCountsError } = await supabase
    .from("trait_answer_counts")
    .select("trait_key,answer,count")
    .eq("profile_id", userId)
    .order("trait_key", { ascending: true })
    .order("count", { ascending: false })
    .order("answer", { ascending: true });

  if (traitCountsError) {
    throw traitCountsError;
  }

  const answers: TraitAnswerResult[] = traitQuestions.map((question) => ({
    question: question.title,
    self: typedProfile.self_answers?.[question.key] ?? "Unset",
    strangers: ((traitCounts ?? []) as TraitCountRow[])
      .filter((count) => count.trait_key === question.key)
      .map((count) => ({
        value: count.answer,
        count: count.count,
      })),
  }));

  const { data: adjectiveCounts, error: adjectiveCountsError } = await supabase
    .from("adjective_counts")
    .select("adjective,count")
    .eq("profile_id", userId)
    .order("count", { ascending: false })
    .order("adjective", { ascending: true });

  if (adjectiveCountsError) {
    throw adjectiveCountsError;
  }

  return {
    answers,
    selfAdjectives: typedProfile.self_adjectives ?? [],
    strangerAdjectives: (adjectiveCounts ?? []).map(
      (item): AdjectiveCount => ({
        word: item.adjective as string,
        count: item.count as number,
      }),
    ),
  };
}

export async function getProfileReveal(
  profileId: string,
  knownUserId?: string,
): Promise<ProfileReveal> {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to reveal a profile.");
  }

  const { data, error } = await supabase.rpc("get_profile_reveal", {
    target_profile_id: profileId,
  });

  if (error) {
    throw error;
  }

  const reveal = (data as ProfileRevealRow[] | null)?.[0] ?? null;

  if (!reveal?.self_answers) {
    throw new Error("Could not reveal this profile yet.");
  }

  return {
    answers: reveal.self_answers as TraitAnswers,
    adjectives: reveal.self_adjectives ?? [],
  };
}

export async function submitDescription(
  input: DescriptionInput,
  knownUserId?: string,
) {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to submit a description.");
  }

  const { error } = await supabase.rpc("submit_description", {
    target_profile_id: input.profileId,
    submitted_answers: input.answers,
    submitted_adjectives: input.adjectives,
  });

  if (error) {
    throw error;
  }
}

export async function reportProfile(
  profileId: string,
  knownUserId?: string,
  reason: ReportReason = "other",
  explanation = "",
) {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to report a profile.");
  }

  const { error } = await supabase.rpc("report_profile", {
    report_explanation: explanation.trim() || null,
    report_reason: reason,
    target_profile_id: profileId,
  });

  if (error) {
    throw error;
  }
}

export async function skipProfile(profileId: string, knownUserId?: string) {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to skip a profile.");
  }

  const { error } = await supabase.from("profile_interactions").upsert(
    {
      viewer_id: userId,
      profile_id: profileId,
      status: "skipped",
    },
    { onConflict: "viewer_id,profile_id" },
  );

  if (error) {
    throw error;
  }
}

export async function removeProfile(profileId: string, knownUserId?: string) {
  const userId = knownUserId ?? (await getCurrentUserId());

  if (!userId) {
    throw new Error("You must be logged in to remove a profile.");
  }

  const { error } = await supabase.from("profile_interactions").upsert(
    {
      viewer_id: userId,
      profile_id: profileId,
      status: "removed",
    },
    { onConflict: "viewer_id,profile_id" },
  );

  if (error) {
    throw error;
  }
}

export async function deleteMyAccount() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("You must be logged in to delete your account.");
  }

  const { error } = await supabase.rpc("delete_current_user");

  if (error) {
    throw error;
  }
}
