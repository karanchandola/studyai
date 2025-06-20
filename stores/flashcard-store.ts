import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';



export interface Flashcard {
  uid: string;
  id: string;
  question: string;
  answer: string;
  deckId: string;
  tags: string[];
  isReviewed: boolean;
  lastReviewed: Date | null;
  createdAt: Date;
}

export interface Deck {
  uid: string;
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

interface FlashcardStore {
  flashcards: Flashcard[];
  decks: Deck[];
  currentIndex: number;
  addFlashcard: (
    flashcard: Omit<Flashcard, "id" | "isReviewed" | "lastReviewed" | "createdAt">,
    toast: (options: { title: string; description: string; variant: "success" | "destructive" }) => void
  ) => Promise<void>;
  addDeck: (
    deck: Omit<Deck, "id" | "createdAt">,
    toast: (options: { title: string; description: string; variant: "success" | "destructive" }) => void
  ) => Promise<void>;
  removeDeck: (id: string) => void;
  removeFlashcard: (id: string,
    toast: (options: { title: string; description: string; variant: "success" | "destructive" }) => void
  ) => Promise<void>;
  markAsReviewed: (id: string) => void;
  markAsNeedsReview: (id: string) => void;
  setCurrentIndex: (index: number) => void;
  moveFlashcard: (flashcardId: string, newDeckId: string) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>,
    toast: (options: { title: string; description: string; variant: "success" | "destructive" }) => void
  ) => Promise<void>;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  logout: () => void;
  fetchData: (toast: (options: { title: string; description: string; variant: "success" | "destructive" }) => void
) => Promise<void>;
}


export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set) => ({
      flashcards: [],
      decks: [],
      currentIndex: 0,

      addFlashcard: async (flashcard, toast) => {
        try {
          console.log("Adding flashcard:", flashcard); // Debugging line
          // Send the flashcard data to the backend
          const response = await axios.post('/api/db/flashcards', {
            ...flashcard,
            isReviewed: false,
            lastReviewed: null,
            createdAt: new Date(),
          });

          if (response.data.status === 201) {
            const savedFlashcard = response.data.flashcard;

            set((state) => ({
              flashcards: [...state.flashcards, savedFlashcard],
            }));

            // Show success toast
            toast({
              title: "Flashcard Added",
              description: "Your flashcard has been successfully added.",
              variant: "success",
            });
          } else {
            // Show error toast
            toast({
              title: "Failed to Add Flashcard",
              description: "Something went wrong while adding the flashcard.",
              variant: "destructive",
            });
          }
        } catch (error) {
          // Show error toast
          toast({
            title: "Error",
            description: `Error adding flashcard: ${error.message}`,
            variant: "destructive",
          });
          console.error("Error adding flashcard:", error);
        }
      },

      addDeck: async (deck, toast) => {
        try {
          const response = await axios.post('/api/db/decks', {
            ...deck,
          });

          if (response.data.status === 201) {
            const savedDeck = response.data.Deck;

            set((state) => ({
              decks: [...state.decks, savedDeck],
            }));

            // Show success toast
            toast({
              title: "Deck Added",
              description: "Your deck has been successfully added.",
              variant: "success",
            });
          } else {
            // Show error toast
            toast({
              title: "Failed to Add Deck",
              description: "Something went wrong while adding the deck.",
              variant: "destructive",
            });
          }
        } catch (error) {
          // Show error toast
          toast({
            title: "Error",
            description: `Error adding deck: ${error.message}`,
            variant: "destructive",
          });
          console.error("Error adding deck:", error);
        }
      },
      removeDeck: (id) => {
        set((state) => ({
          decks: state.decks.filter((deck) => deck.id !== id),
        }));
      },

      removeFlashcard: async (id, toast) => {
        try {
          console.log("Deleting flashcard with id:", id); // Debugging line
          const response = await axios.delete(`/api/db/flashcards`, {
            params: { id: id },
          });
          console.log("Response from server:", response);
          // Check if the response status indicates success
          if (response.data.status === 200) {
            set((state) => ({
              flashcards: state.flashcards.filter((flashcard) => flashcard.id !== id),
            }));
          }
          toast({
            title: "Flashcard Deleted",
            description: "The flashcard has been successfully deleted.",
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the flashcard.",
            variant: "destructive",
          });
          console.error("Error deleting flashcard:", error);
        }
      },

      markAsReviewed: (id) => {
        set((state) => ({
          flashcards: state.flashcards.map((flashcard) =>
            flashcard.id === id ? { ...flashcard, isReviewed: true } : flashcard
          ),
        }));
      },

      markAsNeedsReview: (id) => {
        set((state) => ({
          flashcards: state.flashcards.map((flashcard) =>
            flashcard.id === id ? { ...flashcard, isReviewed: false } : flashcard
          ),
        }));
      },

      setCurrentIndex: (index) => {
        set(() => ({ currentIndex: index }));
      },

      moveFlashcard: (flashcardId, newDeckId) => {
        set((state) => ({
          flashcards: state.flashcards.map((flashcard) =>
            flashcard.id === flashcardId ? { ...flashcard, deckId: newDeckId } : flashcard
          ),
        }));
      },

      updateFlashcard: async (id, updates, toast) => {
        try {
          // Send the update request to the backend
          const response = await axios.put(`/api/db/flashcards`, {
            id: id,
            ...updates,
          });
          console.log("Response from server:", response);
          // Check if the response status indicates success
          if (response.status === 200) {
            const updatedFlashcard = response.data;

            // Update the local state with the updated flashcard
            set((state) => ({
              flashcards: state.flashcards.map((flashcard) =>
                flashcard.id === id ? { ...flashcard, ...updatedFlashcard } : flashcard
              ),
            }));

            // Show success toast
            toast({
              title: "Flashcard Updated",
              description: "The flashcard has been successfully updated.",
              variant: "success",
            });
          } else {
            // Handle unexpected status codes
            toast({
              title: "Error",
              description: "Failed to update the flashcard. Please try again.",
              variant: "destructive",
            });
            console.error("Unexpected response status:", response.status);
          }
        } catch (error) {
          // Handle errors (e.g., network issues or server errors)
          toast({
            title: "Error",
            description: "Failed to update the flashcard.",
            variant: "destructive",
          });
          console.error("Error updating flashcard:", error);
        }
      },

      updateDeck: (id, updates) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === id ? { ...deck, ...updates } : deck
          ),
        }));
      },

      // Logout function to clear flashcards and decks
      logout: () => {
        set(() => ({
          flashcards: [], // Clear flashcards
          decks: [], // Clear decks
        }));
        localStorage.removeItem("flashcard-storage"); // Clear persisted local storage
      },

      fetchData: async (toast) => {
        try {
          const flashcardsResponse = await axios.get(`/api/db/flashcards`);
          const decksResponse = await axios.get(`/api/db/decks`);
      
          console.log("Flashcards response:", flashcardsResponse.data);

          console.log('====================================');
          console.log('decks response:', decksResponse.data);
          console.log('====================================');
          if (flashcardsResponse.status === 200 && decksResponse.status === 200) {
            set(() => ({
              flashcards: flashcardsResponse.data.flashcards,
              decks: decksResponse.data.decks,
            }));
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch data. Please try again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch data.",
            variant: "destructive",
          });
          console.error("Error fetching data:", error);
        }
      },
    }),
    {
      name: "flashcard-storage",
    }
  )
);