'use client';

import { useState, useEffect } from 'react';
import type { ViewerData } from '@/lib/types';
import { getViewers } from '@/lib/services/viewers';
import { ViewerList } from './components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ViewersPage() {
  const [allViewers, setAllViewers] = useState<ViewerData[]>([]);
  const [filteredViewers, setFilteredViewers] = useState<ViewerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [date, setDate] = useState<Date | undefined>();
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const viewers = await getViewers();
      setAllViewers(viewers);
      setFilteredViewers(viewers);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let viewers = allViewers;

    if (date) {
      viewers = viewers.filter(viewer => isSameDay(new Date(viewer.last_visit), date));
    }

    if (location) {
      const lowerLocation = location.toLowerCase();
      viewers = viewers.filter(viewer => 
        viewer.city.toLowerCase().includes(lowerLocation) ||
        viewer.country.toLowerCase().includes(lowerLocation)
      );
    }

    setFilteredViewers(viewers);
  }, [date, location, allViewers]);

  const clearFilters = () => {
    setDate(undefined);
    setLocation('');
  };

  const hasActiveFilters = date || location;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Viewers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full md:w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Filter by last visit date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
          <Input
            placeholder="Filter by City or Country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-grow"
          />
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
                <FilterX className="mr-2" />
                Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Portfolio Viewers ({filteredViewers.length})</h2>
        {isLoading ? (
          <p>Loading viewers...</p>
        ) : (
          <ViewerList viewers={filteredViewers} />
        )}
      </div>
    </div>
  );
}
