import 'dotenv/config'; 

import express from "express";
import cors from "cors";
import vendedoresRoutes from "./src/routes/vendedores/vendedores"; 
import clientesRoutes from "./src/routes/clientes/clientes";
import loginRoutes from "./src/routes/login/login"; 
import articulosRoutes from "./src/routes/articulos/articulos"; 
import facturasRoutes from "./src/routes/facturas/facturas"; 
import detallefacturaRoutes from "./src/routes/detalle-factura/detalle-factura"; 

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Backend corriendo!");
});

app.use("/api/login", loginRoutes); 
app.use("/api/vendedores", vendedoresRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/articulos", articulosRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/facturas-detalles", detallefacturaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
