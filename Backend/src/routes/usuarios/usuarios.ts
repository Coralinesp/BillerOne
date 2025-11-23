import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index";
import bcrypt from "bcryptjs";

const router = Router();

/*****************************************************
 * 1. OBTENER TODOS LOS USUARIOS
 *****************************************************/
router.get("/", async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const result = await db.query("SELECT Id, Nombre, Usuario FROM Usuarios");

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

/*****************************************************
 * 2. CREAR USUARIO
 *****************************************************/
router.post("/", async (req: Request, res: Response) => {
    try {
        const { Nombre, Usuario, Password } = req.body;

        if (!Nombre || !Usuario || !Password) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const db = await getDb();

        const hash = await bcrypt.hash(Password, 10);

        await db
            .request()
            .input("Nombre", sql.NVarChar, Nombre)
            .input("Usuario", sql.NVarChar, Usuario)
            .input("Contrasena", sql.NVarChar, hash)
            .query(`
                INSERT INTO Usuarios (Nombre, Usuario, Contrasena)
                VALUES (@Nombre, @Usuario, @Contrasena)
            `);

        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

/*****************************************************
 * 3. ACTUALIZAR USUARIO
 *****************************************************/
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { Nombre, Usuario, Password } = req.body;

        const db = await getDb();

        let query = "UPDATE Usuarios SET ";
        const inputs: any[] = [];

        if (Nombre) {
            query += "Nombre = @Nombre, ";
            inputs.push({ name: "Nombre", type: sql.NVarChar, value: Nombre });
        }

        if (Usuario) {
            query += "Usuario = @Usuario, ";
            inputs.push({ name: "Usuario", type: sql.NVarChar, value: Usuario });
        }

        if (Password) {
            const hash = await bcrypt.hash(Password, 10);
            query += "Contrasena = @Contrasena, ";
            inputs.push({ name: "Contrasena", type: sql.NVarChar, value: hash });
        }

        if (inputs.length === 0) {
            return res.status(400).json({ error: "No se enviaron datos para actualizar" });
        }

        query = query.slice(0, -2);
        query += " WHERE Id = @Id";

        const request = db.request();
        inputs.forEach((i) => request.input(i.name, i.type, i.value));
        request.input("Id", sql.Int, id);

        await request.query(query);

        res.status(200).json({ message: "Usuario actualizado" });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
});

/*****************************************************
 * 4. ELIMINAR USUARIO
 *****************************************************/
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const db = await getDb();

        await db
            .request()
            .input("Id", sql.Int, id)
            .query("DELETE FROM Usuarios WHERE Id = @Id");

        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

export default router;
