'use client';

import { getMarkdownClasses, useMarkdown } from '@/components/utils/markdown';
import { dateStringToTimestamp } from '@/components/utils/format';
import { useIncidentHistory } from '@/components/utils/swr';
import type { IncidentHistoryItem } from '@/types/monitor';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import clsx from 'clsx';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Info,
  TriangleAlert,
} from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import type { DateTimeFormatOptions } from 'next-intl';
import { useMemo, useState } from 'react';

type IncidentColor = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'success';

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
    case 'primary':
      return 'success';
    default:
      return 'primary';
  }
}

const cardToneMap: Record<IncidentColor, string> = {
  default: 'border-gray-200/80 bg-white/90 dark:border-gray-700/80 dark:bg-zinc-900/80',
  primary: 'border-blue-200/80 bg-blue-50/80 dark:border-blue-800/70 dark:bg-blue-950/35',
  secondary: 'border-violet-200/80 bg-violet-50/80 dark:border-violet-800/70 dark:bg-violet-950/35',
  warning: 'border-amber-200/80 bg-amber-50/80 dark:border-amber-800/70 dark:bg-amber-950/35',
  danger: 'border-rose-200/80 bg-rose-50/80 dark:border-rose-800/70 dark:bg-rose-950/35',
  success: 'border-green-200/80 bg-green-50/80 dark:border-green-800/70 dark:bg-green-950/35',
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
    <Card className={clsx('border w-full', cardToneMap[color])}>
      <CardHeader className="flex flex-row items-start justify-center gap-2 px-4 pt-4 pb-4">
        <div className="flex justify-center items-center mt-1">
          <IncidentIcon style={incident.style} />
        </div>
        <div className="flex grow flex-row items-center justify-start gap-2">
          <h4 className="text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">
            {incident.title}
          </h4>
          {incident.active ? (
            <Chip size="sm" color={color} variant="flat">
              {tIncident('active')}
            </Chip>
          ) : (
            <Chip size="sm" color="default" variant="flat">
              {tIncident('resolved')}
            </Chip>
          )}
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="space-y-3 px-4 py-3">
        <div
          className={getMarkdownClasses()}
          // oxlint-disable-next-line react/no-danger -- 内容已通过 rehype-sanitize 白名单净化
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="flex flex-col items-end gap-1 pt-3">
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
                time: format.dateTime(dateStringToTimestamp(incident.createdDate), dateTimeFormat),
              })}
            </span>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

export function ActiveIncidentSection() {
  const t = useTranslations('incident');
  const { incidents, isLoading } = useIncidentHistory();

  const activeIncidents = useMemo(() => incidents.filter(i => i.active), [incidents]);

  if (isLoading || activeIncidents.length === 0) {
    return null;
  }

  return (
    <section className="mb-8" aria-label={t('sectionLabel')}>
      <div className="space-y-4">
        {activeIncidents.map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </section>
  );
}

export function ResolvedIncidentSection() {
  const t = useTranslations('incident');
  const { incidents, isLoading } = useIncidentHistory();
  const [showResolved, setShowResolved] = useState(false);

  const inactiveIncidents = useMemo(() => incidents.filter(i => !i.active), [incidents]);

  if (isLoading || inactiveIncidents.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-700/80"
      aria-label={t('resolvedSectionLabel')}
    >
      <button
        type="button"
        onClick={() => setShowResolved(prev => !prev)}
        className="flex w-full items-center justify-between cursor-pointer rounded-lg border border-gray-200/80 bg-white/60 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50/80 dark:border-gray-700/80 dark:bg-zinc-900/40 dark:text-gray-400 dark:hover:bg-zinc-800/60"
        aria-expanded={showResolved}
      >
        <span className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {showResolved
            ? t('hideResolved')
            : t('showResolved', { count: inactiveIncidents.length })}
        </span>
        {showResolved ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
      </button>

      <div
        className={clsx(
          'grid transition-[grid-template-rows,opacity] duration-200 ease-in-out w-full',
          showResolved ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className={clsx("py-4 w-full", showResolved ? "" : "overflow-hidden")}>
          <div className="space-y-4 flex flex-col justify-start items-center w-full">
            {inactiveIncidents.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
