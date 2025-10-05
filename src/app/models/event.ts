
export interface Event {
  id: number; // Unique identifier of the event
  titre: string; // Event title
  description: string; // Event description
  date: Date; // Event date
  lieu: string; // Location
  prix: number; // Ticket price
  organisateurId: number; // Organizer identifier
  imageUrl: string; // Path/URL to the event image
  nbplaces: number; // Number of available places
  nbrLike: number; // Number of likes
}
