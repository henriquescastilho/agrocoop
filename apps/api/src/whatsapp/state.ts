import { prisma } from "../prisma";

export type ConversationStep =
    | "START"
    | "REGISTER_ROLE"
    | "REGISTER_NAME"
    | "REGISTER_LOCATION"
    | "MAIN_MENU"
    | "OFFER_PRODUCT"
    | "OFFER_QTY"
    | "OFFER_PRICE"
    | "DEMAND_PRODUCT"
    | "DEMAND_QTY"
    | "DEMAND_WINDOW";

export type UserContext = {
    phone: string;
    role: "producer" | "buyer" | "transportador" | "admin" | "unknown";
    step: ConversationStep;
    draft: any;
    name?: string;
};

export async function getState(phone: string): Promise<UserContext> {
    const rawState = await prisma.conversationState.findUnique({
        where: { phone }
    });

    if (!rawState) {
        // Create initial state
        const newState = await prisma.conversationState.create({
            data: {
                phone,
                step: "START",
                role: "unknown",
                draft: "{}"
            }
        });
        return {
            phone: newState.phone,
            role: "unknown",
            step: "START",
            draft: {}
        };
    }

    return {
        phone: rawState.phone,
        role: (rawState.role as any) || "unknown",
        step: (rawState.step as ConversationStep) || "START",
        draft: rawState.draft ? JSON.parse(rawState.draft) : {}
    };
}

export async function updateState(phone: string, updates: Partial<UserContext>) {
    const data: any = {};
    if (updates.step) data.step = updates.step;
    if (updates.role) data.role = updates.role;
    if (updates.draft) data.draft = JSON.stringify(updates.draft);

    return prisma.conversationState.update({
        where: { phone },
        data
    });
}

export async function resetState(phone: string) {
    return prisma.conversationState.update({
        where: { phone },
        data: {
            step: "START",
            draft: "{}"
        }
    });
}
