export const categories = {
  browsers: { name: 'Web Browsers', icon: 'Globe' },
  media: { name: 'Media & Entertainment', icon: 'PlayCircle' },
  development: { name: 'Development Tools', icon: 'Code' },
  utilities: { name: 'Utilities', icon: 'Wrench' },
  security: { name: 'Security & Privacy', icon: 'Shield' },
  communication: { name: 'Communication', icon: 'MessageSquare' },
  design: { name: 'Design & Creative', icon: 'Palette' },
  gaming: { name: 'Gaming', icon: 'Gamepad2' },
} as const;

export type Category = keyof typeof categories;
