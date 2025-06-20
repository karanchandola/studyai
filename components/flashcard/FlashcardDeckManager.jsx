"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useFlashcardStore } from "@/stores/flashcard-store";
import { useToast } from "@/hooks/use-toast";

export function FlashcardDeckManager() {
  
  const [showNewDeckDialog, setShowNewDeckDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addDeck } = useFlashcardStore();
  const { toast } = useToast(); // Initialize toast

  
  const handleSubmit = (e) => {
    
    e.preventDefault(); 
    addDeck({ name, description }, toast);
    setName("");
    setDescription("");
    setShowNewDeckDialog(false);
  };

  return (
    <Dialog open={showNewDeckDialog} onOpenChange={setShowNewDeckDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New Deck
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Deck Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter deck name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter deck description"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Deck
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}