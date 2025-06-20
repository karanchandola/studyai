import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deck } from "@/models/deck";
import connection from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
    try {
        // Establish database connection
        await connection();
        await deck.syncIndexes(); // Ensure indexes are synced

         // Get the session to retrieve the user ID
         const session = await getServerSession(authOptions);

         if (!session || !session.user || !session.user.id) {
             return NextResponse.json({ error: "Unauthorized", status: 401 });
         }
 
         const userId = session.user.id; // Get the user ID from the session
        // Parse the request body
        const body = await request.json();

        // Create a new deck object
        const newDeck = {
            id: uuidv4(), // Generate a unique ID
            uId: userId, // User ID (reference to the user)
            name: body.name,
            description: body.description || "", // Default to empty string if not provided
            createdAt: new Date(),
            updatedAt: new Date(), // Set the updatedAt field to the current date
        };
        

        // Save the flashcard to the database
        const savedDeck = await deck.create(newDeck);

        // Return the saved flashcard as a response
        return NextResponse.json({ success: true, Deck: savedDeck, status: 201 });
    } catch (e) {
        if (e.code === 11000) {
            return NextResponse.json({ error: "Deck name must be unique", status: 400 });
        }
        console.error(e);
        return NextResponse.json({ error: "Error in server", status: 500 });
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

        const Decks = await deck.find({ uId: session.user.id });

        if (!Decks || Decks.length === 0) {
            return NextResponse.json({ message: "No Decks found", status: 404 });
        }
        return NextResponse.json({decks: Decks, status: 200 });

    } catch (error) {
        console.error("Error fetching Decks:", error);
        return NextResponse.json({ error: "Failed to fetch Decks", status: 500 });
        
    }
}