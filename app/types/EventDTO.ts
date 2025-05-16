export interface EventDTO {
    id: number;
    name: string;
    description: string;
    agenda: string;
    categoryId: number;
    date: string;
    venue: string;
    price: number;
    imageUrl: string;
}

export function mapEventFormToEventDTO(eventId: any, form: any): EventDTO {
    return {
        id: eventId,
        name: form.name,
        description: form.description,
        agenda: form.agenda,
        categoryId: form.categoryId,
        date: form.date,
        venue: form.venue,
        price: form.price,
        imageUrl: form.imageUrl,
    };
}