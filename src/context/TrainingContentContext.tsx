import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import tapalTrainingVideo from '../assets/Tapal.mp4'

export type AssessmentQuestion = {
  id: string
  prompt: string
}

export type TrainingModule = {
  id: string
  title: string
  description: string
  videoName: string
  videoUrl: string
  questions: AssessmentQuestion[]
  createdAt: string
  /** Bundled with the app — always present, and cannot be removed from the training list. */
  builtin?: boolean
}

type TrainingContentContextValue = {
  modules: TrainingModule[]
  addModule: (
    module: Omit<TrainingModule, 'id' | 'createdAt'>,
    videoFile?: File,
  ) => TrainingModule
  removeModule: (id: string) => void
}

const TrainingContentContext = createContext<TrainingContentContextValue | null>(null)

/**
 * Shipped with the app (a real file in src/assets, bundled at build time), not an upload — so
 * it is there for every ambassador on every device, and survives a browser's storage being
 * cleared. It cannot be deleted from the Training content page.
 */
const BUILTIN_MODULE: TrainingModule = {
  id: 'tm-builtin-tapal',
  title: 'Tapal Tea knowledge',
  description: 'The official Tapal Tea introduction video every ambassador must watch.',
  videoName: 'Tapal.mp4',
  videoUrl: tapalTrainingVideo,
  questions: [
    {
      id: 'q-builtin-1',
      prompt: 'Aap tapal tea kay baray mai kia janta hain?',
    },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  builtin: true,
}

const seedModules: TrainingModule[] = [BUILTIN_MODULE]

/** Makes sure the built-in module is always in the list, using the bundled asset — never a stored copy. */
function withBuiltin(list: TrainingModule[]): TrainingModule[] {
  const rest = list.filter((m) => m.id !== BUILTIN_MODULE.id && !m.builtin)
  return [BUILTIN_MODULE, ...rest]
}

// ─── Persistence ─────────────────────────────────────────────────────────────
// Module text lives in localStorage; the video files live in IndexedDB. Together they let a
// training link opened in a new tab (or after a reload) still find the uploaded video.

const META_KEY = 'ba-training-modules-v1'
const DB_NAME = 'ba-training-videos'
const STORE = 'videos'

type StoredModule = Omit<TrainingModule, 'videoUrl'> & { hasVideo: boolean }

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const req = run(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const saveVideo = (id: string, file: Blob) => withStore('readwrite', (s) => s.put(file, id))
const loadVideo = (id: string) => withStore<Blob | undefined>('readonly', (s) => s.get(id))
const deleteVideo = (id: string) => withStore('readwrite', (s) => s.delete(id))

function readStoredModules(): StoredModule[] | null {
  try {
    const raw = localStorage.getItem(META_KEY)
    return raw ? (JSON.parse(raw) as StoredModule[]) : null
  } catch {
    return null
  }
}

export function TrainingContentProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<TrainingModule[]>(seedModules)
  const hydrated = useRef(false)

  useEffect(() => {
    let cancelled = false
    // the built-in module is never read from storage — only ones the user uploaded
    const stored = readStoredModules()?.filter((m) => !m.builtin && m.id !== BUILTIN_MODULE.id) ?? null
    if (!stored) {
      hydrated.current = true
      return
    }
    Promise.all(
      stored.map(async ({ hasVideo, ...m }): Promise<TrainingModule> => {
        let videoUrl = ''
        if (hasVideo) {
          try {
            const blob = await loadVideo(m.id)
            if (blob) videoUrl = URL.createObjectURL(blob)
          } catch {
            // video unavailable — the module still shows without it
          }
        }
        return { ...m, videoUrl }
      }),
    ).then((restored) => {
      if (cancelled) return
      hydrated.current = true
      setModules(withBuiltin(restored))
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      // the built-in module is bundled, not uploaded — don't persist it as if it were
      const meta: StoredModule[] = modules
        .filter((m) => !m.builtin)
        .map(({ videoUrl, ...m }) => ({ ...m, hasVideo: !!videoUrl }))
      localStorage.setItem(META_KEY, JSON.stringify(meta))
    } catch {
      // storage unavailable — modules stay in memory for this session
    }
  }, [modules])

  const addModule = useCallback(
    (module: Omit<TrainingModule, 'id' | 'createdAt'>, videoFile?: File) => {
      const next: TrainingModule = {
        ...module,
        id: `tm-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      if (videoFile) saveVideo(next.id, videoFile).catch(() => {})
      setModules((prev) => [next, ...prev])
      return next
    },
    [],
  )

  const removeModule = useCallback((id: string) => {
    setModules((prev) => {
      const target = prev.find((m) => m.id === id)
      if (!target || target.builtin) return prev // the built-in module can't be removed
      deleteVideo(id).catch(() => {})
      if (target.videoUrl) URL.revokeObjectURL(target.videoUrl)
      return prev.filter((m) => m.id !== id)
    })
  }, [])

  const value = useMemo(
    () => ({ modules, addModule, removeModule }),
    [modules, addModule, removeModule],
  )

  return (
    <TrainingContentContext.Provider value={value}>{children}</TrainingContentContext.Provider>
  )
}

export function useTrainingContent() {
  const ctx = useContext(TrainingContentContext)
  if (!ctx) throw new Error('useTrainingContent must be used within TrainingContentProvider')
  return ctx
}
