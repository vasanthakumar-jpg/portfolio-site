# EmailJS Setup Instructions

To enable the contact form to send emails, you need to set up EmailJS:

## 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Create a free account
- Verify your email address

## 2. Create Email Service
- In your EmailJS dashboard, go to "Email Services"
- Click "Add New Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the setup instructions for your provider

## 3. Create Email Template
- Go to "Email Templates"
- Click "Create New Template"
- Set up your template with these variables:
  ```
  From: {{from_name}} ({{from_email}})
  Subject: {{subject}}
  Message: {{message}}
  ```

## 4. Get Your Credentials
- **Service ID**: Found in your Email Services section
- **Template ID**: Found in your Email Templates section  
- **Public Key**: Found in Account > API Keys

## 5. Update the Code
In `src/components/ContactSection.tsx`, replace these placeholders:

```typescript
await emailjs.send(
  'service_your_id',     // Replace with your Service ID
  'template_your_id',    // Replace with your Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    to_name: 'Vasantha Kumar',
  },
  'your_public_key'      // Replace with your Public Key
);
```

## 6. Test Your Form
- Submit a test message through your contact form
- Check if the email is received in your inbox
- Verify all form fields are working correctly

That's it! Your contact form will now send real emails.