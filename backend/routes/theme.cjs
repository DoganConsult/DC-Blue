const express = require('express');
const router = express.Router();
const pool = require('../db.cjs');
const { authenticateUser } = require('../middleware/auth.cjs');

/**
 * Get user's theme preference
 * GET /api/v1/user/theme
 */
router.get('/user/theme', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get theme preference from users table
    const result = await pool.query(
      'SELECT theme_preference FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const theme = result.rows[0].theme_preference || 'trust-blueprint';
    res.json({ theme });

  } catch (error) {
    console.error('Error fetching theme preference:', error);
    res.status(500).json({ error: 'Failed to fetch theme preference' });
  }
});

/**
 * Update user's theme preference
 * PUT /api/v1/user/theme
 */
router.put('/user/theme', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;

    // Validate theme
    const validThemes = ['trust-blueprint', 'luxury-minimal', 'saudi-excellence'];
    if (!theme || !validThemes.includes(theme)) {
      return res.status(400).json({
        error: 'Invalid theme. Must be one of: ' + validThemes.join(', ')
      });
    }

    // Update theme preference
    await pool.query(
      'UPDATE users SET theme_preference = $1, updated_at = NOW() WHERE id = $2',
      [theme, userId]
    );

    res.json({
      success: true,
      theme,
      message: 'Theme preference updated successfully'
    });

  } catch (error) {
    console.error('Error updating theme preference:', error);
    res.status(500).json({ error: 'Failed to update theme preference' });
  }
});

/**
 * Get platform-wide default theme (admin only)
 * GET /api/v1/admin/platform-theme
 */
router.get('/admin/platform-theme', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get platform theme from settings table (or default)
    const result = await pool.query(
      "SELECT value FROM settings WHERE key = 'platform_theme'"
    );

    const theme = result.rows.length > 0
      ? result.rows[0].value
      : 'trust-blueprint';

    res.json({ theme });

  } catch (error) {
    console.error('Error fetching platform theme:', error);
    res.status(500).json({ error: 'Failed to fetch platform theme' });
  }
});

/**
 * Update platform-wide default theme (admin only)
 * PUT /api/v1/admin/platform-theme
 */
router.put('/admin/platform-theme', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { theme } = req.body;

    // Validate theme
    const validThemes = ['trust-blueprint', 'luxury-minimal', 'saudi-excellence'];
    if (!theme || !validThemes.includes(theme)) {
      return res.status(400).json({
        error: 'Invalid theme. Must be one of: ' + validThemes.join(', ')
      });
    }

    // Update or insert platform theme setting
    await pool.query(`
      INSERT INTO settings (key, value, updated_at)
      VALUES ('platform_theme', $1, NOW())
      ON CONFLICT (key)
      DO UPDATE SET value = $1, updated_at = NOW()
    `, [theme]);

    res.json({
      success: true,
      theme,
      message: 'Platform theme updated successfully'
    });

  } catch (error) {
    console.error('Error updating platform theme:', error);
    res.status(500).json({ error: 'Failed to update platform theme' });
  }
});

module.exports = router;