import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { COMPANY } from '../config/company';

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    `Namaste! I'm interested in booking a trek with ${COMPANY.name}. Could you please share available packages?`
  );
  const url = `https://wa.me/${COMPANY.phoneRaw}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-6 left-6 z-50
        flex items-center gap-2.5
        bg-[#25D366] hover:bg-[#20bd5a] text-white
        pl-4 pr-5 py-3.5 rounded-full
        shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40
        hover:-translate-y-0.5 active:scale-95
        transition-all duration-300
        group
      "
    >
      <FaWhatsapp className="text-2xl shrink-0" />
      <span className="hidden sm:inline text-sm font-semibold tracking-wide">
        Chat with us
      </span>
    </a>
  );
}
