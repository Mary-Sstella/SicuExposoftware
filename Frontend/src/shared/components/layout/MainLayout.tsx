/*se hace el MainLayout para que el sidebar este en todo el sitio
pero no se pone en el main para evitar que aparezaca en el login por ejemplo*/

import { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import BottomNav from './BottomNav'
import { useThemeStore } from '../../store/themeStore'

function MainLayout() {
    const [topbarVisible, setTopbarVisible] = useState(true)
    const lastScrollY = useRef(0)
    const { isDark } = useThemeStore()

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentY = e.currentTarget.scrollTop
        setTopbarVisible(currentY < lastScrollY.current || currentY < 10)
        lastScrollY.current = currentY
    }

    return (
        <div className={`flex h-screen bg-slate-100 dark:bg-gray-950 ${isDark ? 'dark' : ''}`}>
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className={`transition-transform duration-300 ${topbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <Topbar />
                </div>
                <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
                    <Outlet />
                </div>
                <BottomNav />
            </main>
        </div>
    )
}

export default MainLayout

