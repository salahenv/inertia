const withPWA = require('next-pwa')({
    dest: 'public', // Output directory for service worker files
    // disable: process.env.NODE_ENV === 'development', // Disable in development mode
  });
  
  module.exports = withPWA({
    // Other Next.js config options
  });