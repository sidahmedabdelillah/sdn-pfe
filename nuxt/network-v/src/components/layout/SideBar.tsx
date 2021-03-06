import React from 'react'
import { ScrollPanel } from 'primereact/scrollpanel'
import { Card } from 'primereact/card'
import TopologyOverView from './SideBarMenues/TopologyOverView'
import useSideBarStore, { SidBarTabsEnum } from '../../stores/sideBarStore'
import HostOverView from './SideBarMenues/HostOverView'
import Settings from './SideBarMenues/Settings'
import SwitchOverView from './SideBarMenues/SwitchOverView'
import LoadbalancerView from './SideBarMenues/LoadBalancer'
const SideBar: React.FC = ({ children }) => {
  const { activeTab } = useSideBarStore()

  return (
    <Card className='h-full !rounded-none '>
      <ScrollPanel>
        {(() => {
          switch (activeTab) {
            case SidBarTabsEnum.TopologyOverView:
                return <TopologyOverView />
            case SidBarTabsEnum.HostOverView:
                return <HostOverView />
            case SidBarTabsEnum.SwitchView:
                return <SwitchOverView />
            case SidBarTabsEnum.LoadBalancerView:
                return <LoadbalancerView />
            case SidBarTabsEnum.SettingsView:
                return <Settings />
          }
        })()}
      </ScrollPanel>
    </Card>
  )
}

export default SideBar
