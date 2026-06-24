/**
 * Inline SVG data-URIs used by Image demos so they are completely offline-safe
 * (no network requests, no external dependencies). Each image is a 640x320 SVG
 * scene encoded as a data-URI.
 */

/** A warm gradient landscape: amber sky fading into a deep teal horizon. */
export const LANDSCAPE_A =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320" viewBox="0 0 640 320">' +
      '<defs>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#f97316"/>' +
      '<stop offset="60%" stop-color="#fb923c"/>' +
      '<stop offset="100%" stop-color="#fbbf24"/>' +
      '</linearGradient>' +
      '<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#0d9488"/>' +
      '<stop offset="100%" stop-color="#115e59"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect width="640" height="200" fill="url(#sky)"/>' +
      '<rect y="200" width="640" height="120" fill="url(#ground)"/>' +
      '<circle cx="520" cy="90" r="46" fill="#fef08a" opacity="0.9"/>' +
      '<ellipse cx="120" cy="195" rx="70" ry="28" fill="#0f766e"/>' +
      '<ellipse cx="340" cy="198" rx="90" ry="22" fill="#0f766e"/>' +
      '<ellipse cx="560" cy="196" rx="55" ry="20" fill="#0f766e"/>' +
      '</svg>',
  );

/** A cool night scene: purple sky, crescent moon, hills. */
export const LANDSCAPE_B =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320" viewBox="0 0 640 320">' +
      '<defs>' +
      '<linearGradient id="night" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#1e1b4b"/>' +
      '<stop offset="100%" stop-color="#4338ca"/>' +
      '</linearGradient>' +
      '<linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#1e1b4b"/>' +
      '<stop offset="100%" stop-color="#312e81"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect width="640" height="320" fill="url(#night)"/>' +
      '<ellipse cx="160" cy="240" rx="200" ry="100" fill="url(#hill)"/>' +
      '<ellipse cx="500" cy="260" rx="220" ry="100" fill="url(#hill)"/>' +
      '<circle cx="100" cy="70" r="36" fill="#e0e7ff"/>' +
      '<circle cx="115" cy="58" r="28" fill="#1e1b4b"/>' +
      '<circle cx="310" cy="60" r="2.5" fill="#e0e7ff" opacity="0.9"/>' +
      '<circle cx="420" cy="30" r="2" fill="#e0e7ff" opacity="0.7"/>' +
      '<circle cx="520" cy="80" r="1.5" fill="#e0e7ff" opacity="0.8"/>' +
      '<circle cx="200" cy="40" r="1.5" fill="#e0e7ff" opacity="0.6"/>' +
      '<circle cx="600" cy="50" r="2" fill="#e0e7ff" opacity="0.7"/>' +
      '<circle cx="450" cy="100" r="1.5" fill="#e0e7ff" opacity="0.5"/>' +
      '</svg>',
  );
