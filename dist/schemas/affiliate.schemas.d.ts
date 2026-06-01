import { z } from 'zod';
export declare const affiliateSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    membershipType: z.ZodEnum<{
        silver: "silver";
        gold: "gold";
        platinum: "platinum";
    }>;
}, z.core.$strip>;
export type Affiliate = z.infer<typeof affiliateSchema>;
//# sourceMappingURL=affiliate.schemas.d.ts.map