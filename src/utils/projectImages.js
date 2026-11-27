// Architectural Project Cover Images & Infallible Offline SVGs
export const PROJECT_COVER_IMAGES = {
  'proj-1': 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80', // The Viking Mall – Phase I
  'proj-2': 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&auto=format&fit=crop&q=80', // The Viking Mall – Phase II
  'proj-3': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', // Kailash Behera Residence
  'proj-4': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', // Noor Alam Residence
  'proj-5': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80', // Oasys IT Office
  'proj-6': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80', // Swiss Villa
  'proj-7': 'https://images.unsplash.com/photo-1590059390046-52c6f1418ef0?w=800&auto=format&fit=crop&q=80', // Global Buddhist Village
  'proj-8': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80', // Hanuman Mandir
  'proj-9': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80', // Manas Dash Residence
  'proj-10': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80', // Arman Villa
  'proj-11': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', // AG Office Building
  'proj-12': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80', // DHPL Apartment
  'proj-13': 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80', // Lily International School
  'proj-14': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'  // Silverstone
};

export const TYPE_FALLBACK_IMAGES = {
  Commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
  Residential: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  Institutional: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
  'Interior Design': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
};

// Sleek architectural blueprint fallback Data URL that works with 0 network
export const ARCHITECTURAL_BLUEPRINT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%231C2420"/><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="%232D3832" stroke-width="1"/></pattern></defs><rect width="800" height="400" fill="url(%23grid)"/><g stroke="%23A77B50" stroke-width="2" fill="none" opacity="0.8"><rect x="220" y="80" width="360" height="240" rx="4"/><line x1="220" y1="160" x2="580" y2="160"/><line x1="220" y1="240" x2="580" y2="240"/><line x1="340" y1="80" x2="340" y2="320"/><line x1="460" y1="80" x2="460" y2="320"/><polygon points="200,80 400,30 600,80" fill="%23A77B50" fill-opacity="0.1"/></g><text x="400" y="360" fill="%23A77B50" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="3" text-anchor="middle">CONSTRUCTA ARCHITECTURAL SITE</text></svg>`;

export function getProjectCoverImage(project) {
  if (project?.coverImage && project.coverImage.startsWith('http')) {
    return project.coverImage;
  }
  if (project?.id && PROJECT_COVER_IMAGES[project.id]) {
    return PROJECT_COVER_IMAGES[project.id];
  }
  if (project?.type && TYPE_FALLBACK_IMAGES[project.type]) {
    return TYPE_FALLBACK_IMAGES[project.type];
  }
  return TYPE_FALLBACK_IMAGES.default;
}
