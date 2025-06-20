import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust the path to your next-auth configuration
import { flashCard } from "@/models/flashcard";
import connection from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
    try {
        // Establish database connection
        await connection();

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const userId = session.user.id; // Get the user ID from the session
        // Parse the request body
        const body = await request.json();

        // Create a new flashcard object
        const newFlashcard = {
            id: uuidv4(), // Generate a unique ID
            deckId: body.deckId, // Deck ID (reference to the deck)
            uId: session.user.id, // User ID (reference to the user)
            isReviewed: body.isReviewed || false, // Default to false if not provided
            lastReviewed: body.lastReviewed || null, // Default to null if not provided
            question: body.question,
            answer: body.answer,
            tags: body.tags || [], // Default to an empty array if not provided
            createdAt: new Date(),
        };

        // Save the flashcard to the database
        const savedFlashcard = await flashCard.create(newFlashcard);

        // Return the saved flashcard as a response
        return NextResponse.json({ success: true, flashcard: savedFlashcard, status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error in server", status: 500 });
    }
}

export async function DELETE(req) {
    try {
        console.log("Deleting flashcard... from Server");
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        // Establish database connection
        await connection();

        // Extract `id` from query parameters
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id"); // Extract the `id` from the query string
        console.log("Extracted ID:", id);

        console.log(typeof (id));
        if (!id) {
            return NextResponse.json({ error: "Flashcard ID is required", status: 400 });
        }

        // Find the flashcard to ensure it belongs to the authenticated user
        const flashcard = await flashCard.findOne({ id });
        console.log("Flashcard found:", flashcard);

        if (!flashcard) {
            return NextResponse.json({ error: "Flashcard not found", status: 404 });
        }

        if (flashcard.uId.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden: You do not own this flashcard", status: 403 });
        }

        // Delete the flashcard from the database
        await flashCard.deleteOne({ id });

        return NextResponse.json({
            success: true,
            message: "Flashcard deleted successfully",
            status: 200,
        });
    } catch (e) {
        console.error("Error deleting flashcard:", e);
        return NextResponse.json({ error: "Failed to delete flashcard", status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        // Establish database connection
        await connection();

        // Parse the request body
        const body = await req.json();
        const { id, ...updates } = body;
        console.log("Extracted ID:", id);

        if (!id) {
            return NextResponse.json({ error: "Flashcard ID is required", status: 400 });
        }
        
        // Find the flashcard to ensure it belongs to the authenticated user
        const flashcard = await flashCard.findOne({ id });

        if (!flashcard) {
            return NextResponse.json({ error: "Flashcard not found", status: 404 });
        }

        if (flashcard.uId.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden: You do not own this flashcard", status: 403 });
        }

        // Update the flashcard in the database
        const updatedFlashcard = await flashCard.findOneAndUpdate({ id }, updates, { new: true });

        return NextResponse.json({
            success: true,
            message: "Flashcard updated successfully",
            flashcard: updatedFlashcard,
            status: 200,
        });
    } catch (e) {
        console.error("Error updating flashcard:", e);
        return NextResponse.json({ error: "Failed to update flashcard", status: 500 });
    }
}


export async function GET(){
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        // Establish database connection
        await connection();

        const flashCards = await flashCard.find({ uId: session.user.id });

        if (!flashCards || flashCards.length === 0) {
            return NextResponse.json({ message: "No flashcards found", status: 404 });
        }
        return NextResponse.json({flashcards: flashCards, status: 200 });

    } catch (error) {
        console.error("Error fetching flashcards:", error);
        return NextResponse.json({ error: "Failed to fetch flashcards", status: 500 });
        
    }
}


