// /app/api/login/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 })
    }

    const db = await getDb()

    // Buscar usuario por nombre
    const result = await db
      .request()
      .input("usuario", sql.NVarChar, username)
      .query("SELECT * FROM Usuarios WHERE Usuario = @usuario")

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    const user = result.recordset[0]

    // Verificar contraseña con bcrypt
    const isValid = await bcrypt.compare(password, user.Contrasena)
    if (!isValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    // Login exitoso
    return NextResponse.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.Id,
        nombre: user.Nombre,
        usuario: user.Usuario,
      },
    })
  } catch (error) {
    console.error("ERROR EN API LOGIN:", error)
    return NextResponse.json(
      { error: "Error del servidor", detail: String(error) },
      { status: 500 }
    )
  }
}
