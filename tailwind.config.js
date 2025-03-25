// ... existing imports and config
module.exports = {
  // ... other config
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      // Add smooth scrolling configuration
      animation: {
        'smooth-scroll': 'smooth-scroll 1s ease-in-out',
      },
      keyframes: {
        'smooth-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(var(--scroll-y, 0))' },
        },
      },
      // ... other theme extensions
    },
  },
  plugins: [
    // Add a plugin for smooth scrolling behavior
    function({ addBase }) {
      addBase({
        'html': {
          scrollBehavior: 'smooth',
        },
      });
    },
    // ... other plugins
  ],
  // ... plugins, etc.
}