import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import * as service from './service.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { status, sort } = req.query;
    const voterToken = req.headers['x-voter-token'] || '';
    const items = await service.listFeedback({ status, sort, voterToken });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const item = await service.createFeedback({ title, description });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.get('/admin/verify', adminAuth, (_req, res) => {
  res.json({ ok: true });
});

router.get('/:id', async (req, res, next) => {
  try {
    const voterToken = req.headers['x-voter-token'] || '';
    const item = await service.getFeedback(req.params.id, voterToken);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/vote', async (req, res, next) => {
  try {
    const voterToken = req.headers['x-voter-token'] || req.body.voter_token || '';
    if (!voterToken) {
      return res.status(400).json({ error: 'voter_token is required' });
    }
    const result = await service.toggleVote(req.params.id, voterToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', adminAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    await service.changeStatus(req.params.id, status);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    await service.deleteFeedback(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
