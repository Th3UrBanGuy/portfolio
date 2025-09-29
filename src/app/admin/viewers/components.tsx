'use client';
import type { ViewerData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Globe, Laptop, Wifi, Shield, Cpu, MemoryStick, Clock, MapPin, Network, Server } from 'lucide-react';
import React, { useState } from 'react';
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

type ViewerDetailDialogProps = {
    viewer: ViewerData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewerDetailDialog = ({ viewer, open, onOpenChange }: ViewerDetailDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Viewer Details</DialogTitle>
                    <DialogDescription>
                        Detailed information for the visit from {viewer.city}, {viewer.country}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-lg'><Globe className='h-5 w-5' /> IP & Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InfoRow icon={Shield} label="IP Address" value={viewer.ip} />
                             <InfoRow icon={Network} label="IP Type" value={viewer.ipType} />
                            <InfoRow icon={Wifi} label="ISP" value={viewer.isp} />
                            <InfoRow icon={MapPin} label="Country" value={viewer.country} />
                            <InfoRow icon={MapPin} label="Region" value={viewer.region} />
                            <InfoRow icon={MapPin} label="City" value={viewer.city} />
                            <InfoRow icon={MapPin} label="Postal" value={viewer.postal} />
                            <InfoRow icon={Server} label="ASN" value={viewer.asn} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-lg'><Laptop className='h-5 w-5' /> Device & Browser</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InfoRow icon={Globe} label="Browser" value={viewer.browser} />
                            <InfoRow icon={Laptop} label="Operating System" value={viewer.os} />
                            <InfoRow icon={Laptop} label="Resolution" value={viewer.resolution} />
                            <InfoRow icon={MemoryStick} label="Device Memory" value={viewer.deviceMemory} />
                            <InfoRow icon={Cpu} label="CPU Cores" value={String(viewer.cpuCores)} />
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

type ViewerCardProps = {
    viewer: ViewerData;
    onClick: () => void;
}

const ViewerCard = ({ viewer, onClick }: ViewerCardProps) => {
    return (
        <Card className='cursor-pointer hover:border-primary transition-colors' onClick={onClick}>
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
                <InfoRow icon={Laptop} label="OS" value={viewer.os} />
                <InfoRow icon={Globe} label="Browser" value={viewer.browser} />
            </CardContent>
        </Card>
    )
}

type ViewerListProps = {
    viewers: ViewerData[];
}

export function ViewerList({ viewers }: ViewerListProps) {
    const [selectedViewer, setSelectedViewer] = useState<ViewerData | null>(null);

    if (viewers.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <p>No viewer data has been recorded yet.</p>
                <p className="text-sm">Visit the public portfolio to record the first view!</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {viewers.map(viewer => <ViewerCard key={viewer.id} viewer={viewer} onClick={() => setSelectedViewer(viewer)} />)}
            </div>
            {selectedViewer && (
                <ViewerDetailDialog 
                    viewer={selectedViewer}
                    open={!!selectedViewer}
                    onOpenChange={() => setSelectedViewer(null)}
                />
            )}
        </>
    )
}
