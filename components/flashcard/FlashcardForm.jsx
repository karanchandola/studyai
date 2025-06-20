"use client";

import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlashcardStore } from "@/stores/flashcard-store";


export function FlashcardForm({ onSubmit }) {
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [deckId, setDeckId] = useState("");
  const [tags, setTags] = useState("");
  const { decks } = useFlashcardStore();
  
  

  const handleSubmit = (e) => {
    console.log("Form submitted with values:",{
      question,
      answer,
      deckId,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
    e.preventDefault();
    onSubmit({
      
      question,
      answer,
      deckId,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
    setQuestion("");
    setAnswer("");
    setDeckId("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Question</label>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the question"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Answer</label>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the answer"
          required
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

      <Button type="submit" className="w-full">
        Create Flashcard
      </Button>
    </form>
  );
}
