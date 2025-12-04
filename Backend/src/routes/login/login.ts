import { Router, Request, Response } from "express";
import { supabase } from "../../db";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "Endpoint de Login activo. Use el método POST para enviar credenciales.",
    method_required: "POST",
    path: "/api/login",
  });
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Faltan credenciales" });
    }

    const { data: user, error } = await supabase
      .from("usuarios")
      .select("id, usuario, contrasena, nombre")
      .eq("usuario", username)
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    if (error) {
      console.error("Error Supabase en POST /api/login:", error);
      return res.status(500).json({
        error: "Error de servidor interno",
        detail: "Error al consultar el usuario en Supabase.",
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.contrasena);
    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
      },
    });
  } catch (error) {
    console.error("ERROR EN API LOGIN (Express):", error);

    return res.status(500).json({
      error: "Error de servidor interno",
      detail: "Error en la lógica de la ruta, revisa las dependencias e importaciones.",
    });
  }
});

export default router;
