import { useEffect, useState } from 'react'
import { env } from '../config/env'

export interface PortainerStatus {
  status: boolean
  nodeCount: number
  stackCount: number
}

export type PortainerStatusState =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'ready'; data: PortainerStatus }

const POLL_INTERVAL_MS = 600_000

// The webhook responds with `[{ Status, Stacks, Nodes }]` — a one-element
// array of PascalCase fields, not the flat/camelCase shape you'd guess.
interface PortainerStatusPayload {
  Status?: boolean
  Nodes?: number
  Stacks?: number
}

/** Polls the Portainer status webhook (see VITE_PORTAINER_STATUS_ENDPOINT). */
export function usePortainerStatus(): PortainerStatusState {
  const [state, setState] = useState<PortainerStatusState>({ phase: 'loading' })

  useEffect(() => {
    const endpoint = env.portainerStatusEndpoint
    if (!endpoint) {
      setState({ phase: 'error', message: 'No portainer status endpoint configured' })
      return
    }

    let cancelled = false

    async function load() {
      try {
        const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        const raw = (await response.json()) as PortainerStatusPayload[] | PortainerStatusPayload
        const entry = Array.isArray(raw) ? raw[0] : raw
        if (cancelled) return
        setState({
          phase: 'ready',
          data: {
            status: Boolean(entry?.Status),
            nodeCount: Number(entry?.Nodes ?? 0),
            stackCount: Number(entry?.Stacks ?? 0),
          },
        })
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Unknown error' })
        }
      }
    }

    // Deferred to idle time so this third-party request never competes with
    // the initial paint — it's a "nice to have" status badge, not content.
    let idleHandle: number | undefined
    const scheduleIdle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout

    idleHandle = scheduleIdle(load as IdleRequestCallback)
    const interval = window.setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      if (idleHandle !== undefined) cancelIdle(idleHandle)
      window.clearInterval(interval)
    }
  }, [])

  return state
}
