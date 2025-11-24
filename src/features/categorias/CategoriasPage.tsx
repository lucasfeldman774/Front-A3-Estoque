import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  criarCategoria,
  listarCategorias,
  atualizarCategoria,
  excluirCategoria,
} from "./categoriaService";
import type { Categoria, Tamanho, Embalagem } from "../../types/domain";
import { useState } from "react";

export function CategoriasPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
  });

  const [nome, setNome] = useState("");
  const [tamanho, setTamanho] = useState<Tamanho | "">("");
  const [embalagem, setEmbalagem] = useState<Embalagem | "">("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editTamanho, setEditTamanho] = useState<Tamanho | "">("");
  const [editEmbalagem, setEditEmbalagem] = useState<Embalagem | "">("");

  const criarMut = useMutation({
    mutationFn: () =>
      criarCategoria({
        nome,
        tamanho: tamanho as Tamanho,
        embalagem: embalagem as Embalagem,
      }),
    onSuccess: () => {
      setNome("");
      qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const editarMut = useMutation({
    mutationFn: () =>
      atualizarCategoria(editId!, {
        nome: editNome,
        tamanho: editTamanho as Tamanho,
        embalagem: editEmbalagem as Embalagem,
      }),
    onSuccess: () => {
      setEditId(null);
      qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const excluirMut = useMutation({
    mutationFn: (id: number) => excluirCategoria(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categorias"] }),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Categorias</h2>
      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-400">{String(error)}</p>}
      <div className="card">
        <ul className="space-y-2">
          {data?.map((c) => (
            <li key={c.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{c.nome}</span>
                  <span className="text-sm text-gray-400">
                    {c.tamanho} • {c.embalagem}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn"
                    onClick={() => {
                      setEditId(c.id);
                      setEditNome(c.nome);
                      setEditTamanho(c.tamanho);
                      setEditEmbalagem(c.embalagem);
                    }}
                    disabled={editarMut.isPending}
                  >
                    Editar
                  </button>
                  <button
                    className="btn bg-red-600 hover:bg-red-500 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => excluirMut.mutate(c.id)}
                    disabled={excluirMut.isPending}
                    title="Excluir categoria"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {editId === c.id && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      className="input"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                    />
                    <select
                      className="select"
                      value={editTamanho}
                      onChange={(e) =>
                        setEditTamanho(e.target.value as Tamanho)
                      }
                    >
                      <option value="" disabled>
                        Tamanho
                      </option>
                      <option value="PEQUENO">PEQUENO</option>
                      <option value="MEDIO">MEDIO</option>
                      <option value="GRANDE">GRANDE</option>
                    </select>
                    <select
                      className="select"
                      value={editEmbalagem}
                      onChange={(e) =>
                        setEditEmbalagem(e.target.value as Embalagem)
                      }
                    >
                      <option value="" disabled>
                        Material
                      </option>
                      <option value="PLASTICO">PLASTICO</option>
                      <option value="LATA">LATA</option>
                      <option value="VIDRO">VIDRO</option>
                    </select>
                    <button
                      className="btn"
                      onClick={() => editarMut.mutate()}
                      disabled={
                        editarMut.isPending ||
                        !editNome ||
                        !editTamanho ||
                        !editEmbalagem
                      }
                    >
                      Salvar
                    </button>
                    <button
                      className="btn"
                      onClick={() => setEditId(null)}
                      disabled={editarMut.isPending}
                    >
                      Cancelar
                    </button>
                  </div>
                  {editarMut.error && (
                    <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded p-2">
                      {String(editarMut.error)}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {excluirMut.error && (
          <div className="mt-2 text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded p-2">
            {String(excluirMut.error)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Criar categoria</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <select
            className="select"
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value as Tamanho)}
          >
            <option value="" disabled>
              Tamanho
            </option>
            <option value="PEQUENO">PEQUENO</option>
            <option value="MEDIO">MEDIO</option>
            <option value="GRANDE">GRANDE</option>
          </select>
          <select
            className="select"
            value={embalagem}
            onChange={(e) => setEmbalagem(e.target.value as Embalagem)}
          >
            <option value="" disabled>
              Material
            </option>
            <option value="PLASTICO">PLASTICO</option>
            <option value="LATA">LATA</option>
            <option value="VIDRO">VIDRO</option>
          </select>
          <button
            className="btn"
            onClick={() => criarMut.mutate()}
            disabled={criarMut.isPending || !nome || !tamanho || !embalagem}
          >
            Criar
          </button>
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Preview: Tamanho {tamanho || "—"} • Material {embalagem || "—"}
        </div>
      </div>
    </div>
  );
}
