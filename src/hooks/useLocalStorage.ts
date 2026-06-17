import { useEffect, useState } from 'react'

const LOCAL_STORAGE_SYNC_EVENT = 'station-local-storage-sync'

type LocalStorageSyncDetail = {
  key: string
  value: string
}

function readStoredValue<T>(key: string, initialValue: T) {
  if (typeof window === 'undefined') {
    return initialValue
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return initialValue
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue))

  useEffect(() => {
    const serialized = JSON.stringify(value)
    window.localStorage.setItem(key, serialized)
    window.dispatchEvent(new CustomEvent<LocalStorageSyncDetail>(LOCAL_STORAGE_SYNC_EVENT, { detail: { key, value: serialized } }))
  }, [key, value])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== key || !event.newValue) {
        return
      }

      const nextValue = event.newValue
      setValue((current) => {
        if (JSON.stringify(current) === nextValue) {
          return current
        }

        try {
          return JSON.parse(nextValue) as T
        } catch {
          return current
        }
      })
    }

    function handleLocalSync(event: Event) {
      const { detail } = event as CustomEvent<LocalStorageSyncDetail>
      if (detail.key !== key) {
        return
      }

      setValue((current) => {
        if (JSON.stringify(current) === detail.value) {
          return current
        }

        try {
          return JSON.parse(detail.value) as T
        } catch {
          return current
        }
      })
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(LOCAL_STORAGE_SYNC_EVENT, handleLocalSync)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(LOCAL_STORAGE_SYNC_EVENT, handleLocalSync)
    }
  }, [key])

  return [value, setValue] as const
}
