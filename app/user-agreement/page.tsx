"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const sections = [
  {
    id: "user-agreement",
    title: "User Agreement",
    description:
      "sayitLPU is an anonymous confession platform for students to safely share thoughts, experiences, and emotions. By using the platform you agree to the following terms.",
    content: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <p>
          sayitLPU protects your anonymity and creates a comfortable space for honest
          expression. Accessing or using the platform means you accept these terms:
        </p>

        <ol className="list-decimal list-inside space-y-4 text-gray-200">
          <li>
            <span className="font-semibold">Confidentiality &amp; Anonymity</span>
            <p className="text-gray-400">
              Confessions are anonymous. Users must never attempt to identify, expose,
              or harass authors. Any action that compromises anonymity results in
              immediate enforcement.
            </p>
          </li>
          <li>
            <span className="font-semibold">Respectful Behaviour</span>
            <p className="text-gray-400">
              Engage respectfully, avoid hate speech, bullying, harassment, or abusive
              comments. Violations may lead to suspension or permanent bans.
            </p>
          </li>
          <li>
            <span className="font-semibold">Allowed &amp; Prohibited Content</span>
            <p className="text-gray-400">
              Follow all legal and ethical guidelines. Prohibited content includes
              threats, violence, self-harm, illegal activities, explicit sexual content,
              personal attacks, naming real individuals, or sharing private information.
            </p>
          </li>
          <li>
            <span className="font-semibold">Content Ownership</span>
            <p className="text-gray-400">
              You retain ownership of your confessions. Posting grants sayitLPU a
              non-exclusive, worldwide, royalty-free license to display and process your
              content solely to operate and improve the platform.
            </p>
          </li>
          <li>
            <span className="font-semibold">Security &amp; Safety</span>
            <p className="text-gray-400">
              Report suspicious activity and never attempt to hack, exploit, or bypass
              security. Misuse results in immediate termination.
            </p>
          </li>
          <li>
            <span className="font-semibold">User Responsibility</span>
            <p className="text-gray-400">
              Use sayitLPU responsibly. No impersonation, spamming, feature manipulation,
              or creating multiple accounts for abuse.
            </p>
          </li>
          <li>
            <span className="font-semibold">Account Suspension &amp; Termination</span>
            <p className="text-gray-400">
              We may suspend or ban accounts that violate guidelines and remove harmful or
              illegal content to keep the community safe.
            </p>
          </li>
          <li>
            <span className="font-semibold">Updates to the Agreement</span>
            <p className="text-gray-400">
              sayitLPU may update this agreement at any time. Continued use after updates
              means you accept the revised terms.
            </p>
          </li>
        </ol>

        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-gray-200">
          <p className="font-semibold mb-2">Thank You</p>
          <p className="text-gray-400">
            Thank you for being part of sayitLPU. Share honestly while helping us maintain
            a respectful and safe community. Contact us with any questions or concerns.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    description: "Your privacy matters. sayitLPU keeps your identity and data safe.",
    content: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <p>
          sayitLPU is designed as a safe, anonymous platform for students. This policy
          explains how we collect, store, protect, and use information.
        </p>

        <div>
          <h3 className="font-semibold text-gray-100">1. Information We Collect</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              <span className="font-medium text-gray-200">Confessions &amp; Content:</span>{" "}
              Confessions, posts, messages, or images are securely stored.
            </li>
            <li>
              <span className="font-medium text-gray-200">Account Info:</span> Email,
              password (stored hashed), verification data.
            </li>
            <li>
              <span className="font-medium text-gray-200">Device &amp; Usage Data:</span>{" "}
              Device type, browser/app version, likes, comments, reports—never linked to
              identity.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">2. How We Use the Information</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Enable posting, browsing, moderation, and account verification.</li>
            <li>Improve performance, ranking, and spam-prevention systems.</li>
            <li>Remove harmful or abusive content and enforce policies.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">3. Information Sharing</h3>
          <p className="text-gray-400">
            Confessions stay anonymous. We do not sell or share your identity.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              <span className="font-medium text-gray-200">Service Providers:</span> Cloud
              storage, analytics, or email vendors operate under confidentiality and
              cannot reuse your data.
            </li>
            <li>
              <span className="font-medium text-gray-200">Legal:</span> Minimal information
              may be disclosed if required by law (e.g., court orders).
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">4. Security</h3>
          <p className="text-gray-400">
            Encrypted databases, regular audits, and bcrypt-hashed passwords protect your
            data.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">5. Your Rights</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Update account info or request deletion.</li>
            <li>Request removal of confessions via support.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">6. Changes</h3>
          <p className="text-gray-400">
            We may update this policy to meet regulations or add features. Continued use
            means you accept the changes.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">7. Contact</h3>
          <p className="text-gray-400">
            Reach out via the in-app Contact form for questions or privacy requests.
          </p>
        </div>

        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-gray-200">
          Your privacy and safety are our top priorities. Thank you for trusting sayitLPU.
        </div>
      </div>
    ),
  },
  {
    id: "community-guidelines",
    title: "Community Guidelines",
    description:
      "Rules that keep sayitLPU safe, respectful, and anonymous. Violations may lead to removal or bans.",
    content: (
      <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
        <p>
          Follow these rules to keep sayitLPU welcoming. Any violating content may be
          removed without notice.
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-200">
          <li>Posts must be genuine confessions or honest thoughts.</li>
          <li>No hate speech, harassment, or targeting individuals/groups.</li>
          <li>No misinformation regarding health, politics, or public safety.</li>
          <li>No trolling, memes, spam, or low-effort content.</li>
          <li>No clickbait titles or misleading posts.</li>
          <li>No sharing personal information (doxxing) of real people.</li>
          <li>No impersonation or fake accounts.</li>
          <li>No violence, threats, or promotion of self-harm.</li>
          <li>No child abuse or exploitation content whatsoever.</li>
          <li>No animal abuse content.</li>
          <li>Respect copyrights; do not post content you do not own.</li>
          <li>No self-promotion, advertising, or social media plugs.</li>
          <li>No crowdfunding, donation, or financial requests.</li>
          <li>
            Moderators may remove harmful content and ban repeat offenders. Users can
            appeal through the Contact page.
          </li>
        </ol>
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-gray-200">
          Your privacy, safety, and anonymity matter. Follow these rules to keep sayitLPU a
          supportive space.
        </div>
      </div>
    ),
  },
  {
    id: "moderator-code",
    title: "Moderator Code Of Conduct",
    description: "Guidelines for moderators who maintain the safety of sayitLPU.",
    content: (
      <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
        <p>
          Moderators safeguard the community. The following principles ensure fair,
          respectful moderation:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>
            <span className="text-gray-200 font-medium">Impartiality:</span> Treat all
            users fairly without bias or favoritism.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Respectful Communication:</span>{" "}
            Handle every interaction professionally, even during disputes.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Privacy &amp; Confidentiality:</span>{" "}
            Respect anonymity and never share user information outside the team.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Non-Discrimination:</span> Zero
            tolerance for discrimination based on race, gender, religion, or identity.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Professionalism &amp; Transparency:</span>{" "}
            Communicate the reason for moderation actions when appropriate.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Consistency:</span> Apply rules
            uniformly and consult teammates when in doubt.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Responsiveness:</span> Reply to
            user concerns promptly and helpfully.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Continuous Learning:</span> Stay
            updated on policy changes and moderation best practices.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Team Collaboration:</span> Support
            fellow moderators and maintain a positive internal environment.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Conflict Resolution:</span> Focus
            on calm, fair solutions and escalate to senior moderators if needed.
          </li>
          <li>
            <span className="text-gray-200 font-medium">Accountability:</span> Own up to
            mistakes, welcome feedback, and keep improving.
          </li>
        </ul>
        <p className="text-gray-300">
          Thank you for helping maintain the integrity, safety, and kindness of sayitLPU.
        </p>
      </div>
    ),
  },
]

export default function UserAgreementPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const current = sections.find((section) => section.id === activeSection) ?? sections[0]

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[280px,1fr]">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-0">
            <nav className="flex flex-col">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-left px-4 py-4 border-b border-gray-800 transition-colors ${
                    activeSection === section.id
                      ? "bg-black text-white font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">{current.title}</p>
              <h1 className="text-3xl font-bold text-white mt-1">{current.title}</h1>
              <p className="text-gray-400 mt-3 text-sm">{current.description}</p>
            </div>
            {current.content}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


