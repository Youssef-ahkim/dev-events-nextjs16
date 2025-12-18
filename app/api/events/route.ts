import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from 'cloudinary';

import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

// Cloudinary v2 will automatically configure itself if process.env.CLOUDINARY_URL is present.
// We do not need to manually config unless we have separate keys.

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event: any = {}; // Initialize as explicit any or stronger type if possible

        try {
            const rawData = Object.fromEntries(formData.entries());
            event = { ...rawData };
        } catch (e) {
            return NextResponse.json({ message: 'Invalid form data format' }, { status: 400 });
        }

        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: "DevEvent" }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event Created Successfully', event: createEvent }, { status: 201 });

    } catch (e) {
        console.error("Error creating event:", e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 }); // Return 500 for server errors
    }
}


export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events Fetched Successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event Fetching Failed', error: e }, { status: 500 });
    }
}