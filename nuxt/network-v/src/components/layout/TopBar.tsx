import  { useState } from 'react';
import { TabMenu, TabMenuTabChangeParams } from 'primereact/tabmenu';

import './TopBar.scss'
import useSideBarStore, { SidBarTabsEnum } from '../../stores/sideBarStore';
const TopBar = () => {

    const [ activeIndex, setActiveIndex ] = useState(0)
    const { setActiveTab } = useSideBarStore()

    const items = [
        {label: 'Topology', icon: 'pi pi-fw pi-sitemap'},
        {label: 'Settings', icon: 'pi pi-fw pi-cog'},


    ];

    const handleTabChange = (e : TabMenuTabChangeParams) => {
        switch(e.index){
            case 0 : 
                setActiveTab(SidBarTabsEnum.TopologyOverView);
                setActiveIndex(e.index)
                break ;
            case 1 : 
                setActiveTab(SidBarTabsEnum.SettingsView);
                setActiveIndex(e.index)
                break ;

            default :
                setActiveIndex(e.index)
        }
    } 

    return (
            <div className="p-card !border-none !rounded-none overflow-hidden">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={handleTabChange} />
            </div>
    );
}
export default TopBar