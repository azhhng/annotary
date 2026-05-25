import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

import { AdjectivePicker } from "../components/AdjectivePicker";
import { BookRow } from "../components/BookRow";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/ScreenHeader";
import { SegmentQuestion } from "../components/SegmentQuestion";
import { SectionHeader } from "../components/SectionHeader";
import {
  tintedPillStyle,
  tintedTextStyle,
} from "../constants/personalityColors";
import { emptyOthersQuotes } from "../constants/quotes";
import { othersTraitQuestions } from "../constants/traits";
import {
  getProfileReveal,
  getProfileToDescribe,
  removeProfile,
  skipProfile,
  submitDescription,
} from "../data/annotaryRepository";
import { styles } from "../styles";
import type { ProfileReveal, ProfileToDescribe, TraitAnswers } from "../types";

const emptyTraitAnswers: TraitAnswers = {
  socialEnergy: "",
  lifePerspective: "",
  emotionalOutlook: "",
  reasoningStyle: "",
  personalityType: "",
  favoriteSeason: "",
  zodiacSign: "",
};

export function DailyScreen({
  userId,
  selected,
  onToggle,
}: {
  userId: string | null;
  selected: string[];
  onToggle: (next: string[]) => void;
}) {
  const [profile, setProfile] = useState<ProfileToDescribe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showingComparison, setShowingComparison] = useState(false);
  const emptyOthersQuote = useMemo(
    () =>
      emptyOthersQuotes[Math.floor(Math.random() * emptyOthersQuotes.length)],
    [],
  );

  async function loadProfile() {
    console.log("[Others] loadProfile start", { userId });

    if (!userId) {
      console.log("[Others] loadProfile stopped; no userId");

      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const nextProfile = await getProfileToDescribe(userId);

      console.log("[Others] loadProfile result", {
        bookCount: nextProfile?.books.length ?? 0,
        profileId: nextProfile?.id ?? null,
        userId,
      });

      setProfile(nextProfile);
    } catch (caughtError) {
      console.log("[Others] loadProfile error", {
        error: caughtError,
        userId,
      });

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not load another shelf.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [userId]);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Strangers"
        body="read someone else's shelf, then make a quick anonymous guess"
      />

      {loading && (
        <Text style={styles.screenBody}>Loading another shelf...</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && !error && !profile && (
        <EmptyState title="No shelves waiting" quote={emptyOthersQuote} />
      )}
      {!showingComparison && (
        <View style={styles.list}>
          {profile?.books.map((book) => (
            <BookRow key={book.slot} book={book} grid />
          ))}
        </View>
      )}
      {profile && userId && (
        <DescribePanel
          profileId={profile.id}
          selected={selected}
          userId={userId}
          onToggle={onToggle}
          onDone={loadProfile}
          onComparisonChange={setShowingComparison}
        />
      )}
    </View>
  );
}

