import React from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import './whatsapp-link.css';

export function WhatsAppLink({ catalog, floating = false }) {
  if (!catalog.whatsappUrl) return null;
  return (
    <a
      className={`whatsapp-link ${floating ? 'whatsapp-link--floating' : ''}`}
      href={catalog.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp’tan yaz (yeni sekmede açılır)"
    >
      <MessageCircle size={22} aria-hidden="true" />
      <span>WhatsApp’tan yaz</span>
      {!floating && <ArrowUpRight size={17} aria-hidden="true" />}
    </a>
  );
}
