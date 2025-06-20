import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFlashcardStore } from "@/stores/flashcard-store";

export function FlashcardStatsPanel({ flashcards, selectedDeck }) {
  const { decks } = useFlashcardStore();
  
  const totalCards = flashcards.length;
  const reviewedCards = flashcards.filter((card) => card.isReviewed).length;
  const reviewProgress = totalCards > 0 ? (reviewedCards / totalCards) * 100 : 0;

  const currentDeck = selectedDeck ? decks.find((deck) => deck.id === selectedDeck) : null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-2">Study Progress</h3>
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium">{Math.round(reviewProgress)}%</span>
              </div>
              <Progress value={reviewProgress} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Cards</span>
                <span className="font-medium">{totalCards}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Reviewed</span>
                <span className="font-medium text-green-600">{reviewedCards}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Needs Review</span>
                <span className="font-medium text-red-600">{totalCards - reviewedCards}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {currentDeck && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Deck</h3>
          <Card className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">{currentDeck.name}</h4>
              <p className="text-sm text-muted-foreground">{currentDeck.description}</p>
              <div className="text-sm">
                Created: {new Date(currentDeck.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Study Tips</h3>
        <Card className="p-4">
          <ul className="space-y-2 text-sm">
            <li>• Review cards regularly for better retention</li>
            <li>• Focus on cards marked as "Needs Review"</li>
            <li>• Create meaningful connections between concepts</li>
            <li>• Use spaced repetition for optimal learning</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
