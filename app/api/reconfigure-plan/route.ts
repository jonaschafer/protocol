import { NextRequest, NextResponse } from 'next/server';
import { reconfigurePlanSimple } from '@/lib/reconfigure-plan';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raceDate, startDate } = body;

    if (!raceDate || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: raceDate and startDate' },
        { status: 400 }
      );
    }

    // Convert strings to Date objects
    const raceDateObj = new Date(raceDate);
    const startDateObj = new Date(startDate);

    // Validate dates
    if (isNaN(raceDateObj.getTime()) || isNaN(startDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Run the reconfiguration
    const result = await reconfigurePlanSimple(raceDateObj, startDateObj);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
