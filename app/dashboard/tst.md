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
            deckId: userId,
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