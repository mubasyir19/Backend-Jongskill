import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<Response | any> => {
  return res.json({
    status: 200,
    message: 'welcome all',
    data: null,
  });
});

export default router;
