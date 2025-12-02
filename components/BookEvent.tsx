"use client";
import { createBooking } from "@/lib/actions/booking.action";
import { useState } from "react";

const BookEvent =  ( { eventId, slug } : { eventId: string; slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const {success } = await createBooking({eventId, slug, email});

        if(success){
            setSubmitted(true);
        }else{
            console.error('Booking failed');
        }

        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div id="book-event">
            {
                submitted ? (
                    <p className="text-sm">Thank you for signing up</p>
                ) : (
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                )
            }
        </div>
    )
}

export default BookEvent