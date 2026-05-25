import { Pressable, Text, View } from "react-native";

import { Button } from "../components/Button";
import { ScreenHeader } from "../components/ScreenHeader";
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
    body: "how your account information is collected, used, and protected",
    updated: lastUpdated,
    sections: [
      {
        title: "Information we collect",
        body: [
          "When you create an account, Annotary collects your email address, username, password credentials handled by Supabase Auth, bookshelf entries, profile answers, selected adjectives, profile reports, skips, removals, and account status information.",
          "Supabase may store authentication/session information on your device so you can stay logged in between visits. You can clear this by logging out or clearing your browser/app storage.",
          "Other users may see your bookshelf entries and may submit anonymous impressions about your shelf. Your email address and password are not shown to other users.",
        ],
      },
      {
        title: "How we use information",
        body: [
          "We use your information to create and secure your account, show your shelf to other users, let users describe shelves, display aggregate impressions, moderate abuse, respond to reports, and operate the app.",
          "We do not sell your personal information.",
        ],
      },
      {
        title: "Service providers",
        body: [
          "Annotary uses third-party services to operate the app, including Supabase for authentication, database hosting, account management, and infrastructure; Vercel for hosting and deployment; and GitHub for code storage and development workflows.",
          "Your use of Annotary may depend on these providers. We are not responsible for outages, security incidents, policy changes, or other issues caused by third-party services outside our control.",
          "These providers may process information as needed to provide their services to Annotary, and their own terms and privacy policies may also apply.",
        ],
      },
      {
        title: "Deletion",
        body: [
          "You can request account deletion from Settings. Deletion removes your account, shelf, and profile. Anonymous reads you submitted may remain in aggregate results where they are no longer tied to your account.",
        ],
      },
      {
        title: "Age requirement",
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
          "Do not use bots, scrapers, crawlers, scripts, or other automated tools to collect information from Annotary or interact with the app without permission.",
          "Do not use automation to create accounts, submit reads, send reports, manipulate results, overload the app, evade moderation, or interfere with how Annotary works.",
        ],
      },
      {
        title: "Your account",
        body: [
          "You are responsible for the information you submit and for keeping your login details secure. You may not use Annotary to harm others.",
        ],
      },
      {
        title: "Your content",
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
        title: "No professional advice",
        body: [
          "Annotary is for entertainment and social reading. Impressions from other users are subjective and should not be treated as any sort of professional advice or diagnosis.",
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
    body: "what is not allowed in shelves, usernames, and descriptions",
    updated: lastUpdated,
    sections: [
      {
        title: "Be honest but not cruel",
        body: [
          "Negative opinions are allowed, but harassment, slurs, threats, targeted abuse, and excessive hate are not.",
        ],
      },
      {
        title: "Keep it appropriate",
        body: [
          "Do not post adult content, graphic content, explicit solicitation, or content that makes the app unsafe for younger users.",
        ],
      },
      {
        title: "No spam",
        body: [
          "Do not use usernames, shelf notes, or descriptions for excessive self-promotion, scams, spam, or solicitation.",
        ],
      },
      {
        title: "No plot spoilers",
        body: [
          "Do not include plot spoilers in shelf notes or descriptions so users can use the site without having stories spoiled.",
        ],
      },
      {
        title: "Reporting",
        body: [
          "Use the report feature when a profile breaks these guidelines. Reports help me moderate the site and may lead to moderation action.",
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
      <ScreenHeader
        title={content.title}
        body={content.body}
        accessory={
          <View style={styles.headerActionSlot}>
            {onBack && (
              <Button variant="secondary" onPress={onBack}>
                Back
              </Button>
            )}
          </View>
        }
      />
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
      <View style={styles.section}>
        <View style={styles.legalCompactList}>
          {content.sections.map((section, index) => (
            <View key={section.title} style={styles.legalCompactRow}>
              <Text style={styles.instructionsNumber}>{index + 1}.</Text>
              <View style={styles.legalCompactCopy}>
                <Text style={styles.legalCompactTitle}>{section.title}</Text>
                {section.body.map((paragraph) => (
                  <Text key={paragraph} style={styles.legalParagraph}>
                    {paragraph}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
