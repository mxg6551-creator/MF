/**
 * videoUtils.ts
 * High-performance utilities for video iframe parsing, thumbnail extraction,
 * image compression, and embed player normalization.
 */

/**
 * Extracts a thumbnail URL from embed code or video URLs.
 * If a custom thumbnail is provided, it takes precedence.
 * Otherwise, inspects iframe/URL for YouTube, Vimeo, Dailymotion,
 * poster attributes, query params, etc.
 */
export function extractThumbnailFromEmbed(
  embedCode: string = '',
  customThumbnail?: string
): string {
  // If custom thumbnail is provided and non-empty, use it
  if (customThumbnail && customThumbnail.trim().length > 0) {
    return customThumbnail.trim();
  }

  if (!embedCode || !embedCode.trim()) {
    return '';
  }

  const code = embedCode.trim();

  // 1. Look for explicit poster or data-poster attribute in HTML
  const posterAttrMatch = code.match(
    /(?:poster|data-poster|data-thumb|thumb|thumbnail)=["']([^"']+)["']/i
  );
  if (posterAttrMatch && posterAttrMatch[1]) {
    return posterAttrMatch[1].trim();
  }

  // 2. YouTube detection
  const ytMatch = code.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // 3. Vimeo detection
  const vimeoMatch = code.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d{5,12}))/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }

  // 4. Dailymotion detection
  const dmMatch = code.match(
    /(?:dailymotion\.com\/(?:embed\/video\/|video\/)|dai\.ly\/)([a-zA-Z0-9]+)/i
  );
  if (dmMatch && dmMatch[1]) {
    return `https://www.dailymotion.com/thumbnail/video/${dmMatch[1]}`;
  }

  // 5. Look for poster or thumb query param inside URL or iframe src
  const queryThumbMatch = code.match(
    /[?&](?:poster|thumb|thumbnail|cover|image)=([^&"'>\s]+)/i
  );
  if (queryThumbMatch && queryThumbMatch[1]) {
    try {
      return decodeURIComponent(queryThumbMatch[1]);
    } catch {
      return queryThumbMatch[1];
    }
  }

  return '';
}

/**
 * Extracts video title from embed code / URL if available:
 * 1. Checks title="..." attribute in <iframe> tag
 * 2. Checks data-title="..." attribute
 * 3. Checks title in query parameters (?title=... or &title=...)
 * 4. Extracts filename if available
 */
export function extractTitleFromEmbed(embedCode: string = ''): string {
  if (!embedCode || !embedCode.trim()) return '';
  const code = embedCode.trim();

  // 1. title attribute on iframe or tag
  const titleAttrMatch = code.match(/\btitle=["']([^"']+)["']/i);
  if (titleAttrMatch && titleAttrMatch[1] && titleAttrMatch[1].trim()) {
    const raw = titleAttrMatch[1].trim();
    // Exclude generic placeholder titles
    if (!/^(YouTube video player|player|video|embedded video|iframe|vimeo video player)$/i.test(raw)) {
      return raw;
    }
  }

  // 2. data-title attribute
  const dataTitleMatch = code.match(/\bdata-title=["']([^"']+)["']/i);
  if (dataTitleMatch && dataTitleMatch[1] && dataTitleMatch[1].trim()) {
    return dataTitleMatch[1].trim();
  }

  // 3. title query parameter inside URL or iframe src
  const queryTitleMatch = code.match(/[?&](?:title|name|vtitle)=([^&"'>\s]+)/i);
  if (queryTitleMatch && queryTitleMatch[1]) {
    try {
      const decoded = decodeURIComponent(queryTitleMatch[1].replace(/\+/g, ' '));
      if (decoded && decoded.trim()) return decoded.trim();
    } catch {
      return queryTitleMatch[1];
    }
  }

  // 4. Filename extraction if URL ends with video filename
  const filenameMatch = code.match(/\/([^\/?#&]+\.(?:mp4|webm|mkv|mov|avi))/i);
  if (filenameMatch && filenameMatch[1]) {
    const rawName = filenameMatch[1].replace(/\.[a-z0-9]+$/i, '').replace(/[-_]/g, ' ');
    if (rawName.length > 2) return rawName;
  }

  return '';
}

/**
 * Normalizes embed code to extract clean iframe URL or embed type.
 * Also appends flags to hide titles / headers where supported (YouTube, Vimeo).
 */
export function extractIframeSrc(embedCode: string = ''): string | null {
  if (!embedCode || !embedCode.trim()) return null;
  const code = embedCode.trim();

  let srcUrl: string | null = null;

  // If already a clean URL
  if (/^https?:\/\/[^\s<>"']+$/i.test(code)) {
    srcUrl = code;
  } else {
    // Match src inside <iframe ... src="...">
    const iframeMatch = code.match(/<iframe[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
    if (iframeMatch && iframeMatch[1]) {
      srcUrl = iframeMatch[1];
    }
  }

  if (!srcUrl) return null;

  // Optimize YouTube URLs to hide titles, related videos & enable JS API for play/pause
  if (srcUrl.includes('youtube.com') || srcUrl.includes('youtu.be')) {
    const separator = srcUrl.includes('?') ? '&' : '?';
    const params: string[] = [];
    if (!srcUrl.includes('enablejsapi=')) params.push('enablejsapi=1');
    if (!srcUrl.includes('modestbranding=')) params.push('modestbranding=1');
    if (!srcUrl.includes('rel=')) params.push('rel=0');
    if (!srcUrl.includes('showinfo=')) params.push('showinfo=0');
    if (params.length > 0) {
      srcUrl = `${srcUrl}${separator}${params.join('&')}`;
    }
  }

  // Optimize Vimeo URLs to hide title, byline & portrait
  if (srcUrl.includes('vimeo.com')) {
    const separator = srcUrl.includes('?') ? '&' : '?';
    const params: string[] = [];
    if (!srcUrl.includes('title=')) params.push('title=0');
    if (!srcUrl.includes('byline=')) params.push('byline=0');
    if (!srcUrl.includes('portrait=')) params.push('portrait=0');
    if (params.length > 0) {
      srcUrl = `${srcUrl}${separator}${params.join('&')}`;
    }
  }

  return srcUrl;
}

/**
 * Returns the effective thumbnail for a video:
 * 1. video.thumbnailUrl if set and not empty
 * 2. auto-extracted thumbnail from video.embedCode
 * 3. empty string (card will use stylized high-tech poster placeholder)
 */
export function getEffectiveThumbnail(video: {
  thumbnailUrl?: string;
  embedCode?: string;
}): string {
  if (video.thumbnailUrl && video.thumbnailUrl.trim().length > 0) {
    return video.thumbnailUrl.trim();
  }
  return extractThumbnailFromEmbed(video.embedCode || '');
}

/**
 * Compresses an image file from user phone gallery to an optimized JPEG
 * so it takes under ~35KB instead of 3-10MB.
 * Prevents localStorage quota errors and keeps site ultra-fast.
 */
export function compressImage(
  file: File,
  maxWidth = 720,
  maxHeight = 405,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw and export compressed JPEG
        ctx.fillStyle = '#0f111a';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
