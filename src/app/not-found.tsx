import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-6 text-center">
      <h2 className="text-2xl font-bold uppercase tracking-tighter">Erro de Roteamento (404)</h2>
      <p className="text-neutral-500 mt-2">Não conseguimos encontrar esta página no servidor.</p>
      <Link href="/" className="mt-6 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs uppercase font-bold tracking-widest">
        Voltar ao Início
      </Link>
    </div>
  )
}
