export interface LegalSection {
  title: string;
  body: string[];
}

export const PRIVACY_POLICY_EFFECTIVE_DATE = '20 September 2026';

// Single source of truth for the Privacy Policy, rendered in-app
// (PrivacyPolicyScreen in both apps) and published as docs/PRIVACY_POLICY.md
// for App Store Connect / Google Play Console, which both require a public
// URL to a privacy policy before an app can be submitted for review.
export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    title: '1. Introduction',
    body: [
      "droppd (\"we\", \"us\", \"our\") operates the droppd Customer and droppd Driver mobile applications, providing package pickup and delivery services in Nigeria. This Privacy Policy explains what personal data we collect, why, and the rights you have over it under the Nigeria Data Protection Act, 2023 (NDPA) and the regulations of the Nigeria Data Protection Commission (NDPC).",
    ],
  },
  {
    title: '2. Information We Collect',
    body: [
      'Account information: full name, email address, phone number, and a password or one-time passcode used to verify your identity.',
      'Location data: your device’s precise location, used to set pickup and drop-off points and, for drivers, to share live position with customers during an active delivery.',
      'Delivery data: pickup and drop-off addresses, package details you provide, delivery confirmation codes, and order history.',
      'Payment data: we do not store your card or bank details. Payments are processed by licensed Nigerian payment processors (e.g. Paystack, Flutterwave); we retain only transaction references and amounts.',
      'Device data: device model, operating system version, and a push-notification token used to deliver order updates.',
      'Usage data: how you interact with the app, for reliability and fraud prevention.',
    ],
  },
  {
    title: '3. How We Use Your Information',
    body: [
      'To create and manage your account and verify your identity.',
      'To match customers with nearby drivers, calculate delivery fees in Naira (NGN), and route deliveries.',
      'To send push notifications about order status, driver arrival, and account activity.',
      'To process payments and wallet top-ups through our licensed payment partners.',
      'To investigate fraud, abuse, or safety incidents, and to comply with Nigerian law.',
    ],
  },
  {
    title: '4. Location Data',
    body: [
      'The Home screen’s map requests access to your device location to suggest a pickup point and show nearby drivers. You can decline this and enter an address manually. During an active delivery, a driver’s live location is shared with the customer on that order only, and stops being shared once the delivery is marked complete.',
    ],
  },
  {
    title: '5. Push Notifications',
    body: [
      'With your permission, we send push notifications for order placed, driver assigned, driver arriving, and delivery confirmed events, and for promotional messages you can opt out of at any time in Settings.',
    ],
  },
  {
    title: '6. Data Sharing',
    body: [
      'With the other party to your delivery (e.g. a customer’s pickup address and delivery code is shared with the assigned driver, and a driver’s name, photo, vehicle and live location is shared with the customer).',
      'With payment processors licensed by the Central Bank of Nigeria, solely to complete transactions.',
      'With cloud infrastructure and push-notification providers who process data on our behalf under contract.',
      'With Nigerian regulators or law enforcement where required by law.',
      'We do not sell your personal data.',
    ],
  },
  {
    title: '7. Data Retention',
    body: [
      'We retain account data for as long as your account is active. Completed transaction records may be retained for up to 7 years in de-identified form where required by Nigerian tax and financial-services regulation, even after account deletion.',
    ],
  },
  {
    title: '8. Your Rights',
    body: [
      'Under the NDPA you may access, correct, or request deletion of your personal data, object to certain processing, and request a copy of your data in a portable format.',
      'You can delete your account at any time from Profile → Delete Account in either app. This immediately deletes your profile, saved addresses, payment method references, and order history, subject to the retention note in Section 7.',
      'To exercise any other right, contact privacy@droppd.ng.',
    ],
  },
  {
    title: '9. Data Security',
    body: [
      'We use encryption in transit (TLS) and at rest for sensitive fields, role-based access controls, and regular security reviews. No system is completely secure, and we encourage you to use a strong, unique password.',
    ],
  },
  {
    title: '10. Children’s Privacy',
    body: [
      'droppd is not directed at children under 18. We do not knowingly collect data from children. If you believe a child has provided us data, contact us and we will delete it.',
    ],
  },
  {
    title: '11. Changes to This Policy',
    body: [
      'We may update this policy as our services evolve or Nigerian data protection law changes. Material changes will be notified in-app before they take effect.',
    ],
  },
  {
    title: '12. Contact Us',
    body: [
      'droppd Technologies Ltd, Lagos, Nigeria.',
      'Email: privacy@droppd.ng',
      'Data Protection Officer: dpo@droppd.ng',
    ],
  },
];
