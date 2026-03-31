'use client';

import { ExpandableAlert } from '@/components/alerts/ExpandableAlert';
import { useMonitorData } from '@/components/utils/swr';
import { getMonitorStatusKey } from '@/utils/monitor-status';
import type { Heartbeat } from '@/types/monitor';
import { Chip } from '@heroui/react';
import { Activity } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface MonitorEvent {
  monitorId: number;
  monitorName: string;
  status: Heartbeat['status'];
  time: string;
  msg: string;
}

type ChipColor = 'success' | 'danger' | 'warning' | 'primary' | 'default';

function getStatusChipColor(status: Heartbeat['status']): ChipColor {
  switch (status) {
    case 1:
      return 'success';
    case 0:
      return 'danger';
    case 2:
      return 'warning';
    case 3:
      return 'primary';
    default:
      return 'default';
  }
}

const MAX_EVENTS = 10;
const OK_MESSAGE = 'ok';

export function EventList() {
  const t = useTranslations('event');
  const format = useFormatter();
  const { monitorGroups, monitoringData } = useMonitorData();

  const events = useMemo<MonitorEvent[]>(() => {
    const monitorNameMap = new Map<number, string>();
    for (const group of monitorGroups) {
      for (const monitor of group.monitorList) {
        monitorNameMap.set(monitor.id, monitor.name);
      }
    }

    const allEvents: MonitorEvent[] = [];

    for (const [monitorIdStr, heartbeats] of Object.entries(monitoringData.heartbeatList)) {
      if (!heartbeats || heartbeats.length === 0) continue;

      const monitorId = Number.parseInt(monitorIdStr, 10);
      const monitorName = monitorNameMap.get(monitorId) ?? `Monitor ${monitorId}`;

      // Heartbeats are ordered oldest → newest; detect status transitions
      for (let i = 1; i < heartbeats.length; i++) {
        const prev = heartbeats[i - 1];
        const curr = heartbeats[i];
        if (prev.status !== curr.status) {
          allEvents.push({
            monitorId,
            monitorName,
            status: curr.status,
            time: curr.time,
            msg: curr.msg,
          });
        }
      }
    }

    // Most recent first, capped at MAX_EVENTS
    allEvents.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return allEvents.slice(0, MAX_EVENTS);
  }, [monitorGroups, monitoringData.heartbeatList]);

  if (events.length === 0) return null;

  const getStatusLabel = (status: Heartbeat['status']) => {
    const key = getMonitorStatusKey(status);
    switch (key) {
      case 'up':
        return t('statusUp');
      case 'down':
        return t('statusDown');
      case 'pending':
        return t('statusPending');
      case 'maintenance':
        return t('statusMaintenance');
      default:
        return t('statusUnknown');
    }
  };

  const previewText = t('preview', { count: events.length });

  return (
    <ExpandableAlert
      title={t('title')}
      preview={previewText}
      color="default"
      className="mb-8"
      icon={<Activity className="h-4 w-4" />}
    >
      <ul className="grid grid-cols-[7rem_5.5rem_1fr] items-center gap-y-2 gap-x-3 text-sm">
        {events.map((event, idx) => (
          <li
            // oxlint-disable-next-line react/no-array-index-key -- composite key for safety
            key={`${event.monitorId}-${event.time}-${idx}`}
            className="contents"
          >
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {format.relativeTime(new Date(event.time))}
            </span>
            <span>
              <Chip
                size="sm"
                color={getStatusChipColor(event.status)}
                variant="flat"
              >
                {getStatusLabel(event.status)}
              </Chip>
            </span>
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {event.monitorName}
              </span>
              {event.msg && event.msg.toLowerCase() !== OK_MESSAGE ? (
                <span className="truncate text-gray-400 dark:text-gray-500">{event.msg}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </ExpandableAlert>
  );
}

export default EventList;
