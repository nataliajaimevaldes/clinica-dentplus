export declare class AffiliateModel {
    static getAll(): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        id: number;
    }[]>;
    static getById(id: number): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        id: number;
    } | null>;
    static create(data: {
        firstName: string;
        lastName: string;
        email: string;
        membershipType: string;
    }): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        id: number;
    }>;
    static update(id: number, data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        membershipType?: string;
    }): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        id: number;
    }>;
    static delete(id: number): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        id: number;
    }>;
}
//# sourceMappingURL=affiliate.model.d.ts.map