/**
 * Component-specific content
 */
export const componentContent = {
  buttons: {
    primary: 'Continue',
    secondary: 'Cancel',
    loading: 'Loading...',
    submit: 'Submit',
    close: 'Close',
    back: 'Go Back',
    next: 'Next',
    previous: 'Previous',
  },
  links: {
    learnMore: 'Learn More',
    readMore: 'Read More',
    viewAll: 'View All',
    seeDetails: 'See Details',
    external: 'External Link',
  },
  forms: {
    required: 'Required field',
    optional: 'Optional',
    placeholder: {
      name: 'Your name',
      email: 'your@email.com',
      message: 'Your message...',
      search: 'Search...',
    },
    validation: {
      email: 'Please enter a valid email address',
      required: 'This field is required',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be no more than {max} characters',
    },
  },
  media: {
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    volume: 'Volume',
  },
  social: {
    follow: 'Follow',
    share: 'Share',
    like: 'Like',
    comment: 'Comment',
  },
} as const
