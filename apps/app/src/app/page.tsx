import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the app with default locale
  redirect('/ko');
}
