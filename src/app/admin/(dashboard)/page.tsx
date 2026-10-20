import OverviewDashboard from "@/components/admin/OverviewDashboard";
import { getDashboardStats } from "@/lib/cms/dashboard";

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();
  return <OverviewDashboard stats={stats} />;
}
