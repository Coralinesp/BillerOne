"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Article {
  id: string
  code: string
  name: string
  description: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  unit: string
}

const initialArticles: Article[] = [
  {
    id: "ART-001",
    code: "PROD001",
    name: "Laptop HP 15-dy2021la",
    description: "Laptop HP Core i5, 8GB RAM, 256GB SSD",
    category: "Electrónica",
    price: 3500000,
    cost: 2800000,
    stock: 15,
    minStock: 5,
    unit: "Unidad",
  },
  {
    id: "ART-002",
    code: "PROD002",
    name: "Mouse Logitech M185",
    description: "Mouse inalámbrico Logitech",
    category: "Accesorios",
    price: 85000,
    cost: 60000,
    stock: 45,
    minStock: 10,
    unit: "Unidad",
  },
  {
    id: "ART-003",
    code: "PROD003",
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico con iluminación RGB",
    category: "Accesorios",
    price: 450000,
    cost: 320000,
    stock: 8,
    minStock: 5,
    unit: "Unidad",
  },
]

const categories = ["Electrónica", "Accesorios", "Software", "Servicios", "Otros"]
const units = ["Unidad", "Caja", "Paquete", "Servicio", "Hora"]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState<Partial<Article>>({})

  const filteredArticles = articles.filter(
    (article) =>
      article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingArticle) {
      setArticles(articles.map((a) => (a.id === editingArticle.id ? { ...editingArticle, ...formData } : a)))
    } else {
      const newArticle: Article = {
        id: `ART-${String(articles.length + 1).padStart(3, "0")}`,
        code: formData.code || "",
        name: formData.name || "",
        description: formData.description || "",
        category: formData.category || "",
        price: Number(formData.price) || 0,
        cost: Number(formData.cost) || 0,
        stock: Number(formData.stock) || 0,
        minStock: Number(formData.minStock) || 0,
        unit: formData.unit || "Unidad",
      }
      setArticles([...articles, newArticle])
    }
    setIsDialogOpen(false)
    setEditingArticle(null)
    setFormData({})
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData(article)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar este artículo?")) {
      setArticles(articles.filter((a) => a.id !== id))
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingArticle(null)
    setFormData({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Artículos</h1>
          <p className="text-muted-foreground mt-1">Gestione su inventario de productos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({})}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
              <DialogDescription>
                {editingArticle ? "Modifique los datos del artículo" : "Complete los datos del nuevo artículo"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidad *</Label>
                  <Select
                    value={formData.unit || ""}
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost || ""}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Venta *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock || ""}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingArticle ? "Guardar Cambios" : "Crear Artículo"}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Articles Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Código</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Categoría</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Costo</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Margen</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => {
                const margin = ((article.price - article.cost) / article.cost) * 100
                const lowStock = article.stock <= article.minStock
                return (
                  <tr key={article.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{article.code}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{article.name}</p>
                        <p className="text-xs text-muted-foreground">{article.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-foreground">${article.cost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-foreground">
                      ${article.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="text-primary font-medium">+{margin.toFixed(1)}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lowStock ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {article.stock} {article.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredArticles.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No se encontraron artículos</p>
        </Card>
      )}
    </div>
  )
}
