# Contact form

The form in `src/components/ContactSection.tsx` opens a compose window. It does not send email itself. Its recipient is the email address already present in the portfolio: `vasanthakumar141099@gmail.com`.

## Visitor flow

1. Enter Name, Email, Subject, and Message in Contact.
2. Click **Send Message**. Validation completes before any compose window opens.
3. A pre-filled Gmail compose draft opens in a new tab or window. Sign in if needed, review the draft, and press Send in Gmail.
4. If the browser blocks the Gmail popup, the form requests the configured email app through `mailto:`. **Use email app** explicitly chooses this handler; **Open Gmail** retries Gmail. The website cannot detect whether a default mail app is configured.

The visible **Open Gmail** and **Use email app** controls also validate the current form values before opening a draft. Use **Open Gmail** if no desktop email app is configured, or **Use email app** to choose your normal mail application. Browser and operating-system settings determine which application handles `mailto:` URLs; the website cannot reliably detect that configuration.

Status messages explain the compose step and ask the visitor to send the message. They never claim delivery. Values remain in the form after opening the draft so a visitor can edit or retry. The entered address is included in the message body; the visitor's signed-in email account determines the email's actual From address.

## Validation and draft contents

All fields are required and trimmed before validation and draft creation:

| Field | Validation |
| --- | --- |
| Name | 2–120 characters |
| Email | Valid email format, up to 254 characters |
| Subject | Nonempty, up to 200 characters, no line breaks |
| Message | 10–5,000 characters |

Whitespace-only values are rejected. Field errors are associated with their inputs and announced accessibly, and the first invalid input receives focus. The submit button shows **Opening email...** while opening a draft and during a short 1.5-second cooldown to prevent rapid duplicate windows.

The draft's subject is the entered subject. Its body uses this exact layout:

```text
Name: [visitor name]
Email: [visitor email]

Message:
[visitor message]
```

Both compose links use the fixed portfolio recipient and encode the subject and body as URL parameters; Gmail also encodes its recipient parameter. Special characters such as `&`, `+`, `?`, `#`, Unicode, and message line breaks must remain part of the draft instead of changing its URL. A Gmail tab's opener is cleared before navigation.

## Configuration and limits

No backend or email service configuration is needed for GitHub Pages. Do not add passwords, API keys, SMTP credentials, or EmailJS settings. The only email address in the compose logic is the existing public contact recipient.

The opening guard and cooldown control duplicate clicks. There is no remote submission endpoint to protect with a honeypot; this is not server-side spam prevention. The website cannot confirm that an external client opened successfully, that a visitor clicked Send, or that a message was delivered. Gmail sign-in, mail handler configuration, popup rules, and any client-specific URL length limits remain outside the website's control.

## Verification

Run the code checks:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

At `http://localhost:4173/portfolio-site/`, check the following at mobile, tablet, and desktop widths:

- Submit all-empty and whitespace-only values: field errors appear; no draft opens.
- Enter an invalid email, a blank subject, or a short message: the correct error appears and focus moves to the first invalid field.
- Submit valid values: the Gmail draft has the existing recipient, entered subject, and the exact body layout above; the form values remain and the site makes no delivery claim. **Use email app** must populate the same fields in its mailto draft.
- Use a subject such as `Project & collaboration + café? #1` and a multiline message containing `&`, `+`, `?`, `#`, and Unicode: both Gmail and the email app preserve the text.
- Block popups and choose **Open Gmail** with valid values: the email app fallback is attempted and remains visibly available.
- Click **Open Gmail** and **Use email app** after editing the draft: both use the latest validated values.
- Double-click submit: a single draft attempt is made during the cooldown; another attempt is possible afterward.
- Use the form entirely by keyboard and verify labels, errors, status announcements, visible focus, and fallback buttons.
- At mobile, tablet, and desktop widths, ensure inputs, textarea, errors, and buttons stay usable without horizontal overflow.

Automated checks verify validation and URL construction without sending email. A real email-client check requires a configured handler or a Gmail account, and email delivery still requires the visitor to press Send. The optional browser audit writes its results to the ignored `audit-artifacts/browser-audit.json` file.
