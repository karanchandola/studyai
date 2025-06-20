"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Play, Pause } from "lucide-react";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { FlashcardViewer } from "@/components/flashcard/FlashcardViewer";
import { FlashcardList } from "@/components/flashcard/FlashcardList";
import { FlashcardForm } from "@/components/flashcard/FlashcardForm";
import { FlashcardDeckManager } from "@/components/flashcard/FlashcardDeckManager";
import { FlashcardStatsPanel } from "@/components/flashcard/FlashcardStatsPanel";
import { useToast } from "@/hooks/use-toast";

export default function FlashcardsPage() {
  const [mounted, setMounted] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeck, setSelectedDeck] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const { toast } = useToast(); // Initialize toast


  const {
    flashcards,
    currentIndex,
    setCurrentIndex,
    decks,
    addFlashcard,
    markAsReviewed,
    markAsNeedsReview,
  } = useFlashcardStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, flashcards.length, setCurrentIndex]);

  if (!mounted) return null;

  console.log('====================================');
  console.log('decks : ',decks);
  console.log('====================================');

  const filteredFlashcards = flashcards.filter((card) => {
    console.log("Selected Deck:", selectedDeck, "Card Deck ID:", card);

    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeck = selectedDeck === "all" || card.deckId === selectedDeck; // here it checks if the selected deck is "all" or matches the card's deckId
    const matchesFilter = selectedFilter === "all" ||
                         (selectedFilter === "reviewed" && card.isReviewed) ||
                         (selectedFilter === "needs-review" && !card.isReviewed);
    return matchesSearch && matchesDeck && matchesFilter;
  });

  return (
    <div className=" bg-orange-50/35 dark:bg-orange-950/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Flashcards</h1>
              <p className="text-muted-foreground">Review and manage your study materials</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Flashcard
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Flashcard</DialogTitle>
                  </DialogHeader>
                  <FlashcardForm onSubmit={(data) => {
                    addFlashcard(data,toast); 
                    setShowNewCardDialog(false);
                  }} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => setIsAutoPlay(!isAutoPlay)}>
                {isAutoPlay ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Auto
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Auto Play
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDeck} onValueChange={setSelectedDeck}>
              <SelectTrigger>
                <SelectValue placeholder="Select Deck" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decks</SelectItem>
                {decks.map((deck) => (
                  <SelectItem key={deck.id} value={deck.id}>
                    {deck.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cards</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="needs-review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
            <FlashcardDeckManager />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Flashcard List Sidebar */}
            <Card className="lg:col-span-1 h-[calc(100vh-20rem)]">
              <ScrollArea className="h-full">
                <FlashcardList
                  flashcards={filteredFlashcards}
                  currentIndex={currentIndex}
                  onSelect={setCurrentIndex}
                />
              </ScrollArea>
            </Card>

            {/* Flashcard Viewer */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <FlashcardViewer
                    flashcard={filteredFlashcards[currentIndex]}
                    onNext={() => setCurrentIndex((prev) => (prev + 1) % filteredFlashcards.length)}
                    onPrevious={() => setCurrentIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length)}
                    onMarkReviewed={() => markAsReviewed(filteredFlashcards[currentIndex].id)}
                    onMarkNeedsReview={() => markAsNeedsReview(filteredFlashcards[currentIndex].id)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stats Panel */}
            <Card className="lg:col-span-1 h-[calc(100vh-20rem)]">
              <ScrollArea className="h-full p-4">
                <FlashcardStatsPanel
                  flashcards={filteredFlashcards}
                  selectedDeck={selectedDeck}
                />
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
