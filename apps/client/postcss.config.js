module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
      // Completely disable autoprefixer warnings
      add: false,
      remove: false,
      ignoreUnknownVersions: true,
    },
  },
}
