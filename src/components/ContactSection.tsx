import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { env } from '../config/env'
import { socials } from '../data/content'
import { useTheme } from '../theme/useTheme'
import { SocialIcon } from './icons'
import { SectionHeading } from './SectionHeading'

type Status = 'idle' | 'sending' | 'success' | 'error'

function randomDigit() {
  return 1 + Math.floor(Math.random() * 8)
}

function useCaptcha() {
  const [a, setA] = useState(randomDigit)
  const [b, setB] = useState(randomDigit)
  const [answer, setAnswer] = useState('')

  function reroll() {
    setA(randomDigit())
    setB(randomDigit())
    setAnswer('')
  }

  const isCorrect = Number(answer) === a + b

  return { a, b, answer, setAnswer, isCorrect, reroll }
}

const inputClasses =
  'w-full rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-ink transition-theme duration-200 placeholder:text-ink-faint focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30'

/**
 * The contact form on the left, a grid of social links on the right. The
 * social grid fills column-first (grid-flow-col) rather than row-first, so
 * adding a social in content.ts grows the grid downward before it grows
 * sideways.
 */
export function ContactSection() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const captcha = useCaptcha()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (honeypot) {
      // A filled honeypot means a bot filled every field it could find.
      // Pretend it worked so the bot doesn't learn anything.
      setStatus('success')
      return
    }

    if (!captcha.isCorrect) {
      setErrorMessage('That answer is not quite right.')
      setStatus('error')
      captcha.reroll()
      return
    }

    setStatus('sending')
    setErrorMessage('')

    const payload = {
      email,
      message,
      theme,
      submittedAt: new Date().toISOString(),
    }

    const endpoint = env.contactEndpoint

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      } else {
        // No backend wired up yet — log the payload so the form is easy to
        // verify locally, and set VITE_CONTACT_ENDPOINT once one exists.
        console.info('Contact form payload (no VITE_CONTACT_ENDPOINT set):', payload)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setStatus('success')
      setEmail('')
      setMessage('')
      captcha.reroll()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
      captcha.reroll()
    }
  }

  return (
    <section id="contact" className="mb-16">
      <SectionHeading
        eyebrow={isDark ? '// contact.log' : 'Contact'}
        title={isDark ? 'Send a transmission' : 'Get in touch'}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <form
          onSubmit={handleSubmit}
          className="flex max-w-xl flex-col gap-4 rounded-xl border border-edge bg-surface-raised p-5 shadow-panel transition-theme duration-300"
        >
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's up?"
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Honeypot: hidden from real users, catnip for bots. */}
          <input
            type="text"
            name="company"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="contact-captcha" className="mb-1.5 block text-sm font-medium text-ink">
              What is {captcha.a} + {captcha.b}?
            </label>
            <input
              id="contact-captcha"
              type="text"
              inputMode="numeric"
              required
              value={captcha.answer}
              onChange={(e) => captcha.setAnswer(e.target.value)}
              placeholder="Your answer"
              className={`${inputClasses} max-w-[10rem]`}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className={`mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-theme duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              isDark
                ? 'bg-accent-primary text-surface shadow-glow-primary hover:brightness-110'
                : 'bg-ink text-surface hover:bg-ink/90'
            }`}
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          <AnimatePresence mode="wait">
            {status === 'success' && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-accent-ok"
              >
                Message sent — thanks, I'll get back to you soon.
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-accent-warn"
              >
                {errorMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        {socials.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-1 items-center justify-center rounded-xl border border-edge bg-surface-raised p-5 shadow-panel transition-theme duration-300">
              <div className="grid grid-flow-col grid-rows-5 gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    title={social.name}
                    aria-label={social.name}
                    className="group flex h-14 w-14 items-center justify-center rounded-lg border border-edge bg-surface text-ink-muted transition-theme duration-200 hover:border-accent-primary/60 hover:text-accent-primary hover:shadow-glow-primary"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
