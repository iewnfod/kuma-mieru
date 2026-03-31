import { getConfig } from '@/config/api';
import type { IncidentHistoryResponse } from '@/types/monitor';
import { NextResponse } from 'next/server';
import { customFetchOptions, ensureUTCTimezone } from '@/services/utils/common';
import { customFetch } from '@/services/utils/fetch';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId') ?? undefined;
  const resolvedConfig = getConfig(pageId) ?? getConfig();

  if (!resolvedConfig) {
    return NextResponse.json({ ok: false, error: 'Invalid configuration' }, { status: 500 });
  }

  const incidentHistoryUrl = `${resolvedConfig.baseUrl}/api/status-page/${resolvedConfig.pageId}/incident-history`;

  try {
    const response = await customFetch(incidentHistoryUrl, customFetchOptions);

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Upstream error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as IncidentHistoryResponse;

    const normalizedIncidents = Array.isArray(data.incidents)
      ? data.incidents.map(incident => ({
          ...incident,
          createdDate: ensureUTCTimezone(incident.createdDate),
          lastUpdatedDate: ensureUTCTimezone(incident.lastUpdatedDate),
        }))
      : [];

    return NextResponse.json(
      { ...data, incidents: normalizedIncidents },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch incident history:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
