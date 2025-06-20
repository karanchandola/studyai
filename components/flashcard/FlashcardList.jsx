import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function FlashcardList({ flashcards, currentIndex, onSelect }) {
  return (
    <div className="p-4 space-y-2">
      {flashcards.map((flashcard, index) => (
        <Card
          key={flashcard.id}
          className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
            index === currentIndex ? "border-orange-500 dark:border-orange-400" : ""
          }`}
          onClick={() => onSelect(index)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-medium line-clamp-2">{flashcard.question}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Last reviewed: {flashcard.lastReviewed
                  ? new Date(flashcard.lastReviewed).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
            {flashcard.isReviewed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
      {flashcards.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No flashcards found
        </div>
      )}
    </div>
  );
}
