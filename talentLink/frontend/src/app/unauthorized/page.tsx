import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-500">Accès Refusé</h1>
      <p className="text-xl text-gray-400 mb-8">
        Vous n'avez pas la permission d'accéder à cette page.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-primary rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
