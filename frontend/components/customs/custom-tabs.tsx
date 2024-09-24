import { useState } from 'react'
import { Button, ButtonProps } from '../ui/button'

interface CustomTabsProps {
    tabs: string[]
    isBottomBorder?: boolean
    type?: 'default' | 'label'
    size?: ButtonProps['size']
    handleActiveTabChange: (tab: string) => void
}

export default function CustomTabs({ tabs, handleActiveTabChange, isBottomBorder, type, size }: CustomTabsProps) {
    const [activeTab, setActiveTab] = useState(tabs[0])

    const tabVariant = (tab: string) => {
        if (activeTab === tab) {
            return type === 'label' ? 'activeTabLabel' : 'activeTab'
        }
        return type === 'label' ? 'ghostTabLabel' : 'ghostTab'
    }

    const handleSetActiveTab = (tab: string) => {
        setActiveTab(tab)
        handleActiveTabChange(tab)
    }

    return (
        <div
            id="test-tabs"
            className={`${isBottomBorder ? 'border-b-2 border-slate-100' : ''} flex items-center ${type === 'label' ? 'gap-2' : ''}`}
        >
            {tabs.map((tab, index) => (
                <Button
                    key={index}
                    variant={tabVariant(tab)}
                    size={size || 'default'}
                    onClick={() => handleSetActiveTab(tab)}
                    className={isBottomBorder ? '-mb-[0.1rem]' : ''}
                >
                    {tab}
                </Button>
            ))}
        </div>
    )
}
