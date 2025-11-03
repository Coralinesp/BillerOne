import { Router, Request, Response } from "express";
// Si tu archivo de ruta está en src/routes/login/login.js y la DB está en lib/db.js, 
// esta ruta relativa es la más probable. Asegúrate de que sea correcta.
import { getDb, sql } from "../../db/index"; 
import bcrypt from "bcryptjs"; // Asegúrate de que este paquete esté instalado: npm install bcryptjs

const router = Router();

// Handler GET: Sólo para evitar el error "Cannot GET /api/login" al acceder por navegador.
router.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ 
        message: "Endpoint de Login activo. Use el método POST para enviar credenciales.",
        method_required: "POST",
        path: "/api/login"
    });
});

// Handler POST: Lógica de inicio de sesión
router.post("/", async (req: Request, res: Response) => {
    try {
        // Express ya parsea el cuerpo con app.use(express.json());
        const { username, password } = req.body; 

        if (!username || !password) {
            return res.status(400).json({ error: "Faltan credenciales" });
        }

        // ⚠️ CONEXIÓN A DB
        const db = await getDb(); 

        // 1. Buscar usuario por nombre
        const result = await db
            .request()
            .input("usuario", sql.NVarChar, username)
            .query("SELECT * FROM Usuarios WHERE Usuario = @usuario"); 

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = result.recordset[0];

        // 2. Verificar contraseña con bcrypt
        const isValid = await bcrypt.compare(password, user.Contrasena);
        if (!isValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // 3. Login exitoso
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
        // Aseguramos que siempre devolvemos JSON en caso de error 500
        return res.status(500).json({ 
            error: "Error de servidor interno", 
            detail: "Error en la lógica de la ruta, revisa las dependencias e importaciones."
        });
    }
});

export default router;
