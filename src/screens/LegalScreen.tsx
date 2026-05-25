import { Pressable, Text, View } from "react-native";

import { Button } from "../components/Button";
import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import { styles } from "../styles";

export type LegalPage = "privacy" | "terms" | "community";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalContent = {
  title: string;
  body: string;
  updated: string;
  sections: LegalSection[];
};

const contactEmail = "mimibrews@gmail.com";
const lastUpdated = "May 25, 2026";

const legalContent: Record<LegalPage, LegalContent> = {
  privacy: {
    title: "Privacy Policy",
    body: "how Annotary collects, uses, and protects account and profile information",
    updated: lastUpdated,
    sections: [
      {
        title: "Information We Collect",
        body: [
          "When you create an account, Annotary collects your email address, username, password credentials handled by Supabase Auth, bookshelf entries, profile answers, selected adjectives, profile reports, skips, removals, and account status information.",
          "Other users may see your bookshelf entries and may submit anonymous impressions about your shelf. Your email address and password are not shown to other users.",
        ],
      },
      {
        title: "How We Use Information",
        body: [
          "We use your information to create and secure your account, show your shelf to other users, let users describe shelves, display aggregate impressions, moderate abuse, respond to reports, and operate the app.",
          "We do not sell your personal information.",
        ],
      },
      {
        title: "Service Providers",
        body: [
          "Annotary uses Supabase for authentication, database hosting, account management, and related infrastructure. Supabase processes data needed to provide those services.",
        ],
      },
      {
        title: "Deletion",
        body: [
          "You can request account deletion from Settings. Deletion removes your account, shelf, and profile. Anonymous reads you submitted may remain in aggregate results where they are no longer tied to your account.",
        ],
      },
      {
        title: "Age Requirement",
        body: [
          "Annotary is intended for people who are at least 16 years old. Do not create an account if you are under 16.",
        ],
      },
      {
        title: "Contact",
        body: [
          `For privacy questions or deletion help, contact ${contactEmail}.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    body: "the basic rules for using Annotary",
    updated: lastUpdated,
    sections: [
      {
        title: "Using Annotary",
        body: [
          "By creating an account or using Annotary, you agree to these terms. If you do not agree, do not use the app.",
          "You must be at least 16 years old to use Annotary.",
        ],
      },
      {
        title: "Your Account",
        body: [
          "You are responsible for the information you submit and for keeping your login details secure. You may not impersonate another person, create misleading usernames, or use Annotary to harm others.",
        ],
      },
      {
        title: "Your Content",
        body: [
          "You keep ownership of the shelf entries, notes, answers, and descriptions you submit. You give Annotary permission to store, display, moderate, and use that content to operate the app.",
          "Do not submit content you do not have the right to share.",
        ],
      },
      {
        title: "Moderation",
        body: [
          "We may remove content, hide profiles, suspend accounts, or permanently ban accounts that violate these terms, the Community Guidelines, or the spirit of the app.",
        ],
      },
      {
        title: "No Professional Advice",
        body: [
          "Annotary is for entertainment and social reading. Impressions from other users are subjective and should not be treated as professional, medical, psychological, legal, or financial advice.",
        ],
      },
      {
        title: "Changes",
        body: [
          "We may update these terms as the app changes. Continued use after an update means you accept the updated terms.",
        ],
      },
      {
        title: "Contact",
        body: [`Questions about these terms can be sent to ${contactEmail}.`],
      },
    ],
  },
  community: {
    title: "Community Guidelines",
    body: "what is and is not allowed in shelves, usernames, and descriptions",
    updated: lastUpdated,
    sections: [
      {
        title: "Be Honest, Not Cruel",
        body: [
          "Negative opinions are allowed, but harassment, slurs, threats, targeted abuse, and excessive hate are not allowed.",
        ],
      },
      {
        title: "Keep It Appropriate",
        body: [
          "Do not post adult content, graphic sexual content, explicit solicitation, or content that makes the app unsafe for younger users.",
        ],
      },
      {
        title: "No Spam",
        body: [
          "Do not use usernames, shelf notes, or descriptions for excessive self-promotion, scams, spam, or solicitation.",
        ],
      },
      {
        title: "No Plot Spoilers",
        body: [
          "Do not include plot spoilers in shelf notes or descriptions. Annotary works better when people can browse books without having stories spoiled.",
        ],
      },
      {
        title: "Reporting",
        body: [
          "Use the report feature when a profile breaks these guidelines. Reports help keep Annotary usable and may lead to moderation action.",
        ],
      },
      {
        title: "Consequences",
        body: [
          "Violations can result in removed content, hidden profiles, or permanent account bans without warning.",
        ],
      },
    ],
  },
};

export function LegalScreen({
  page,
  onBack,
  onOpenPage,
}: {
  page: LegalPage;
  onBack?: () => void;
  onOpenPage?: (page: LegalPage) => void;
}) {
  const content = legalContent[page];

  return (
    <View style={styles.screen}>
      {onBack && (
        <View style={styles.backActionRow}>
          <Button variant="secondary" onPress={onBack}>
            Back
          </Button>
        </View>
      )}
      <ScreenHeader title={content.title} body={content.body} />
      <Text style={styles.helperText}>Last updated: {content.updated}</Text>
      <View style={styles.legalLinkRow}>
        {(["privacy", "terms", "community"] as LegalPage[]).map((item) => (
          <Pressable
            key={item}
            onPress={() => onOpenPage?.(item)}
            style={[
              styles.legalLinkPill,
              item === page && styles.legalLinkPillActive,
            ]}
          >
            <Text
              style={[
                styles.legalLinkPillText,
                item === page && styles.legalLinkPillTextActive,
              ]}
            >
              {legalContent[item].title}
            </Text>
          </Pressable>
        ))}
      </View>
      {content.sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <SectionHeader title={section.title} />
          <View style={styles.legalSectionBody}>
            {section.body.map((paragraph) => (
              <Text key={paragraph} style={styles.sectionSubtitle}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
