import { NextRequest, NextResponse } from 'next/server';
import { getUserInteractionsCollection, UserInteraction } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getUserInteractionsCollection();
    const interactions = await collection.find({}).sort({ timestamp: -1 }).toArray();
    
    // Convert MongoDB documents to the expected format
    const formattedInteractions = interactions.map(interaction => ({
      type: interaction.type,
      walletAddress: interaction.walletAddress,
      userAgent: interaction.userAgent,
      data: interaction.data,
      id: interaction.id,
      timestamp: interaction.timestamp,
      sessionId: interaction.sessionId,
      ip: interaction.ip
    }));
    
    return NextResponse.json(formattedInteractions);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const interaction: UserInteraction = await request.json();
    const collection = await getUserInteractionsCollection();
    
    if (!interaction.timestamp) {
      interaction.timestamp = new Date().toISOString();
    }
    
   
    const interactionData = interaction;
    
    await collection.insertOne(interactionData);
    
    return NextResponse.json({ message: 'Interaction saved successfully' });
  } catch (error) {
    console.error('Error saving interaction:', error);
    return NextResponse.json(
      { error: 'Failed to save interaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Optional: Add endpoint to clear interactions (admin only)
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');
    
    if (confirm !== 'true') {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    const collection = await getUserInteractionsCollection();
    await collection.deleteMany({});
    
    return NextResponse.json({ message: 'Interactions cleared successfully' });
  } catch (error) {
    console.error('Error clearing interactions:', error);
    return NextResponse.json(
      { error: 'Failed to clear interactions' },
      { status: 500 }
    );
  }
}