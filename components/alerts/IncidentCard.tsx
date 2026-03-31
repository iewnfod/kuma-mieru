'use client';

import { extractPlainText, getMarkdownClasses, useMarkdown } from '@/components/utils/markdown';
import type { Incident } from '@/types/monitor';
import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import clsx from 'clsx';
import { CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import type { DateTimeFormatOptions } from 'next-intl';
import { useMemo } from 'react';
import { dateStringToTimestamp, timezoneOffsetToMs } from '../utils/format';

type IncidentColor = 'primary' | 'warning' | 'danger' | 'default' | 'secondary';

function IncidentCard({ incident }: { incident: Incident }) {
  const t = useTranslations('alert');
  const format = useFormatter();
  const now = Date.now();
  const dateTimeFormat: DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  };

  let { style, title, content, createdDate, lastUpdatedDate } = incident;

  createdDate = createdDate ? `${createdDate} +00:00` : '';
  lastUpdatedDate = lastUpdatedDate ? `${lastUpdatedDate} +00:00` : '';

  const color: IncidentColor = useMemo(() => {
    switch (style) {
      case 'info':
        return 'primary';
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
  }, [style]);

  const AlertIcon = useMemo(() => {
    switch (style) {
      case 'warning':
        return TriangleAlert;
      case 'danger':
        return CircleAlert;
      default:
        return Info;
    }
  }, [style]);

  const cardBorderClass: Record<IncidentColor, string> = {
    primary:
      'border-blue-200/80 dark:border-blue-800/70',
    warning:
      'border-amber-200/80 dark:border-amber-800/70',
    danger:
      'border-rose-200/80 dark:border-rose-800/70',
    default:
      'border-gray-200/80 dark:border-gray-700/80',
    secondary:
      'border-violet-200/80 dark:border-violet-800/70',
  };

  const htmlContent = useMarkdown(content);
  const previewText = extractPlainText(content, 200);

  return (
    <Card
      className={clsx(
        'mb-6 w-full border shadow-xs',
        cardBorderClass[color]
      )}
    >
      <CardHeader className="flex items-center gap-3 pb-2 pt-4 px-5">
        <AlertIcon className="h-5 w-5 shrink-0 text-current opacity-80" />
        <h2 className="flex-1 text-base font-semibold leading-snug">{title}</h2>
        <Chip size="sm" color={color} variant="flat" className="shrink-0">
          {style}
        </Chip>
      </CardHeader>

      <CardBody className="px-5 pt-1 pb-4 space-y-3">
        {htmlContent ? (
          <div
            className={getMarkdownClasses()}
            // oxlint-disable-next-line react/no-danger -- 内容已通过 rehype-sanitize 白名单净化
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">{previewText}</p>
        )}

        <div className="flex flex-col items-end gap-1 border-t border-gray-200/80 pt-3 dark:border-gray-700/70">
          {lastUpdatedDate ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('updatedAt', {
                time: format.relativeTime(dateStringToTimestamp(lastUpdatedDate), now),
              })}
            </span>
          ) : null}
          {createdDate ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('createdAt', {
                time: format.dateTime(
                  dateStringToTimestamp(createdDate) + timezoneOffsetToMs('+00:00'),
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

export default IncidentCard;
