"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight, Trash2, Pencil} from "lucide-react";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function FlashcardViewer({
  flashcard,
  onNext,
  onPrevious,
  onMarkReviewed,
  onMarkNeedsReview,
}) {

  if (!flashcard) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No flashcards available</p>
      </Card>
    );
  }


  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { removeFlashcard } = useFlashcardStore();
  const { updateFlashcard } = useFlashcardStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(flashcard.question);
  const [editedAnswer, setEditedAnswer] = useState(flashcard.answer);
  const [deckId, setDeckId] = useState(flashcard.deckId);
  const [tags, setTags] = useState(flashcard.tags);
  const { decks } = useFlashcardStore();
  const { toast } = useToast();


  const deleteFlashCard = () => {
    removeFlashcard(flashcard.id, toast);
    setShowDeleteDialog(false);
  };

  const updateFlashCard = () => {
    updateFlashcard(flashcard.id, { question: editedQuestion, answer: editedAnswer, deckId: deckId, tags: tags }, toast);
    setShowEditDialog(false);
  };





  return (
    <div className="space-y-4">
      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FlashCard</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this flashcard? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteFlashCard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FlashCard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question</label>
              <Input
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                placeholder="Edit the question"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                placeholder="Edit the answer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deck</label>
              <Select value={deckId} onValueChange={setDeckId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a deck" />
                </SelectTrigger>
                <SelectContent>
                  {decks.map((deck) => (
                    <SelectItem key={deck.id} value={deck.id}>
                      {deck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., math, algebra, equations"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={updateFlashCard}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <div className="relative h-[400px] perspective-1000">
        <motion.div
          className="w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
          style={{ transformStyle: "preserve-3d" }}
        >



          <Card
            className={`absolute inset-0 p-6 flex flex-col items-center justify-center text-center backface-hidden
              ${isFlipped ? "opacity-0" : "opacity-100"}`}
          >

            {/* Buttons */}
            <div className="absolute top-4 right-4 z-40 flex">
              <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}>

                <Trash2 className="h-4 w-4 " />
              </Button>
            </div>


            <div className="text-sm text-muted-foreground mb-4">Question</div>
            <p className="text-xl font-medium">{flashcard.question}</p>
            {flashcard.tags.length > 0 && (
              <div className="absolute bottom-4 flex gap-2">
                {flashcard.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
          <Card
            className={`absolute inset-0 p-6 flex flex-col items-center justify-center text-center backface-hidden
              [transform:rotateY(180deg)]
              ${isFlipped ? "opacity-100" : "opacity-0"}`}
          >
            <div className="text-sm text-muted-foreground mb-4">Answer</div>
            <p className="text-xl font-medium">{flashcard.answer}</p>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-red-50 hover:bg-red-100 border-red-200 dark:bg-red-500/70 dark:hover:bg-red-600/65 dark:border-red-50"
            onClick={onMarkNeedsReview}
          >
            <XCircle className="h-4 w-4 mr-2 text-red-500 dark:text-red-50" />
            Needs Review
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Flip Card
          </Button>
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-400/70 dark:hover:bg-green-500/65 dark:border-green-50"
            onClick={onMarkReviewed}
          >
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 dark:text-green-50" />
            Got It
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
