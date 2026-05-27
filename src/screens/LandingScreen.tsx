import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { BookRow } from "../components/BookRow";
import { BrandLogo } from "../components/BrandLogo";
import { DeveloperCredit } from "../components/DeveloperCredit";
import { Button } from "../components/Button";
import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import { SegmentQuestion } from "../components/SegmentQuestion";
import {
  tintedPillStyle,
  tintedTextStyle,
} from "../constants/personalityColors";
import {
  createEmptyTraitAnswers,
  hasAllTraitAnswers,
  othersTraitQuestions,
} from "../constants/traits";
import type { Book, TraitAnswers } from "../types";
import type { LegalPage } from "./LegalScreen";
import { styles } from "../styles";

const booksIcon = require("../emoji-assets/blue_book.svg");
const owlIcon = require("../emoji-assets/blue_book.svg");
const sparklesIcon = require("../emoji-assets/blue_book.svg");

const steps = [
  {
    icon: booksIcon,
    text: "Curate a set of 6 books that represent you.",
  },
  {
    icon: owlIcon,
    text: "Read other strangers' shelves and try to guess who they are.",
  },
  {
    icon: sparklesIcon,
    text: "See how other people have guessed your essence.",
  },
];

const sampleBooks: Book[] = [
  {
    slot: "love_1",
    label: "Love",
    title: "The Secret History",
    author: "Donna Tartt",
    why: "The prose is so beautiful it makes me forget I'm reading about terrible people.",
  },
  {
    slot: "love_2",
    label: "Love",
    title: "East of Eden",
    author: "John Steinbeck",
    why: "I think about so many quotes in this book all the time",
  },
  {
    slot: "hate",
    label: "Hate",
    title: "Atlas Shrugged",
    author: "Ayn Rand",
    why: "a 1,200-page argument that empathy is weakness boo",
  },
  {
    slot: "conflicted",
    label: "Conflicted",
    title: "Normal People",
    author: "Sally Rooney",
    why: "beautiful writing that evoked horrible feelings in me, I think I started to cry at the third miscommunication trope",
  },
  {
    slot: "live_in",
    label: "Live in",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    why: "this book introduced me to second breakfast, now I crave bread and butter just as much as Bilbo Baggins",
  },
  {
    slot: "childhood_memory",
    label: "Childhood",
    title: "The Witches",
    author: "Roald Dahl",
    why: "started my love for horror, and was probably the first type of media I ever consumed that made me feel fear",
  },
];

const sampleActualAnswers: TraitAnswers = {
  socialEnergy: "Introverted",
  birthOrder: "Eldest",
  lifePerspective: "Optimistic",
  reasoningStyle: "Emotional",
  personalityType: "Type B",
  outsidePreference: "Mountain",
  tastePreference: "Savory",
  favoriteSeason: "Autumn",
  zodiacSign: "Pisces",
};

const emptyTraitAnswers = createEmptyTraitAnswers(othersTraitQuestions);

export function LandingScreen({
  onCreateAccount,
  onLogIn,
  onOpenLegalPage,
}: {
  onCreateAccount: () => void;
  onLogIn: () => void;
  onOpenLegalPage: (page: LegalPage) => void;
}) {
  const [traitAnswers, setTraitAnswers] = useState(emptyTraitAnswers);
  const [submitted, setSubmitted] = useState(false);

  const allTraitsAnswered = hasAllTraitAnswers(
    traitAnswers,
    othersTraitQuestions,
  );

  const handleSubmit = () => {
    if (allTraitsAnswered) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setTraitAnswers(emptyTraitAnswers);
    setSubmitted(false);
  };

  return (
    <View style={styles.appShell}>
      <View style={styles.topBar}>
        <View style={styles.landingTopBarRow}>
          <View style={styles.brandRow}>
            <BrandLogo />
            <Text style={styles.tagline}>
              What do six books say about a person?
            </Text>
          </View>
          <View style={styles.landingActions}>
            <Button variant="secondary" onPress={onCreateAccount}>
              Create account
            </Button>
            <Button variant="secondary" onPress={onLogIn}>
              Log in
            </Button>
          </View>
        </View>
      </View>

      <ScrollView
        nativeID="app-scroll"
        style={styles.content}
        contentContainerStyle={styles.landingContainer}
      >
        <View style={styles.landingSteps}>
          {steps.map((step, index) => (
            <View key={index} style={styles.landingStep}>
              <Image
                accessibilityIgnoresInvertColors
                source={step.icon}
                style={styles.landingStepIcon}
              />
              <Text style={styles.landingStepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.landingDemo}>
          <ScreenHeader
            title="Try it out"
            body="read this sample shelf, then guess who this person is"
          />

          <View style={styles.list}>
            {sampleBooks.map((book) => (
              <BookRow key={book.slot} book={book} grid />
            ))}
          </View>

          {!submitted ? (
            <>
              <View style={styles.section}>
                <SectionHeader title="What does this shelf make you suspect?" />
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
              </View>
              <View style={styles.readFooterActions}>
                <Button disabled={!allTraitsAnswered} onPress={handleSubmit}>
                  Submit
                </Button>
              </View>
            </>
          ) : (
            <>
              <ScreenHeader
                title="How your read compared"
                body="here is what they actually said about themselves"
              />
              <View style={styles.list}>
                {othersTraitQuestions.map((question) => {
                  const guessed = traitAnswers[question.key] ?? "";
                  const actual = sampleActualAnswers[question.key] ?? "";
                  const matched = guessed === actual;

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
                            tintedPillStyle(guessed),
                            tintedTextStyle(guessed),
                          ]}
                        >
                          {guessed}
                        </Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Them</Text>
                        <Text
                          style={[
                            styles.chip,
                            tintedPillStyle(actual),
                            tintedTextStyle(actual),
                          ]}
                        >
                          {actual}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={styles.readFooterActions}>
                <Button variant="secondary" onPress={handleReset}>
                  Try again
                </Button>
                <Button onPress={onCreateAccount}>Create account</Button>
              </View>
            </>
          )}
        </View>

        <View style={styles.landingFooter}>
          <View style={styles.legalLinkRow}>
            <Text
              accessibilityRole="link"
              onPress={() => onOpenLegalPage("privacy")}
              style={styles.inlineLink}
            >
              Privacy Policy
            </Text>
            <Text
              accessibilityRole="link"
              onPress={() => onOpenLegalPage("terms")}
              style={styles.inlineLink}
            >
              Terms of Service
            </Text>
            <Text
              accessibilityRole="link"
              onPress={() => onOpenLegalPage("community")}
              style={styles.inlineLink}
            >
              Community Guidelines
            </Text>
          </View>
          <DeveloperCredit />
        </View>
      </ScrollView>
    </View>
  );
}
