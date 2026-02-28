"use client";

import { createBooking } from "@/lib/actions/booking.action";
import { useState } from "react";

interface Props {
  eventId: string;
  slug: string;
}

const BookEvent = ({ eventId, slug }: Props) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = await createBooking({ eventId, slug, email });

    if (success) setSubmitted(true);
    else console.error("Booking creation failed");
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              id="email"
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
      BookEvent
    </div>
  );
};

export default BookEvent;
