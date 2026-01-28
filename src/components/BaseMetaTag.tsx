'use client';

import { useEffect } from 'react';

/**
 * Base.dev verification meta tag
 * Adds <meta name="base:app_id" content="..." /> to the document head
 */
export function BaseMetaTag() {
  useEffect(() => {
    // Check if meta tag already exists
    const existingMeta = document.querySelector('meta[name="base:app_id"]');
    if (existingMeta) {
      return;
    }

    // Create and append meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'base:app_id');
    meta.setAttribute('content', '697a5f552dbd4b464042aea2');
    document.head.appendChild(meta);
  }, []);

  return null;
}
