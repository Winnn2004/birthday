import { useState } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import EntryGate from '../components/EntryGate';
import Hero from '../components/Hero';
import NoteForm from '../components/NoteForm';
import PartyDetails from '../components/PartyDetails';
import Footer from '../components/Footer';
import { fireConfetti } from '../components/ConfettiEffect';
import { addGuest } from '../services/guestService';

const STORAGE_KEY = 'birthday-invite-guest-v2';

function loadSavedGuest() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const savedGuest = rawValue ? JSON.parse(rawValue) : null;

    if (
      savedGuest &&
      typeof savedGuest.guestId === 'string' &&
      typeof savedGuest.name === 'string' &&
      typeof savedGuest.nickname === 'string'
    ) {
      return savedGuest;
    }
  } catch {
    // A malformed or unavailable localStorage entry simply shows the gate again.
  }

  return null;
}

export default function InvitePage() {
  const [guest, setGuest] = useState(loadSavedGuest);

  const handleAdmit = async ({ name, nickname }) => {
    const guestRef = await addGuest({ name, nickname });
    const admittedGuest = { guestId: guestRef.id, name, nickname };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(admittedGuest));
    } catch {
      // The invitation remains usable even if the browser blocks localStorage.
    }

    fireConfetti(true);
    setGuest(admittedGuest);
  };

  const handleChangeGuest = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing else is required when storage is unavailable.
    }
    setGuest(null);
  };

  if (!guest) {
    return <EntryGate onAdmit={handleAdmit} />;
  }

  return (
    <div className="invitation-page">
      <main className="invitation-shell">
        <Hero guest={guest} onChangeGuest={handleChangeGuest} />
        <CountdownTimer />
        <PartyDetails />
        <NoteForm guestId={guest.guestId} />
        <Footer />
      </main>
    </div>
  );
}
