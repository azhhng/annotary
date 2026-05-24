import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import {
  getPersonalityColor,
  tintedPillStyle,
  tintedTextStyle,
} from "../constants/personalityColors";
import { emptyEssenceQuotes } from "../constants/quotes";
import { getEssenceResults } from "../data/annotaryRepository";
import { styles } from "../styles";
import type { EssenceResults } from "../types";

type EssenceScreenProps = {
  userId: string | null;
};

const MAX_VISIBLE_WORDS = 15;

export function EssenceScreen({ userId }: EssenceScreenProps) {
  const [results, setResults] = useState<EssenceResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllWords, setShowAllWords] = useState(false);
  const emptyEssenceQuote = useMemo(
    () =>
      emptyEssenceQuotes[Math.floor(Math.random() * emptyEssenceQuotes.length)],
    [],
  );

  useEffect(() => {
    let active = true;

    async function loadResults() {
      if (!userId) {
        setResults(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
          setError(null);
          setShowAllWords(false);
          const nextResults = await getEssenceResults(userId);

        if (active) {
          setResults(nextResults);
        }
      } catch (caughtError) {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load your essence.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => {
      active = false;
    };
  }, [userId]);

  const answers = results?.answers ?? [];
  const strangerAdjectives = useMemo(
    () =>
      [...(results?.strangerAdjectives ?? [])].sort(
        (first, second) =>
          second.count - first.count || first.word.localeCompare(second.word),
      ),
    [results],
  );
  const visibleStrangerAdjectives = useMemo(
    () =>
      showAllWords
        ? strangerAdjectives
        : strangerAdjectives.slice(0, MAX_VISIBLE_WORDS),
    [showAllWords, strangerAdjectives],
  );
  const hasHiddenWords = strangerAdjectives.length > MAX_VISIBLE_WORDS;
  const total = useMemo(
    () =>
      Math.max(
        0,
        ...answers.map((answer) =>
          answer.strangers.reduce((sum, item) => sum + item.count, 0),
        ),
      ),
    [answers],
  );
  const hasStrangerResponses =
    total > 0 || strangerAdjectives.some((item) => item.count > 0);
  const reviewSummary =
    total === 1
      ? "1 stranger has described your shelf"
      : `${total} strangers have described your shelf`;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Essence"
        body={
          hasStrangerResponses
            ? reviewSummary
            : "impressions will appear here once strangers describe your shelf"
        }
      />
      {loading ? (
        <Text style={styles.screenBody}>Loading your essence...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : !hasStrangerResponses ? (
        <EmptyState title="No outside reads yet" quote={emptyEssenceQuote} />
      ) : (
        <>
          <View style={styles.section}>
            <SectionHeader title="What Readers Notice" />
            <View style={[styles.chipRow, styles.sectionContent]}>
              {visibleStrangerAdjectives.map((item) => (
                <Text
                  key={item.word}
                  style={[
                    styles.chip,
                    tintedPillStyle(item.word),
                    tintedTextStyle(item.word),
                  ]}
                >
                  {item.word} {item.count}
                </Text>
              ))}
            </View>
            {hasHiddenWords ? (
              <View style={styles.wordsRevealActions}>
                <Button
                  variant="secondary"
                  onPress={() => setShowAllWords((current) => !current)}
                >
                  {showAllWords ? "Show less" : "See more"}
                </Button>
              </View>
            ) : null}
          </View>
          <View style={styles.list}>
            {answers.map((item) => (
              <View
                key={item.question}
                style={[styles.section, styles.resultBlockGrid]}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>{item.question}</Text>
                </View>
                {item.strangers.map((answer) => (
                  <View key={answer.value} style={styles.resultRow}>
                    <Text
                      style={[
                        styles.resultTraitChip,
                        tintedPillStyle(answer.value),
                        tintedTextStyle(answer.value),
                      ]}
                    >
                      {answer.value}
                    </Text>
                    <View style={styles.resultBarTrack}>
                      <View
                        style={[
                          styles.resultBarFill,
                          {
                            width: `${
                              total > 0 ? (answer.count / total) * 100 : 0
                            }%`,
                          },
                          {
                            backgroundColor: getPersonalityColor(answer.value)
                              .fill,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.resultCount}>{answer.count}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
