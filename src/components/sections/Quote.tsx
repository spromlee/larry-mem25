'use client';

import { RiDoubleQuotesL } from "react-icons/ri";

export default function Quote() {
  return (
    <section id="quote" className="py-16 w-full flex justify-center items-center">
      <div className="flex items-start justify-center gap-4">
      <RiDoubleQuotesL className="-mt-4 text-3xl text-primary min-w-6" />
        <p className="md:text-3xl text-2xl font-roboto-condensed font-light italic">
        May we find comfort in the treasured memories of those no longer with us.
        </p>
      </div>
    </section>
  );
}