function DescribePanel({
  profileId,
  selected,
  userId,
  onToggle,
  onDone,
  onComparisonChange,
}: {
  profileId: string;
  selected: string[];
  userId: string;
  onToggle: (next: string[]) => void;
  onDone: () => Promise<void>;
  onComparisonChange: (showing: boolean) => void;
}) {
  const [traitAnswers, setTraitAnswers] = useState(emptyTraitAnswers);
  const allTraitsAnswered = othersTraitQuestions.every(
    (question) => traitAnswers[question.key] !== "",
  );
  const canSubmit = selected.length === 3 && allTraitsAnswered;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<{
    submitted: {
      answers: TraitAnswers;
      adjectives: string[];
    };
    actual: ProfileReveal;
  } | null>(null);

  const resetForm = () => {
    onToggle([]);
    setTraitAnswers(emptyTraitAnswers);
    setError(null);
    setComparison(null);
  };

  useEffect(() => {
    resetForm();
  }, [profileId]);

  useEffect(() => {
    onComparisonChange(comparison !== null);
  }, [comparison, onComparisonChange]);

  const handleSkip = async () => {
    setBusy(true);
    setError(null);

    try {
      await skipProfile(profileId, userId);
      resetForm();
      await onDone();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Could not skip.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    setError(null);

    try {
      await removeProfile(profileId, userId);
      resetForm();
      await onDone();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not remove.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const submitted = {
        profileId,
        answers: traitAnswers as TraitAnswers,
        adjectives: [...selected],
      };

      await submitDescription(submitted, userId);
      const actual = await getProfileReveal(profileId, userId);

      setComparison({
        submitted: {
          answers: submitted.answers,
          adjectives: submitted.adjectives,
        },
        actual,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not submit.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (comparison) {
    return (
      <RevealComparison
        actual={comparison.actual}
        busy={busy}
        submitted={comparison.submitted}
        onNext={async () => {
          setBusy(true);
          setError(null);

          try {
            resetForm();
            await onDone();
          } catch (caughtError) {
            setError(
              caughtError instanceof Error
                ? caughtError.message
                : "Could not load another shelf.",
            );
          } finally {
            setBusy(false);
          }
        }}
      />
    );
  }

  return (
    <>
      <View style={styles.section}>
        <SectionHeader
          title="What does this shelf make you suspect?"
          body="your response is anonymous"
        />
        <View style={[styles.formPanel, styles.sectionContent]}>
          {othersTraitQuestions.map((question) => (
            <SegmentQuestion
              key={question.key}
              title={question.othersTitle ?? question.title}
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
        <View style={{ marginTop: 28 }}>
          <AdjectivePicker selected={selected} onChange={onToggle} />
        </View>
      </View>
      <View style={styles.readFooterActions}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button variant="secondary" disabled={busy} onPress={handleSkip}>
          Skip
        </Button>
        <Button variant="danger" disabled={busy} onPress={handleRemove}>
          Remove
        </Button>
        <Button disabled={!canSubmit || busy} onPress={handleSubmit}>
          {busy ? "Submitting..." : "Submit"}
        </Button>
      </View>
    </>
  );
}

function RevealComparison({
  actual,
  busy,
  submitted,
  onNext,
}: {
  actual: ProfileReveal;
  busy: boolean;
  submitted: {
    answers: TraitAnswers;
    adjectives: string[];
  };
  onNext: () => Promise<void>;
}) {
  return (
    <>
      <ScreenHeader
        title="How your read compared"
        body="Your judgement is saved. Here is what they said about themself."
      />
      <View style={styles.list}>
        {othersTraitQuestions.map((question) => {
          const submittedAnswer = submitted.answers[question.key];
          const actualAnswer = actual.answers[question.key];
          const matched = submittedAnswer === actualAnswer;

          return (
            <View
              key={question.key}
              style={[styles.section, styles.resultBlockGrid]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{question.title}</Text>
                <Text style={styles.counter}>
                  {matched ? "match" : "different"}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>You</Text>
                <Text
                  style={[
                    styles.chip,
                    tintedPillStyle(submittedAnswer),
                    tintedTextStyle(submittedAnswer),
                  ]}
                >
                  {submittedAnswer}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Them</Text>
                <Text
                  style={[
                    styles.chip,
                    tintedPillStyle(actualAnswer),
                    tintedTextStyle(actualAnswer),
                  ]}
                >
                  {actualAnswer}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={[styles.section, { marginTop: 28 }]}>
        <SectionHeader title="Words" />
        <View style={[styles.wordsColumns, styles.sectionContent]}>
          <View style={styles.wordsColumn}>
            <Text style={styles.resultLabel}>You</Text>
            <View style={styles.wordsChipStack}>
              {submitted.adjectives.map((word) => (
                <Text
                  key={word}
                  style={[
                    styles.chip,
                    tintedPillStyle(word),
                    tintedTextStyle(word),
                  ]}
                >
                  {word}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.wordsColumn}>
            <Text style={styles.resultLabel}>Them</Text>
            <View style={styles.wordsChipStack}>
              {actual.adjectives.map((word) => (
                <Text
                  key={word}
                  style={[
                    styles.chip,
                    tintedPillStyle(word),
                    tintedTextStyle(word),
                  ]}
                >
                  {word}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.readFooterActions}>
        <Button disabled={busy} onPress={onNext}>
          {busy ? "Loading..." : "Next shelf"}
        </Button>
      </View>
    </>
  );
}
