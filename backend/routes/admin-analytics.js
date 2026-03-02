import { Router } from 'express';

export default function adminAnalyticsRouter(pool, portalAuth) {
  const router = Router();

  // Pipeline summary — value by stage
  router.get('/admin/analytics/pipeline', portalAuth, async (req, res) => {
    try {
      const { days = '90' } = req.query;
      const interval = `${Math.min(Math.max(+days, 7), 365)} days`;
      const result = await pool.query(`
        SELECT stage,
               COUNT(*) AS opportunity_count,
               COALESCE(SUM(estimated_value), 0) AS total_value,
               ROUND(AVG(probability)::numeric, 1) AS avg_probability,
               ROUND(COALESCE(SUM(estimated_value * probability / 100), 0)::numeric, 2) AS weighted_value
        FROM opportunities
        WHERE created_at >= NOW() - $1::interval
        GROUP BY stage
        ORDER BY CASE
          WHEN stage = 'discovery' THEN 1
          WHEN stage = 'proposal' THEN 2
          WHEN stage = 'negotiation' THEN 3
          WHEN stage = 'closed_won' THEN 4
          WHEN stage = 'closed_lost' THEN 5 ELSE 6 END
      `, [interval]);

      const totals = await pool.query(`
        SELECT COUNT(*) AS total,
               COALESCE(SUM(estimated_value), 0) AS total_value,
               COALESCE(SUM(estimated_value * probability / 100), 0) AS weighted_value,
               ROUND(AVG(estimated_value)::numeric, 2) AS avg_deal,
               ROUND(
                 (COUNT(*) FILTER (WHERE stage = 'closed_won')::numeric /
                  NULLIF(COUNT(*) FILTER (WHERE stage IN ('closed_won','closed_lost')), 0) * 100
               )::numeric, 1) AS win_rate
        FROM opportunities
        WHERE created_at >= NOW() - $1::interval
      `, [interval]);

      res.json({ by_stage: result.rows, totals: totals.rows[0] || {} });
    } catch (e) {
      console.error('Analytics pipeline error:', e.message);
      res.status(500).json({ error: 'Failed to fetch pipeline analytics' });
    }
  });

  // Leads analytics — by status, source, product_line, monthly trend
  router.get('/admin/analytics/leads', portalAuth, async (req, res) => {
    try {
      const { days = '180' } = req.query;
      const interval = `${Math.min(Math.max(+days, 7), 365)} days`;

      const [byStatus, bySource, byProduct, monthlyTrend] = await Promise.all([
        pool.query(`
          SELECT status, COUNT(*) AS cnt
          FROM lead_intakes WHERE created_at >= NOW() - $1::interval
          GROUP BY status ORDER BY cnt DESC
        `, [interval]),
        pool.query(`
          SELECT COALESCE(source, 'direct') AS source, COUNT(*) AS cnt
          FROM lead_intakes WHERE created_at >= NOW() - $1::interval
          GROUP BY source ORDER BY cnt DESC
        `, [interval]),
        pool.query(`
          SELECT COALESCE(product_line, 'Unspecified') AS product_line, COUNT(*) AS cnt,
                 COUNT(*) FILTER (WHERE status = 'won') AS won,
                 ROUND(AVG(score)::numeric, 1) AS avg_score
          FROM lead_intakes WHERE created_at >= NOW() - $1::interval
          GROUP BY product_line ORDER BY cnt DESC
        `, [interval]),
        pool.query(`
          SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
                 COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE status = 'qualified') AS qualified,
                 COUNT(*) FILTER (WHERE status = 'won') AS won
          FROM lead_intakes WHERE created_at >= NOW() - $1::interval
          GROUP BY DATE_TRUNC('month', created_at)
          ORDER BY month
        `, [interval]),
      ]);

      res.json({
        by_status: byStatus.rows,
        by_source: bySource.rows,
        by_product: byProduct.rows,
        monthly_trend: monthlyTrend.rows,
      });
    } catch (e) {
      console.error('Analytics leads error:', e.message);
      res.status(500).json({ error: 'Failed to fetch lead analytics' });
    }
  });

  // Revenue / Commission analytics
  router.get('/admin/analytics/revenue', portalAuth, async (req, res) => {
    try {
      const { days = '180' } = req.query;
      const interval = `${Math.min(Math.max(+days, 7), 365)} days`;

      const [monthlyRevenue, partnerContribution, commissionsByStatus] = await Promise.all([
        pool.query(`
          SELECT TO_CHAR(DATE_TRUNC('month', o.created_at), 'YYYY-MM') AS month,
                 COUNT(*) FILTER (WHERE o.stage = 'closed_won') AS won_deals,
                 COALESCE(SUM(o.estimated_value) FILTER (WHERE o.stage = 'closed_won'), 0) AS won_value,
                 COUNT(*) AS total_deals,
                 COALESCE(SUM(o.estimated_value), 0) AS total_pipeline
          FROM opportunities o
          WHERE o.created_at >= NOW() - $1::interval
          GROUP BY DATE_TRUNC('month', o.created_at)
          ORDER BY month
        `, [interval]),
        pool.query(`
          SELECT p.company_name, p.tier,
                 COUNT(DISTINCT c.id) AS commission_count,
                 COALESCE(SUM(c.amount), 0) AS total_commission,
                 COALESCE(SUM(c.amount) FILTER (WHERE c.status = 'paid'), 0) AS paid_amount,
                 COALESCE(SUM(c.amount) FILTER (WHERE c.status = 'pending'), 0) AS pending_amount
          FROM commissions c
          JOIN partners p ON p.id = c.partner_id
          WHERE c.created_at >= NOW() - $1::interval
          GROUP BY p.id, p.company_name, p.tier
          ORDER BY total_commission DESC
          LIMIT 10
        `, [interval]),
        pool.query(`
          SELECT status, COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS total
          FROM commissions WHERE created_at >= NOW() - $1::interval
          GROUP BY status
        `, [interval]),
      ]);

      res.json({
        monthly_revenue: monthlyRevenue.rows,
        partner_contribution: partnerContribution.rows,
        commissions_by_status: commissionsByStatus.rows,
      });
    } catch (e) {
      console.error('Analytics revenue error:', e.message);
      res.status(500).json({ error: 'Failed to fetch revenue analytics' });
    }
  });

  // Team performance
  router.get('/admin/analytics/team', portalAuth, async (req, res) => {
    try {
      const { days = '90' } = req.query;
      const interval = `${Math.min(Math.max(+days, 7), 365)} days`;

      const result = await pool.query(`
        SELECT COALESCE(o.owner, 'Unassigned') AS owner,
               COUNT(*) AS opportunity_count,
               COUNT(*) FILTER (WHERE o.stage = 'closed_won') AS won_count,
               ROUND(
                 (COUNT(*) FILTER (WHERE o.stage = 'closed_won')::numeric /
                  NULLIF(COUNT(*) FILTER (WHERE o.stage IN ('closed_won','closed_lost')), 0) * 100
                )::numeric, 1) AS win_rate,
               ROUND(AVG(o.estimated_value)::numeric, 2) AS avg_deal_size,
               COALESCE(SUM(o.estimated_value), 0) AS total_pipeline,
               COALESCE(SUM(o.estimated_value) FILTER (WHERE o.stage = 'closed_won'), 0) AS won_value
        FROM opportunities o
        WHERE o.created_at >= NOW() - $1::interval AND o.owner IS NOT NULL
        GROUP BY o.owner
        ORDER BY won_value DESC
      `, [interval]);

      res.json({ data: result.rows });
    } catch (e) {
      console.error('Analytics team error:', e.message);
      res.status(500).json({ error: 'Failed to fetch team analytics' });
    }
  });

  return router;
}
