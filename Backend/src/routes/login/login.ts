import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index"; 
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ 
        message: "Endpoint de Login activo. Use el método POST para enviar credenciales.",
        method_required: "POST",
        path: "/api/login"
    });
});

router.post("/", async (req: Request, res: Response) => {
    try {
        
        const { username, password } = req.body; 

        if (!username || !password) {
            return res.status(400).json({ error: "Faltan credenciales" });
        }

        
        const db = await getDb(); 

        
        const result = await db
            .request()
            .input("usuario", sql.NVarChar, username)
            .query("SELECT * FROM Usuarios WHERE Usuario = @usuario"); 

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = result.recordset[0];

        
        const isValid = await bcrypt.compare(password, user.Contrasena);
        if (!isValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id: user.Id,
                nombre: user.Nombre,
                usuario: user.Usuario,
            },
        });
    } catch (error) {
        console.error("ERROR EN API LOGIN (Express):", error);
        
        return res.status(500).json({ 
            error: "Error de servidor interno", 
            detail: "Error en la lógica de la ruta, revisa las dependencias e importaciones."
        });
    }
});

export default router;
