import { Router } from 'express';
import { getMatrixEntry, getAllMatrixEntries } from '../services/regulatory-matrix.js';

export default function matrixApiRouter() {
  const router = Router();

  router.get('/public/service-regulatory-matrix', (req, res) => {
    const { country, activity } = req.query;
    if (activity && country) {
      const entry = getMatrixEntry(activity, country.toUpperCase());
      if (!entry) return res.status(404).json({ error: 'No matrix entry for this activity/country pair' });
      return res.json({ data: entry });
    }
    if (country) {
      const entries = getAllMatrixEntries(country.toUpperCase());
      return res.json({ data: entries });
    }
    return res.status(400).json({ error: 'Provide at least country query parameter' });
  });

  return router;
}
