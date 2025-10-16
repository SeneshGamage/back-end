import { Request, Response } from 'express';
import { MentorRequestService } from '../services/mentorRequest.service';

export class MentorRequestController {
  static async list(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 200;
      const data = await MentorRequestService.listRequests(limit);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await MentorRequestService.getRequestById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const created = await MentorRequestService.createRequest(data);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async changeStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      const updated = await MentorRequestService.updateStatus(id, status);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }
}
