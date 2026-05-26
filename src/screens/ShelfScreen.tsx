import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AdjectivePicker } from "../components/AdjectivePicker";
import { BookEditRow } from "../components/BookEditRow";
import { BookRow } from "../components/BookRow";
import { Button } from "../components/Button";
import { ScreenHeader } from "../components/ScreenHeader";
import { SegmentQuestion } from "../components/SegmentQuestion";
import { SectionHeader } from "../components/SectionHeader";
import {
  tintedPillStyle,
  tintedTextStyle,
} from "../constants/personalityColors";
import {
  hasAllTraitAnswers,
  traitQuestions,
} from "../constants/traits";
import { formatTraitValue } from "../lib/formatTraitValue";
import {
  getMySelfProfile,
  getMyShelf,
  updateMySelfPortrait,
  updateMyShelfBooks,
} from "../data/annotaryRepository";
import { styles } from "../styles";
import type { Book, BookSlot, ShelfBookInput, TraitAnswers } from "../types";

type ShelfScreenProps = {
  userId: string | null;
  onSelfPortraitUpdated?: () => void;
};

export function ShelfScreen({
  userId,
  onSelfPortraitUpdated,
}: ShelfScreenProps) {
  const [shelf, setShelf] = useState<Book[]>([]);
  const [draftShelf, setDraftShelf] = useState<ShelfBookInput[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selfAnswers, setSelfAnswers] = useState<TraitAnswers | null>(null);
  const [selfAdjectives, setSelfAdjectives] = useState<string[]>([]);
  const [editingSelf, setEditingSelf] = useState(false);
  const [draftAnswers, setDraftAnswers] = useState<TraitAnswers | null>(null);
  const [draftAdjectives, setDraftAdjectives] = useState<string[]>([]);
  const [savingSelf, setSavingSelf] = useState(false);
  const [selfError, setSelfError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadShelf() {
      if (!userId) {
        setShelf([]);
        setSelfAnswers(null);
        setSelfAdjectives([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [nextShelf, nextProfile] = await Promise.all([
          getMyShelf(userId),
          getMySelfProfile(userId),
        ]);

        if (active) {
          setShelf(nextShelf);
          setSelfAnswers(nextProfile?.answers ?? null);
          setSelfAdjectives(nextProfile?.adjectives ?? []);
        }
      } catch (caughtError) {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load your shelf.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadShelf();

    return () => {
      active = false;
    };
  }, [userId]);

  const startEditingSelf = () => {
    if (!selfAnswers) {
      setSelfError("Could not load your saved essence answers.");
      return;
    }

    setDraftAnswers(selfAnswers);
    setDraftAdjectives(selfAdjectives.slice(0, 3));
    setSelfError(null);
    setEditingSelf(true);
  };

  const cancelEditingSelf = () => {
    setSelfError(null);
    setEditingSelf(false);
  };

  const canSaveSelf =
    draftAnswers !== null &&
    hasAllTraitAnswers(draftAnswers) &&
    draftAdjectives.length === 3 &&
    !savingSelf;

  const saveSelf = async () => {
    if (!canSaveSelf || !userId || !draftAnswers) {
      return;
    }

    setSavingSelf(true);
    setSelfError(null);

    try {
      await updateMySelfPortrait(
        { selfAnswers: draftAnswers, selfAdjectives: draftAdjectives },
        userId,
      );
      setSelfAnswers(draftAnswers);
      setSelfAdjectives(draftAdjectives);
      setEditingSelf(false);
      onSelfPortraitUpdated?.();
    } catch (caughtError) {
      setSelfError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not save your essence.",
      );
    } finally {
      setSavingSelf(false);
    }
  };

  const startEditing = () => {
    setDraftShelf(
      shelf.map((book) => ({
        slot: book.slot,
        title: book.title,
        author: book.author,
        why: book.why,
      })),
    );
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraftShelf([]);
    setError(null);
    setEditing(false);
  };

  const updateDraftBook = (
    slot: BookSlot,
    key: keyof Omit<ShelfBookInput, "slot">,
    value: string,
  ) => {
    setDraftShelf((currentShelf) =>
      currentShelf.map((book) =>
        book.slot === slot ? { ...book, [key]: value } : book,
      ),
    );
  };

  const canSave =
    draftShelf.length === shelf.length &&
    draftShelf.every(
      (book) =>
        book.title.trim().length > 0 &&
        book.author.trim().length > 0 &&
        book.why.trim().length > 0,
    ) &&
    !saving;

  const saveShelf = async () => {
    if (!canSave || !userId) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateMyShelfBooks(draftShelf, userId);
      const nextShelf = await getMyShelf(userId);
      setShelf(nextShelf);
      setDraftShelf([]);
      setEditing(false);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not save your shelf.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Your shelf"
        body="six books that make a small portrait of you"
        accessory={
          <View style={styles.headerActionSlot}>
            {!loading && !editing && shelf.length > 0 && (
              <Button variant="secondary" onPress={startEditing}>
                Edit shelf
              </Button>
            )}
          </View>
        }
      />
      {loading && <Text style={styles.screenBody}>Loading your shelf...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {editing ? (
        <>
          <View style={styles.list}>
            {draftShelf.map((book) => {
              const currentBook = shelf.find((item) => item.slot === book.slot);

              return (
                <BookEditRow
                  key={book.slot}
                  book={book}
                  prompt={currentBook?.question ?? currentBook?.label ?? ""}
                  onChange={(field, value) =>
                    updateDraftBook(book.slot, field, value)
                  }
                />
              );
            })}
          </View>
          <View style={styles.readFooterActions}>
            <Button
              variant="secondary"
              disabled={saving}
              onPress={cancelEditing}
            >
              Cancel
            </Button>
            <Button disabled={!canSave} onPress={saveShelf}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.list}>
          {shelf.map((book) => (
            <BookRow key={book.slot} book={book} grid />
          ))}
        </View>
      )}

      {!loading && (
        <View style={styles.section}>
          <SectionHeader
            title="Your essence"
            body="how you see yourself"
            accessory={
              <View style={styles.headerActionSlot}>
                {!editingSelf && (
                  <Button variant="secondary" onPress={startEditingSelf}>
                    Edit essence
                  </Button>
                )}
              </View>
            }
          />
          {editingSelf && draftAnswers ? (
            <>
              <View style={[styles.formPanel, styles.sectionContent]}>
                {traitQuestions.map((question) => (
                  <SegmentQuestion
                    key={question.key}
                    title={question.selfTitle ?? question.title}
                    options={question.options}
                    active={draftAnswers[question.key]}
                    wide={question.wide}
                    onSelect={(answer) =>
                      setDraftAnswers((current) =>
                        current
                          ? {
                              ...current,
                              [question.key]: answer,
                            }
                          : current,
                      )
                    }
                  />
                ))}
              </View>

              <View style={{ marginTop: 28 }}>
                <AdjectivePicker
                  selected={draftAdjectives}
                  onChange={setDraftAdjectives}
                />
              </View>
            </>
          ) : (
            <>
              <View style={[styles.chipRow, styles.sectionContent]}>
                {traitQuestions
                  .map((question) => ({
                    key: question.key,
                    value: selfAnswers?.[question.key],
                  }))
                  .filter(
                    (item): item is { key: typeof item.key; value: string } =>
                      Boolean(item.value),
                  )
                  .map(({ key, value }) => (
                    <Text
                      key={key}
                      style={[
                        styles.chipStrong,
                        tintedPillStyle(value),
                        tintedTextStyle(value),
                      ]}
                    >
                      {formatTraitValue(key, value)}
                    </Text>
                  ))}
              </View>
              <View style={[styles.chipRow, styles.relatedChipRow]}>
                {selfAdjectives.map((word) => (
                  <Text
                    key={word}
                    style={[
                      styles.chipStrong,
                      tintedPillStyle(word),
                      tintedTextStyle(word),
                    ]}
                  >
                    {word}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>
      )}

      {editingSelf && selfError && (
        <Text style={styles.errorText}>{selfError}</Text>
      )}
      {editingSelf && (
        <View style={styles.readFooterActions}>
          <Button
            variant="secondary"
            disabled={savingSelf}
            onPress={cancelEditingSelf}
          >
            Cancel
          </Button>
          <Button disabled={!canSaveSelf} onPress={saveSelf}>
            {savingSelf ? "Saving..." : "Save changes"}
          </Button>
        </View>
      )}
    </View>
  );
}
