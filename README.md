# TaskBoard

## 📋 Proje Açıklaması

> Initialize and plan project: TaskBoard
>
> TaskBoard is a Kanban-style task board built as a React + TypeScript + Vite single-page application. Three columns: To Do, In Progress, Done. Users can add, edit and delete tasks, drag-and-drop them between columns, and persist state through a backend API.

TaskBoard, ekiplerin işlerini görsel olarak takip edebilmesi için tasarlanmış, sürükle-bırak destekli bir Kanban panosu uygulamasıdır. Frontend tarafında **React + TypeScript + Vite**, backend tarafında ise kalıcı veri saklama için **FastAPI + PostgreSQL** kullanılmaktadır.

---

## ✨ Özellikler (Features)

- 🗂️ **Üç Kolonlu Kanban Panosu**: To Do, In Progress, Done
- ➕ Görev ekleme (Create)
- ✏️ Görev düzenleme (Update)
- 🗑️ Görev silme (Delete)
- 🖱️ Sürükle-bırak (Drag & Drop) ile kolonlar arası görev taşıma
- 💾 Backend API üzerinden kalıcı veri saklama (PostgreSQL)
- ⚡ Vite ile hızlı geliştirme deneyimi
- 🔒 Tip güvenliği için tam TypeScript desteği
- 📱 Responsive tasarım

---

## 🛠️ Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | FastAPI (Python) |
| Veritabanı | PostgreSQL |
| State Yönetimi | React Hooks (custom hooks) |
| Drag & Drop | dnd-kit / react-beautiful-dnd |
| Stil | CSS Modules / TailwindCSS |
| API İletişimi | Axios / Fetch |

---

## 📁 Proje Yapısı

Proje, sürdürülebilirlik açısından **küçük ve tek sorumluluklu dosyalar** halinde organize edilmiştir. Hiçbir sayfa dosyası monolitik değildir; sayfa dosyaları yalnızca bileşenleri birleştirir.