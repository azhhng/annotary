import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

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
  reportProfile,
  skipProfile,
  submitDescription,
} from "../data/annotaryRepository";
import { colors, styles } from "../styles";
import type {
  ProfileReveal,
  ProfileToDescribe,
  ReportReason,
  TraitAnswers,
} from "../types";

const reportReasons: Array<{ label: string; value: ReportReason }> = [
  { label: "Adult content", value: "adult_content" },
  { label: "Harassment", value: "harassment" },
  { label: "Plot spoilers", value: "plot_spoilers" },
  { label: "Self promotion", value: "self_promotion" },
  { label: "Solicitation", value: "solicitation" },
  { label: "Other", value: "other" },
];

const reportExplanationLimit = 500;

const emptyTraitAnswers: TraitAnswers = {
  socialEnergy: "",
  lifePerspective: "",
  birthOrder: "",
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
  const [skipConfirming, setSkipConfirming] = useState(false);
  const [removeConfirming, setRemoveConfirming] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>("other");
  const [reportExplanation, setReportExplanation] = useState("");
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
    setSkipConfirming(false);
    setRemoveConfirming(false);
    setReportModalVisible(false);
    setReportReason("other");
    setReportExplanation("");
    setComparison(null);
  };

  useEffect(() => {
    resetForm();
  }, [profileId]);

  useEffect(() => {
    onComparisonChange(comparison !== null);
  }, [comparison, onComparisonChange]);

  const handleSkip = async () => {
    if (!skipConfirming) {
      setError(null);
      setSkipConfirming(true);
      setRemoveConfirming(false);
      setReportModalVisible(false);
      return;
    }

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
    if (!removeConfirming) {
      setError(null);
      setSkipConfirming(false);
      setRemoveConfirming(true);
      setReportModalVisible(false);
      return;
    }

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

  const handleReport = async () => {
    setError(null);
    setSkipConfirming(false);
    setRemoveConfirming(false);
    setReportModalVisible(true);
  };

  const handleSubmitReport = async () => {
    setBusy(true);
    setError(null);

    try {
      await reportProfile(profileId, userId, reportReason, reportExplanation);
      resetForm();
      await onDone();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not report this shelf.",
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
        {skipConfirming && (
          <Text style={styles.errorText}>Review this shelf later?</Text>
        )}
        {removeConfirming && (
          <Text style={styles.errorText}>Never see this shelf again?</Text>
        )}
        <Button variant="secondary" disabled={busy} onPress={handleSkip}>
          {skipConfirming ? "Confirm skip" : "Skip"}
        </Button>
        <Button variant="danger" disabled={busy} onPress={handleRemove}>
          {removeConfirming ? "Confirm remove" : "Remove"}
        </Button>
        <Button variant="danger" disabled={busy} onPress={handleReport}>
          Report
        </Button>
        <Button disabled={!canSubmit || busy} onPress={handleSubmit}>
          {busy ? "Submitting..." : "Submit"}
        </Button>
      </View>
      <ReportProfileModal
        busy={busy}
        explanation={reportExplanation}
        reason={reportReason}
        visible={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        onChangeExplanation={setReportExplanation}
        onChangeReason={setReportReason}
        onSubmit={handleSubmitReport}
      />
    </>
  );
}

function ReportProfileModal({
  busy,
  explanation,
  reason,
  visible,
  onCancel,
  onChangeExplanation,
  onChangeReason,
  onSubmit,
}: {
  busy: boolean;
  explanation: string;
  reason: ReportReason;
  visible: boolean;
  onCancel: () => void;
  onChangeExplanation: (next: string) => void;
  onChangeReason: (next: ReportReason) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.reportDialog}>
          <Text style={styles.authTitle}>Report profile</Text>
          <Text style={styles.screenBody}>
            Choose the closest reason and add anything a reviewer should check.
          </Text>

          <View style={styles.reportReasonGrid}>
            {reportReasons.map((option) => {
              const active = option.value === reason;

              return (
                <Pressable
                  key={option.value}
                  disabled={busy}
                  onPress={() => onChangeReason(option.value)}
                  style={[
                    styles.reportReasonButton,
                    active && styles.reportReasonButtonActive,
                    busy && styles.buttonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.reportReasonText,
                      active && styles.reportReasonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What should we look at?</Text>
            <TextInput
              editable={!busy}
              maxLength={reportExplanationLimit}
              multiline
              onChangeText={onChangeExplanation}
              placeholder="Optional"
              placeholderTextColor={colors.placeholder}
              style={[styles.textInput, styles.reportTextInput]}
              textAlignVertical="top"
              value={explanation}
            />
            <View style={styles.reportHelperRow}>
              <Text style={styles.helperText}>Do not include private info.</Text>
              <Text style={styles.characterCounter}>
                {explanation.length}/{reportExplanationLimit}
              </Text>
            </View>
          </View>

          <View style={styles.reportDialogActions}>
            <Button variant="secondary" disabled={busy} onPress={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" disabled={busy} onPress={onSubmit}>
              {busy ? "Reporting..." : "Submit report"}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
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
