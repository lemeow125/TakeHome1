export type Widget = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateWidgetInput = {
    text: string;
};

export type UpdateWidgetInput = {
    id: string;
    text: string;
};