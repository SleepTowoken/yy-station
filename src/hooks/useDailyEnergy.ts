import { petMessages } from '../constants/messages'
import type { EnergySource } from '../types/app'
import { useLocalStorage } from './useLocalStorage'

type DailyEnergyState = {
  date: string
  sources: EnergySource[]
}

const todayKey = () => new Date().toISOString().slice(0, 10)

export function useDailyEnergy() {
  const [beans, setBeans] = useLocalStorage('station_energy_beans', 0)
  const [dailySources, setDailySources] = useLocalStorage<DailyEnergyState>('station_daily_energy_sources', {
    date: todayKey(),
    sources: [],
  })

  const normalizedSources = dailySources.date === todayKey() ? dailySources.sources : []

  function awardEnergy(source: EnergySource) {
    if (normalizedSources.includes(source)) {
      if (dailySources.date !== todayKey()) {
        setDailySources({ date: todayKey(), sources: [] })
      }
      return { awarded: false, message: petMessages.duplicate }
    }

    setBeans((current) => current + 1)
    setDailySources({ date: todayKey(), sources: [...normalizedSources, source] })
    return { awarded: true, message: petMessages.gained }
  }

  function spendBean() {
    if (beans < 1) {
      return false
    }

    setBeans((current) => Math.max(0, current - 1))
    return true
  }

  return {
    beans,
    dailySources: normalizedSources,
    awardEnergy,
    spendBean,
  }
}
