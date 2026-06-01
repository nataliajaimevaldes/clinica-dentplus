import type { Request, Response } from 'express';
export declare class AffiliateController {
    static index(req: Request, res: Response): Promise<void>;
    static createView(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
    static show(req: Request, res: Response): Promise<void>;
    static editView(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<void>;
    static simulate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=affiliateController.d.ts.map