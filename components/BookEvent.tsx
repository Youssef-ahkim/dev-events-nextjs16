"use client";
import { useState } from "react";

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div id="book-event">
            {
                submitted ? (
                    <p className="text-green-600">Thank you for signing up</p>
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