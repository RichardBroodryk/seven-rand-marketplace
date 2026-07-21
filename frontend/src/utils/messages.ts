// Human-centred messages for the platform

export const messages = {
  // Errors (friendly version)
  errors: {
    general: "Let's fix that. Something went wrong, but we're on it.",
    notFound: "We couldn't find what you're looking for. Want to try again?",
    network: "We're having trouble connecting. Please check your internet and try again.",
    server: "Our servers are taking a moment. Please try again shortly.",
    auth: {
      login: "We couldn't sign you in. Double-check your email and password.",
      register: "We couldn't create your account. Please fill in all the fields.",
      token: "Your session has expired. Let's sign you in again.",
    },
    listing: {
      create: "We couldn't create your listing. Let's check the details.",
      update: "We couldn't update your listing. Want to try again?",
      delete: "We couldn't delete your listing. Let's try that again.",
    },
    payment: {
      failed: "Your payment didn't go through this time. Would you like to try again?",
      processing: "We're processing your payment. This should only take a moment.",
    },
  },

  // Success messages
  success: {
    listing: {
      create: "Your listing is ready! Now let's get it published.",
      update: "Your listing has been updated!",
      delete: "Your listing has been removed.",
      publish: "Your listing is now live!",
    },
    payment: {
      complete: "Payment successful! Your listing is now published.",
    },
    auth: {
      register: "Welcome! You're all set to start buying and selling.",
      login: "Great to see you again!",
    },
  },

  // Trust messages
  trust: {
    verified: "This seller has been verified. Trust is confirmed.",
    pending: "Verification in progress. Trust is being built.",
    unverified: "This seller has not been verified yet. Verify before transacting.",
    shield: "Seven Shield protects every transaction on this platform.",
    safeContact: "Safe Verified Contact gives you peace of mind.",
  },

  // Friendly prompts
  prompts: {
    empty: "Nothing here yet. Want to be the first?",
    noResults: "We didn't find anything. Try adjusting your search.",
    login: "Hey there! Sign in to post an ad or manage your listings.",
    register: "Join us! Create an account and start buying and selling with trust.",
    postAd: "Ready to sell? Post your first ad and reach trusted buyers.",
  },
};