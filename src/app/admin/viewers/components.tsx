'use client';
import type { ViewerData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Laptop, Wifi, Shield, Cpu, MemoryStick, Clock } from 'lucide-react';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

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

type ViewerCardProps = {
    viewer: ViewerData;
}

const ViewerCard = ({ viewer }: ViewerCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>{viewer.city}, {viewer.country}</span>
                    </div>
                     <span className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(viewer.timestamp), { addSuffix: true })}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <InfoRow icon={Shield} label="IP Address" value={viewer.ip} />
                <InfoRow icon={Wifi} label="ISP" value={viewer.isp} />
                <InfoRow icon={Globe} label="Browser" value={viewer.browser} />
                <InfoRow icon={Laptop} label="Operating System" value={viewer.os} />
                <InfoRow icon={Laptop} label="Resolution" value={viewer.resolution} />
                <InfoRow icon={MemoryStick} label="Device Memory" value={viewer.deviceMemory} />
                <InfoRow icon={Cpu} label="CPU Cores" value={String(viewer.cpuCores)} />
            </CardContent>
        </Card>
    )
}

type ViewerListProps = {
    viewers: ViewerData[];
}

export function ViewerList({ viewers }: ViewerListProps) {
    if (viewers.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <p>No viewer data has been recorded yet.</p>
                <p className="text-sm">Visit the public portfolio to record the first view!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewers.map(viewer => <ViewerCard key={viewer.id} viewer={viewer} />)}
        </div>
    )
}
