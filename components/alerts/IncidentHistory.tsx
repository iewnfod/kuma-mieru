'use client';

import { getMarkdownClasses, useMarkdown } from '@/components/utils/markdown';
import { dateStringToTimestamp } from '@/components/utils/format';
import { useIncidentHistory } from '@/components/utils/swr';
import type { IncidentHistoryItem } from '@/types/monitor';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import clsx from 'clsx';
import { CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import type { DateTimeFormatOptions } from 'next-intl';
import { useMemo } from 'react';

type IncidentColor = 'default' | 'primary' | 'secondary' | 'warning' | 'danger';

function getIncidentColor(style: IncidentHistoryItem['style']): IncidentColor {
  switch (style) {
    case 'warning':
      return 'warning';
    case 'danger':
      return 'danger';
    case 'light':
      return 'default';
    case 'dark':
      return 'secondary';
    default:
      return 'primary';
  }
}

const cardToneMap: Record<IncidentColor, string> = {
  default:
    'border-gray-200/80 bg-white/90 dark:border-gray-700/80 dark:bg-zinc-900/80',
  primary:
    'border-blue-200/80 bg-blue-50/80 dark:border-blue-800/70 dark:bg-blue-950/35',
  secondary:
    'border-violet-200/80 bg-violet-50/80 dark:border-violet-800/70 dark:bg-violet-950/35',
  warning:
    'border-amber-200/80 bg-amber-50/80 dark:border-amber-800/70 dark:bg-amber-950/35',
  danger:
    'border-rose-200/80 bg-rose-50/80 dark:border-rose-800/70 dark:bg-rose-950/35',
};

function IncidentIcon({ style }: { style: IncidentHistoryItem['style'] }) {
  const cls = 'h-4 w-4 shrink-0';
  switch (style) {
    case 'warning':
      return <TriangleAlert className={cls} />;
    case 'danger':
      return <CircleAlert className={cls} />;
    default:
      return <Info className={cls} />;
  }
}

function IncidentCard({ incident }: { incident: IncidentHistoryItem }) {
  const t = useTranslations('alert');
  const tIncident = useTranslations('incident');
  const format = useFormatter();
  const now = Date.now();
  const dateTimeFormat: DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  };

  const color = useMemo(() => getIncidentColor(incident.style), [incident.style]);
  const htmlContent = useMarkdown(incident.content);

  return (
    <Card className={clsx('border', cardToneMap[color])}>
      <CardHeader className="flex items-start gap-3 px-4 pt-4 pb-2">
        <div className="mt-0.5">
          <IncidentIcon style={incident.style} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {incident.title}
            </h4>
            {incident.active && (
              <Chip size="sm" color={color} variant="flat">
                {tIncident('active')}
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="space-y-3 px-4 py-3">
        <div
          className={getMarkdownClasses()}
          // oxlint-disable-next-line react/no-danger -- 内容已通过 rehype-sanitize 白名单净化
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="flex flex-col items-end gap-1 border-t border-gray-200/80 pt-3 dark:border-gray-700/70">
          {incident.lastUpdatedDate ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('updatedAt', {
                time: format.relativeTime(dateStringToTimestamp(incident.lastUpdatedDate), now),
              })}
            </span>
          ) : null}
          {incident.createdDate ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('createdAt', {
                time: format.dateTime(
                  dateStringToTimestamp(incident.createdDate),
                  dateTimeFormat
                ),
              })}
            </span>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

function IncidentHistoryModule() {
  const t = useTranslations('incident');
  const { incidents, isLoading } = useIncidentHistory();

  const activeIncidents = useMemo(
    () => incidents.filter(i => i.active),
    [incidents]
  );

  if (isLoading || activeIncidents.length === 0) {
    return null;
  }

  return (
    <section className="mb-8" aria-label={t('sectionLabel')}>
      <div className="space-y-3">
        {activeIncidents.map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </section>
  );
}

export default IncidentHistoryModule;
