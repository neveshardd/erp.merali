import { DashboardPageContent } from "@/app/dashboard-content"
import { PrivateLayoutClient } from "@/components/private-layout-client"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
    return (
        <PrivateLayoutClient>
            <DashboardPageContent />
        </PrivateLayoutClient>
    )
}
