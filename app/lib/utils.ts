import { siteConfig } from '@/config/site';

export function addDocumentData() {
    if (document) {
        document.title = siteConfig.name ?? 'Kuma Mieru';
        const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") ?? document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = siteConfig.icon;
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}
