import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { BottomNav } from '../components/BottomNav'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FloatingPet } from '../components/FloatingPet'
import { useToast } from '../hooks/useToast'
import { useDailyEnergy } from '../hooks/useDailyEnergy'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { TabId } from '../types/app'
import { LittleSpark } from './LittleSpark'
import { OutfitToday } from './OutfitToday'
import { OwnRhythm } from './OwnRhythm'
import { TodayHeal } from './TodayHeal'

export function Home() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useLocalStorage<TabId>('station_last_tab', 'heal')
  const { beans, awardEnergy, spendBean } = useDailyEnergy()
  const { showToast } = useToast()

  return (
    <>
      <AppLayout>
        <Card title="垚总补给箱" copy="给你留了一点东西。不用马上回复，想看的时候再看就好。">
          <div className="button-row">
            <Button variant="secondary" onClick={() => navigate('/supply-box')}>
              打开看看
            </Button>
          </div>
        </Card>
        {activeTab === 'heal' ? <TodayHeal awardEnergy={awardEnergy} /> : null}
        {activeTab === 'rhythm' ? <OwnRhythm awardEnergy={awardEnergy} /> : null}
        {activeTab === 'outfit' ? <OutfitToday awardEnergy={awardEnergy} /> : null}
        {activeTab === 'spark' ? <LittleSpark awardEnergy={awardEnergy} /> : null}
      </AppLayout>
      <FloatingPet beans={beans} spendBean={spendBean} onToast={showToast} />
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </>
  )
}
