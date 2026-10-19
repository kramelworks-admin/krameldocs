import { NextResponse } from "next/server";

import { readRepositoryBinaryFile } from "@/lib/github/repository";

const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json",
  ".zip": "application/zip",
};

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { path } = await context.params;

    if (
      !Array.isArray(path) ||
      path.length === 0 ||
      path.some(
        (segment) =>
          !segment ||
          segment === "." ||
          segment === ".." ||
          segment.includes("/") ||
          segment.includes("\\") ||
          segment.includes(":") ||
          segment.includes("\0"),
      )
    ) {
      return NextResponse.json(
        { error: "Caminho de arquivo inválido." },
        { status: 400 },
      );
    }

    const filePath = path.join("/");
    const extension = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
    const contentType = ALLOWED_CONTENT_TYPES[extension];

    if (!contentType) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido." },
        { status: 415 },
      );
    }

    const file = await readRepositoryBinaryFile(filePath);

    return new Response(new Uint8Array(file.content), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.content.length),
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=60",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Repositório ou arquivo não encontrado")
    ) {
      return NextResponse.json(
        { error: "Arquivo não encontrado." },
        { status: 404 },
      );
    }

    console.error("Falha ao carregar arquivo da documentação:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar o arquivo." },
      { status: 500 },
    );
  }
}
