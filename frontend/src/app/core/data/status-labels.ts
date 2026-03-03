/**
 * Status label mappings — single source of truth for lead/inquiry status display.
 * Used in track page, workspace pipeline, and admin lead tables.
 */
export const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  new: { en: 'Received', ar: 'تم الاستلام' },
  qualified: { en: 'Under Review', ar: 'قيد المراجعة' },
  contacted: { en: 'In Contact', ar: 'قيد التواصل' },
  proposal: { en: 'Proposal Sent', ar: 'تم إرسال العرض' },
  won: { en: 'Completed', ar: 'مكتمل' },
  lost: { en: 'Closed', ar: 'مغلق' },
};
