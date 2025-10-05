import { Component } from '@angular/core';
import { Event } from '../../models/event';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css'
})
export class ListEventComponent {
  searchTerm: string = '';
  filteredEvents: Event[] = [];
  
  events: Event[] = [
    {
      id: 1,
      titre: 'Concert de Jazz',
      description: 'Un magnifique concert de jazz avec les meilleurs artistes locaux. Venez profiter d\'une soirée musicale exceptionnelle.',
      date: new Date('2023-03-15T20:00:00'), // Date passée pour tester l'expiration
      lieu: 'Théâtre Municipal, Tunis',
      prix: 25,
      organisateurId: 1,
      imageUrl: '/images/event1.jpg',
      nbplaces: 150,
      nbrLike: 45
    },
    {
      id: 2,
      titre: 'Conférence Tech',
      description: 'Découvrez les dernières tendances technologiques avec nos experts. Une conférence interactive pour tous les passionnés de tech.',
      date: new Date('2023-12-20T14:00:00'), // Date passée pour tester l'expiration
      lieu: 'Centre de Conférences, Sfax',
      prix: 15,
      organisateurId: 2,
      imageUrl: '/images/event2.jpg',
      nbplaces: 200,
      nbrLike: 78
    },
    {
      id: 3,
      titre: 'Festival de Cuisine',
      description: 'Découvrez les saveurs authentiques de la cuisine tunisienne. Ateliers culinaires, dégustations et rencontres avec des chefs renommés.',
      date: new Date('2024-12-25T10:00:00'),
      lieu: 'Palais des Congrès, Hammamet',
      prix: 35,
      organisateurId: 3,
      imageUrl: '/images/event3.jpg',
      nbplaces: 100,
      nbrLike: 32
    },
    {
      id: 4,
      titre: 'Tournoi de Football',
      description: 'Tournoi amateur de football ouvert à tous. Inscription par équipe de 7 joueurs. Lots et récompenses pour les gagnants.',
      date: new Date('2024-03-30T09:00:00'),
      lieu: 'Stade Municipal, Monastir',
      prix: 10,
      organisateurId: 4,
      imageUrl: '/images/event4.jpg',
      nbplaces: 80,
      nbrLike: 56
    },
    {
      id: 5,
      titre: 'Exposition d\'Art',
      description: 'Exposition collective d\'artistes tunisiens contemporains. Peintures, sculptures et installations artistiques.',
      date: new Date('2024-04-05T16:00:00'),
      lieu: 'Galerie d\'Art Moderne, Tunis',
      prix: 8,
      organisateurId: 5,
      imageUrl: '/images/event5.jpg',
      nbplaces: 60,
      nbrLike: 23
    },
    {
      id: 6,
      titre: 'Séminaire Business',
      description: 'Séminaire sur l\'entrepreneuriat et l\'innovation. Networking, conférences et ateliers pratiques pour entrepreneurs.',
      date: new Date('2024-04-10T09:00:00'),
      lieu: 'Hôtel Business Center, Tunis',
      prix: 50,
      organisateurId: 6,
      imageUrl: '/images/event6.jpg',
      nbplaces: 120,
      nbrLike: 89
    },
    {
      id: 7,
      titre: 'Festival de Musique Électronique',
      description: 'Un festival de musique électronique avec les meilleurs DJs internationaux. Une expérience sonore unique dans un cadre exceptionnel.',
      date: new Date('2025-10-20T18:00:00'), // Nouvel événement pour 2025
      lieu: 'Arena de Carthage, Tunis',
      prix: 75,
      organisateurId: 7,
      imageUrl: '/images/event7.jpg',
      nbplaces: 500,
      nbrLike: 0
    },
    {
      id: 8,
      titre: 'Conférence Internationale sur l\'IA',
      description: 'Une conférence de renommée mondiale sur l\'intelligence artificielle et ses applications dans l\'industrie. Experts internationaux et démonstrations en direct.',
      date: new Date('2025-10-25T09:00:00'), // Nouvel événement pour le 25/10/2025
      lieu: 'Palais des Congrès, Tunis',
      prix: 120,
      organisateurId: 8,
      imageUrl: '/images/event8.jpg',
      nbplaces: 300,
      nbrLike: 0
    }
  ];

  constructor() {
    this.filteredEvents = [...this.events];
  }

  // Méthode pour filtrer les événements
  filterEvents(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.lieu.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Méthode appelée lors du changement de la recherche
  onSearchChange(): void {
    this.filterEvents();
  }

  // Méthode pour incrémenter le nombre de likes
  likeEvent(eventId: number): void {
    const event = this.events.find(e => e.id === eventId);
    if (event && !this.isEventExpired(event)) {
      event.nbrLike++;
    }
  }

  // Méthode pour vérifier si un événement est expiré
  isEventExpired(event: Event): boolean {
    const now = new Date();
    return event.date < now;
  }

  // Méthode pour obtenir la classe CSS du bouton like
  getLikeButtonClass(event: Event): string {
    return this.isEventExpired(event) ? 'like-btn disabled' : 'like-btn';
  }
}
