# Kuma Mieru :traffic_light:

Kuma Mieru is a third-party Uptime Kuma monitoring dashboard built with Next.js 16, TypeScript, and Recharts.

This project uses Recharts to address pain points in Uptime Kuma's built-in public status page, such as the lack of intuitive displays and latency charts.

<div align="center">

[English](README.en.md) | 中文

<!-- Tech Stack -->

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-v19-387CA0?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-Package%20Manager-14151A?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-4EB9FA?style=flat-square&logo=tailwind-css&logoColor=white)](https://v4.tailwindcss.com/)

</div>

> This branch fixes some bugs from the original version through manual code review and adds support for Uptime Kuma's event features.
>
> Not all environment variables in the current documentation have been fully tested. If you encounter any runtime issues, please report them.

<div id="menu"/>

## Menu
- [Menu](#menu)
- [Preview :camera:](#preview)
- [Features :sparkles:](#features)
- [Quick Start :star:](#quick-start)
    - [Deploy with Vercel](#vercel)
- [Environment Variables Configuration](#env)
- [License :lock:](#license)


<div id="preview"/>

## Preview :camera:
| Dark Mode                     | Light Mode                      |
|-------------------------------|---------------------------------|
| ![Dark Mode](./docs/dark.png) | ![Light Mode](./docs/light.png) |


<div id="features"/>

## Features :sparkles:
- **Real-time Monitoring, Auto-refresh** :arrows_clockwise:: Status updates happen in **real-time** without manual refresh, keeping you informed at all times.
- **Beautiful Responsive Interface** :art:: Built with **HeroUI components**, the interface is modern and **perfectly adapts** to various screen sizes.
- **Interactive Charts** :chart_with_upwards_trend:: Leverages the **Recharts** library for data visualization, allowing **interactive** exploration of each node's latency, status, and other data.
- **Multiple Theme Support** :bulb:: Supports **Dark** / **Light** / **System** themes to suit different preferences.
- **Maintenance Announcements**: Supports Uptime Kuma's **event announcements** and **status update** features for efficient real-time synchronization.


<div id="quick-start"/>

## Quick Start :star:

<div id="vercel"/>

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fiewnfod%2Fkuma-mieru&env=UPTIME_KUMA_BASE_URL,PAGE_ID&project-name=kuma-mieru)


<div id="env"/>

## Environment Variables Configuration

First, assume your Uptime Kuma status page URL is:
`https://kuma.example.com/status/test`

Recommended configuration:
* `UPTIME_KUMA_BASE_URL=https://kuma.example.com`
* `PAGE_ID=test`

Environment variable details (including backwards compatibility):

| Variable Name                    | Required | Description                                                                                            | Example/Default Value                                                                                   |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| UPTIME_KUMA_BASE_URL             | Yes\*    | Backward compatible. Base URL of the Uptime Kuma instance (used when `UPTIME_KUMA_URLS` is not set)   | <https://example.kuma-mieru.invalid>                                                                    |
| PAGE_ID                          | Yes\*    | Backward compatible. Status page ID, supports comma-separated multiple pages (used when `UPTIME_KUMA_URLS` is not set) | default,status-asia                                                                                     |
| UPTIME_KUMA_URLS                 | Yes\*    | Recommended. Full status page URLs, supports separating multiple URLs with `\|` (can be from different Kuma instances) | <https://example.kuma-mieru.invalid/status/default\|https://example.kuma-mieru.invalid/status/secondary> |
| KUMA_MIERU_EDIT_THIS_PAGE        | No       | Whether to show the "Edit This Page" button (new variable name)                                       | false                                                                                                   |
| KUMA_MIERU_SHOW_STAR_BUTTON      | No       | Whether to show the "Star on Github" button (new variable name)                                        | true                                                                                                    |
| KUMA_MIERU_TITLE                 | No       | Custom page title (new variable name)                                                                 | Kuma Mieru                                                                                              |
| KUMA_MIERU_DESCRIPTION           | No       | Custom page description (new variable name)                                                           | A beautiful and modern uptime monitoring dashboard                                                      |
| KUMA_MIERU_ICON                  | No       | Custom page icon URL (new variable name)                                                              | /icon.svg                                                                                               |
| FEATURE_EDIT_THIS_PAGE           | No       | Backward compatible, equivalent to `KUMA_MIERU_EDIT_THIS_PAGE`                                        | false                                                                                                   |
| FEATURE_SHOW_STAR_BUTTON         | No       | Backward compatible, equivalent to `KUMA_MIERU_SHOW_STAR_BUTTON`                                      | true                                                                                                    |
| FEATURE_TITLE                    | No       | Backward compatible, equivalent to `KUMA_MIERU_TITLE`                                                 | Kuma Mieru                                                                                              |
| FEATURE_DESCRIPTION              | No       | Backward compatible, equivalent to `KUMA_MIERU_DESCRIPTION`                                           | A beautiful and modern uptime monitoring dashboard                                                      |
| FEATURE_ICON                     | No       | Backward compatible, equivalent to `KUMA_MIERU_ICON`                                                  | /icon.svg                                                                                               |
| ALLOW_INSECURE_TLS               | No       | Whether to skip upstream Uptime Kuma HTTPS certificate validation (only for trusted self-signed environments) | `false` (default, strict validation) / `true` (skip validation, security risk)                         |
| REQUEST_TIMEOUT_MS               | No       | Global upstream request timeout in milliseconds (default 8000)                                        | `8000`                                                                                                  |
| REQUEST_RETRY_MAX                | No       | Global upstream request maximum retry count (default 3)                                               | `3`                                                                                                     |
| REQUEST_RETRY_DELAY_MS           | No       | Global upstream request retry base interval in milliseconds (default 500)                             | `500`                                                                                                   |
| SSR_STRICT_MODE                  | No       | Whether to enable strict SSR failure mode (global error page when all pages fail)                     | `true` / `false` (default)                                                                              |
| NEXT_PUBLIC_ERROR_PAGE_DEV_MODE  | No       | Whether to show full stack trace on error page                                                         | `false` (default) / `true`                                                                              |
| ALLOW_EMBEDDING                  | No       | Whether to allow embedding in iframe (effective at runtime, no rebuild required after image creation) | `false` (blocked) / `true` (allow all, not recommended) / `example.com,app.com` (whitelist)            |
| STRICT_IMAGE_REMOTE_PATTERNS     | No       | Whether to enable strict remote image domain whitelist (effective at build time)                       | `false` (default, allow all remote image domains) / `true` (only allow domains generated by `generate-image-domains`) |

* Choose either `UPTIME_KUMA_URLS` or `UPTIME_KUMA_BASE_URL + PAGE_ID`.


<div id="license"/>

## License :lock:
This project is licensed under the [MPL-2.0](LICENSE) (Mozilla Public License Version 2.0).
