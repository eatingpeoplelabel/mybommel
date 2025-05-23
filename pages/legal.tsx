import Head from 'next/head'
import Link from 'next/link'

export default function Legal() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 px-6 py-12 text-gray-800 font-sans">
      <Head>
        <title>Legal & Fluffformation</title>
        <meta name="description" content="Legal notice for the Bommelverse" />
      </Head>

      <div className="max-w-3xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-purple-200">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-4">✨ Legal & Fluffformation ✨</h1>

        <article className="prose prose-purple max-w-none">
          <h2>Impressum & Legal Fluff</h2>
          <p>Welcome to the official website of the Bommelverse!</p>

          <p>This site is operated in accordance with § 5 TMG by:</p>
          <address>
            <strong>Anika Schnabel</strong><br />
            Martin-Wohmann Str. 7<br />
            65719 Hofheim<br />
            Germany<br />
            <a href="mailto:info@bebetta.de">info@bebetta.de</a>
          </address>

          <p><strong>VAT ID:</strong> DE281675104</p>
          <p><strong>Responsible for content according to § 55 Abs. 2 RStV:</strong> Anika Schnabel</p>

          <p>
            We are not obliged or willing to participate in dispute resolution proceedings before a consumer arbitration board (unless the board speaks Fluffish).
          </p>

          <h3>Legal Notes</h3>
          <p>
            We do not sell products directly on this website. This site exists purely for entertainment and celebration of Bommels and their interfluffin' vibes (and maybe, just maybe, the occasional secret mission to spread fluffiness across the globe).
          </p>

          <h3>Links</h3>
          <p>
            This website may contain links to external third-party websites. We have no influence on the content of those websites and therefore cannot accept any liability for external content. If you find something questionable, let us know and we'll de-fluff it immediately with a sprinkle of glitter justice.
          </p>

          <h3>Copyright</h3>
          <p>
            All content on this site is protected by German copyright law. Unauthorized reproduction is strictly not fluffy. Offenders may be sentenced to a day without sparkle.
          </p>

          <h3>SoundCloud</h3>
          <p>
            We love SoundCloud and might include Bommels with boogie beats in the future. So, SoundCloud plugins may be used. Some Bommels have been known to communicate exclusively via basslines.
          </p>

          <h3>Privacy</h3>
          <p>
            We collect minimal data necessary to ensure the proper display of the site and to register your Bommels. We don't sell your data. Ever. Your Bommels are safe with us—even the introverted ones.
          </p>
          <p>
            If you register a Bommel, we store your submission (name, birthday, fluff level, location etc.) for the purpose of displaying it on the map and in the Bommel Gallery. You may request removal of your Bommel at any time by contacting us.
          </p>
          <p>
            Some cookies may be used to enhance fluffiness. If you're allergic to cookies (or glitter), let us know.
          </p>

          <p>
            Also: If you read this far, you might already be an honorary Fluff Keeper. Welcome.
          </p>
        </article>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-full shadow-md">
            ← Back to Fluff
          </Link>
        </div>
      </div>
    </main>
  )
}