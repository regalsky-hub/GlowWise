module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          sage: '#6B9E7F',
          'sage-light': '#D4E8DD',
          slate: '#2C3E50',
          cream: '#F5F3F0',
          taupe: '#A89968',
          charcoal: '#3D4A52',
          blush: '#E8DDD8',
          'blue-soft': '#B8D4E8',
          success: '#4CAF50',
          warning: '#F9A825',
          error: '#EF4444',
          neutral: '#D1D5DB',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': '40px',
        'h2': '28px',
        'h3': '20px',
        'body': '15px',
        'sm': '13px',
      },
      borderRadius: {
        'card': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in',
        'slideUp': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
