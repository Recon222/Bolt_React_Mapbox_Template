/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'map-primary': 'hsl(215, 80%, 55%)',
        'map-muted': 'hsl(215, 15%, 95%)',
        'map-overlay': 'hsl(0, 0%, 100%, 0.9)'
      },
      boxShadow: {
        'map-control': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'map-marker': '0 4px 12px rgba(0, 0, 0, 0.25)'
      },
      cursor: {
        'map-drag': 'grabbing',
        'map-draw': 'crosshair'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
