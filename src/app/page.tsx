"use client"

import { DashboardPageContent } from "./dashboard-content"
import { PrivateLayoutClient } from "@/components/private-layout-client"

export default function Page() {
    return (
        <PrivateLayoutClient>
            <DashboardPageContent />
        </PrivateLayoutClient>
    )
}
