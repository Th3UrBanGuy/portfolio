import { DeviceInfoCard, NetworkInfoCard } from './components';

export default function ViewersPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceInfoCard />
        <NetworkInfoCard />
    </div>
  );
}
