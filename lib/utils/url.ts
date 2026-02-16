// URL state management for shareable lists
// Example: packstack.app/#chrome,vscode,spotify

export function encodeAppIds(appIds: string[]): string {
  return appIds.join(',');
}

export function decodeAppIds(hash: string): string[] {
  const cleanHash = hash.replace(/^#/, '');
  if (!cleanHash) return [];
  return cleanHash.split(',').filter(Boolean);
}

export function updateHash(appIds: string[]): void {
  if (typeof window === 'undefined') return;
  const encoded = encodeAppIds(appIds);
  window.history.replaceState(null, '', encoded ? `#${encoded}` : ' ');
}
