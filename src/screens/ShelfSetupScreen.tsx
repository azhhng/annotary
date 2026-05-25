import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { AdjectivePicker } from "../components/AdjectivePicker";
import { BookEditRow } from "../components/BookEditRow";
import { BrandLogo } from "../components/BrandLogo";
import { Button } from "../components/Button";
import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import { SegmentQuestion } from "../components/SegmentQuestion";
import { bookQuestions } from "../constants/books";
import { traitQuestions } from "../constants/traits";
import { saveMyShelf } from "../data/annotaryRepository";
import { styles } from "../styles";
import type { BookSlot, ShelfBookInput, TraitAnswers } from "../types";

const bookSlots: BookSlot[] = [
  "love_1",
  "love_2",
  "hate",
  "conflicted",
  "live_in",
  "childhood_memory",
];

const initialBooks: ShelfBookInput[] = bookSlots.map((slot) => ({
  slot,
  title: "",
  author: "",
  why: "",
}));

export function ShelfSetupScreen({
  embedded = false,
  onComplete,
  onLogout,
}: {
  embedded?: boolean;
  onComplete: () => void;
  onLogout: () => void;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [traitAnswers, setTraitAnswers] = useState<Partial<TraitAnswers>>({});
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () =>
      books.every(
        (book) =>
          book.title.trim().length > 0 &&
          book.author.trim().length > 0 &&
          book.why.trim().length > 0,
      ) &&
      traitQuestions.every((question) => traitAnswers[question.key]) &&
      selectedAdjectives.length === 3 &&
      !busy,
    [books, selectedAdjectives.length, traitAnswers, busy],
  );

  const updateBook = (
    slot: BookSlot,
    key: keyof Omit<ShelfBookInput, "slot">,
    value: string,
  ) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.slot === slot ? { ...book, [key]: value } : book,
      ),
    );
  };

  const handleSave = async () => {
    if (!canSubmit) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await saveMyShelf({
        books,
        selfAnswers: traitAnswers as TraitAnswers,
        selfAdjectives: selectedAdjectives,
      });
      onComplete();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not save your shelf.",
      );
    } finally {
      setBusy(false);
    }
  };

  const content = (
    <>
        <ScreenHeader
          title="Start with your shelf"
          body="Add six books and do a quick questionnaire so other readers have something real to compare their impressions against."
        />

        <View style={styles.disclaimerBanner}>
          <Text style={styles.disclaimerText}>
            Do not include important plot spoilers in your notes, it may result
            in an account ban.
          </Text>
        </View>

        <View style={styles.list}>
          {books.map((book) => (
            <BookEditRow
              key={book.slot}
              book={book}
              prompt={bookQuestions[book.slot]}
              onChange={(field, value) => updateBook(book.slot, field, value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Your self portrait"
            body="These are your answers. Later, the Essence tab compares them with what strangers guessed from your shelf."
          />
          <View style={[styles.formPanel, styles.sectionContent]}>
            {traitQuestions.map((question) => (
              <SegmentQuestion
                key={question.key}
                title={question.selfTitle ?? question.title}
                options={question.options}
                active={traitAnswers[question.key]}
                wide={question.wide}
                onSelect={(answer) =>
                  setTraitAnswers({
                    ...traitAnswers,
                    [question.key]: answer,
                  })
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AdjectivePicker
            selected={selectedAdjectives}
            onChange={setSelectedAdjectives}
          />
        </View>

        <View style={styles.disclaimerBanner}>
          <Text style={styles.disclaimerText}>
            Once you submit your answers, your shelf will be sent out into the
            world for strangers to review.
          </Text>
        </View>

        <View style={styles.readFooterActions}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button disabled={!canSubmit} onPress={handleSave}>
            {busy ? "Saving..." : "Save shelf"}
          </Button>
        </View>
    </>
  );

  if (embedded) {
    return <View style={styles.screen}>{content}</View>;
  }

  return (
    <View style={styles.onboardingShell}>
      <View style={styles.onboardingHeader}>
        <View style={styles.brandRow}>
          <BrandLogo />
          <Text style={styles.tagline}>build your six-book shelf</Text>
        </View>
        <Button variant="secondary" onPress={onLogout}>
          Log out
        </Button>
      </View>

      <ScrollView
        style={styles.onboardingScroll}
        contentContainerStyle={styles.onboardingContent}
      >
        {content}
      </ScrollView>
    </View>
  );
}
