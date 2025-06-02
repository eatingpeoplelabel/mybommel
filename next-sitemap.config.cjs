/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://mybommel.com',
    generateRobotsTxt: true,
    exclude: ['/test-supabase'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        }
      ]
    }
  }
  