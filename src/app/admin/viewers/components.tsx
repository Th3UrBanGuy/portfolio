'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Laptop, Wifi, Shield, Cpu, MemoryStick, Monitor, MousePointer, Power, Globe } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const InfoRow = ({ icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-muted rounded-md">
                {React.createElement(icon, { className: "h-4 w-4 text-muted-foreground"})}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-sm text-muted-foreground text-right">{value}</div>
    </div>
);

const SkeletonRow = () => (
     <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
        <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
    </div>
)


export function DeviceInfoCard() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    const getBrowserInfo = () => {
        const userAgent = navigator.userAgent;
        let browserName = "Unknown";
        let browserVersion = "";
        
        if (userAgent.includes("Firefox")) browserName = "Firefox";
        else if (userAgent.includes("SamsungBrowser")) browserName = "Samsung Browser";
        else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browserName = "Opera";
        else if (userAgent.includes("Trident")) browserName = "Internet Explorer";
        else if (userAgent.includes("Edge")) browserName = "Edge";
        else if (userAgent.includes("Chrome")) browserName = "Chrome";
        else if (userAgent.includes("Safari")) browserName = "Safari";

        const versionMatch = userAgent.match(/(?:Chrome|Firefox|Edge|Version|MSIE|Trident.*rv:|OPR)\/([\d._]+)/);
        if(versionMatch) browserVersion = versionMatch[1];
        
        return `${browserName} ${browserVersion}`;
    }

    const getOS = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes("Win")) return "Windows";
        if (userAgent.includes("Mac")) return "MacOS";
        if (userAgent.includes("X11")) return "UNIX";
        if (userAgent.includes("Linux")) return "Linux";
        if (userAgent.includes("Android")) return "Android";
        if (userAgent.includes("like Mac")) return "iOS";
        return "Unknown";
    }

    const info = {
        browser: getBrowserInfo(),
        os: getOS(),
        resolution: `${window.screen.width} x ${window.screen.height}`,
        viewport: `${window.innerWidth} x ${window.innerHeight}`,
        colorDepth: `${window.screen.colorDepth}-bit`,
        language: navigator.language,
        deviceMemory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A',
        cpuCores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'N/A',
        touchPoints: navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : 'No',
    };
    setDeviceInfo(info);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Laptop className="h-5 w-5" />
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deviceInfo ? (
            <>
                <InfoRow icon={Globe} label="Browser" value={deviceInfo.browser} />
                <InfoRow icon={Laptop} label="Operating System" value={deviceInfo.os} />
                <InfoRow icon={Monitor} label="Screen Resolution" value={deviceInfo.resolution} />
                <InfoRow icon={Monitor} label="Viewport" value={deviceInfo.viewport} />
                <InfoRow icon={MemoryStick} label="Device Memory" value={deviceInfo.deviceMemory} />
                <InfoRow icon={Cpu} label="CPU Cores" value={deviceInfo.cpuCores} />
                <InfoRow icon={MousePointer} label="Touch Support" value={deviceInfo.touchPoints} />
            </>
        ) : (
            Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
        )}
      </CardContent>
    </Card>
  );
}

export function NetworkInfoCard() {
    const [networkInfo, setNetworkInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIpInfo = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setNetworkInfo(data);
            } catch (error) {
                console.error("Error fetching IP info:", error);
                setNetworkInfo({ error: "Could not fetch network data." });
            } finally {
                setLoading(false);
            }
        };
        fetchIpInfo();
    }, []);

    const renderContent = () => {
        if (loading) {
            return Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />);
        }
        if (networkInfo?.error) {
            return <p className="text-destructive text-sm">{networkInfo.error}</p>;
        }
        if (networkInfo) {
            return (
                <>
                    <InfoRow icon={Shield} label="IP Address" value={networkInfo.ip} />
                    <InfoRow icon={Globe} label="Location" value={`${networkInfo.city}, ${networkInfo.country_name}`} />
                    <InfoRow icon={Wifi} label="ISP" value={networkInfo.org} />
                    <InfoRow icon={Power} label="ASN" value={networkInfo.asn} />
                </>
            );
        }
        return null;
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Network Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
