import React, { useState, useEffect } from 'react';
import { Upload, LogOut, Tag, Mail, Phone, MapPin, User, Lock } from 'lucide-react';

// Base de datos de usuarios autorizados
const AUTHORIZED_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrador' },
  { username: 'coordinador', password: 'coord2024', name: 'Coordinador URE' },
  { username: 'EA7KDL', password: 'EA7KDL1', name: 'EA7KDL' },
  { username: 'EA7BHO', password: 'EA7BHO1', name: 'EA7BHO' },
  { username: 'EA7JCL', password: 'EA7JCL1', name: 'EA7JCL' }
];

export default function UREVegaGranada() {
  const [currentPage, setCurrentPage] = useState('portada');
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('todos');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [newDoc, setNewDoc] = useState({ title: '', description: '', tags: '' });
  const [loading, setLoading] = useState(true);

  // Small storage wrapper: prefer window.storage if available, otherwise use localStorage
  const storageAPI = {
    get: async (key) => {
      try {
        if (window.storage && typeof window.storage.get === 'function') {
          return await window.storage.get(key, true);
        }
      } catch (e) {
        // fallthrough to localStorage
      }
      const v = localStorage.getItem(key);
      return v ? { value: v } : null;
    },
    set: async (key, value) => {
      try {
        if (window.storage && typeof window.storage.set === 'function') {
          return await window.storage.set(key, value, true);
        }
      } catch (e) {
        // fallthrough to localStorage
      }
      localStorage.setItem(key, value);
      return true;
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const docsResult = await storageAPI.get('ure_documents');
      const tagsResult = await storageAPI.get('ure_tags');

      if (docsResult && docsResult.value) {
        try {
          setDocuments(JSON.parse(docsResult.value));
        } catch {
          setDocuments([]);
        }
      }
      if (tagsResult && tagsResult.value) {
        try {
          setTags(JSON.parse(tagsResult.value));
        } catch {
          setTags([]);
        }
      }
    } catch (error) {
      console.log('Iniciando con datos vacíos', error);
      setDocuments([]);
      setTags([]);
    }
    setLoading(false);
  };

  const saveDocuments = async (newDocs) => {
    try {
      await storageAPI.set('ure_documents', JSON.stringify(newDocs));
      setDocuments(newDocs);
    } catch (error) {
      console.error('Error guardando documentos:', error);
    }
  };

  const saveTags = async (newTags) => {
    try {
      await storageAPI.set('ure_tags', JSON.stringify(newTags));
      setTags(newTags);
    } catch (error) {
      console.error('Error guardando etiquetas:', error);
    }
  };

  const handleLogin = () => {
    const user = AUTHORIZED_USERS.find(
      (u) => u.username === loginForm.username && u.password === loginForm.password
    );

    if (user) {
      setCurrentUser(user);
      setCurrentPage('admin');
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('portada');
  };

  const handleUploadDocument = async () => {
    if (!newDoc.title || !newDoc.description || !newDoc.tags) {
      alert('Por favor completa todos los campos');
      return;
    }

    const docTags = newDoc.tags.split(',').map((t) => t.trim()).filter((t) => t);

    const doc = {
      id: Date.now(),
      title: newDoc.title,
      description: newDoc.description,
      tags: docTags,
      author: currentUser ? currentUser.name : 'Anónimo',
      date: new Date().toISOString()
    };

    await saveDocuments([doc, ...documents]);

    // Actualizar etiquetas
    const newTagsList = [...tags];
    docTags.forEach((tag) => {
      if (!newTagsList.includes(tag)) {
        newTagsList.push(tag);
      }
    });
    await saveTags(newTagsList);

    setNewDoc({ title: '', description: '', tags: '' });
    alert('Documento publicado exitosamente');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const filteredDocuments =
    selectedTag === 'todos' ? documents : documents.filter((doc) => doc.tags.includes(selectedTag));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">URE - Sección Vega de Granada</h1>
              <p className="text-blue-100 mt-1">Unión de Radioaficionados Españoles</p>
            </div>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Salir ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage('portada')}
              className={`px-6 py-3 font-medium transition ${
                currentPage === 'portada'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              PORTADA
            </button>
            <button
              onClick={() => setCurrentPage('sobre')}
              className={`px-6 py-3 font-medium transition ${
                currentPage === 'sobre'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              SOBRE LA SECCIÓN
            </button>
            <button
              onClick={() => setCurrentPage('trayectoria')}
              className={`px-6 py-3 font-medium transition ${
                currentPage === 'trayectoria'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              TRAYECTORIA
            </button>
            <button
              onClick={() => setCurrentPage('contacto')}
              className={`px-6 py-3 font-medium transition ${
                currentPage === 'contacto'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              CONTACTO
            </button>
            <button
              onClick={() => setCurrentPage('acceso')}
              className={`px-6 py-3 font-medium transition ${
                currentPage === 'acceso'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              ACCESO
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* PORTADA */}
        {currentPage === 'portada' && (
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Documentos y Trabajos</h2>

              {filteredDocuments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  {selectedTag === 'todos'
                    ? 'No hay documentos publicados aún.'
                    : `No hay documentos con la etiqueta "${selectedTag}".`}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{doc.title}</h3>
                      <p className="text-gray-600 mb-3">{doc.description}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex gap-2">
                          {doc.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 ml-auto">
                          <span>{doc.author}</span> •{' '}
                          <span>{new Date(doc.date).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Tags */}
            <div className="w-64">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Etiquetas
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTag('todos')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedTag === 'todos'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos los documentos
                  </button>
                  {tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTag(tag)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOBRE LA SECCIÓN */}
        {currentPage === 'sobre' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Sobre la Sección</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  La Sección de la Vega de Granada de la Unión de Radioaficionados Españoles (URE) es un punto de encuentro para todos los radioaficionados de la comarca de la Vega de Granada y zonas limítrofes.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nuestra sección tiene como objetivo principal promover la radioafición en todas sus modalidades, fomentar el compañerismo entre radioaficionados y servir como punto de apoyo técnico y administrativo para todos los socios.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Nuestros Objetivos</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Promover la radioafición y las telecomunicaciones</li>
                  <li>Organizar actividades y eventos para radioaficionados</li>
                  <li>Fomentar la formación técnica de nuestros miembros</li>
                  <li>Colaborar en situaciones de emergencia con las autoridades</li>
                  <li>Mantener activos los repetidores de la zona</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TRAYECTOR
